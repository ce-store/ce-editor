angular.module('ceEditorApp')

.directive('ceVisualisation', ['$timeout', 'ce', function ($timeout, ceService) {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      ce: '=',
      status: '='
    },
    templateUrl: 'directives/ce-visualisation/ce-visualisation.html',
    controller: ['$scope', function ($scope) {
      $scope.options = {
        showProperties: true
      };

      $scope.toggleOption = function (option) {
        $scope.options[option] = !$scope.options[option];
      };
    }],
    link: function (scope, element, attrs) {

      /* TEST DATA */
      /*
conceptualise a ~ planet ~ P that has the value M as ~ mass ~.
conceptualise a ~ moon ~ M that ~ orbits ~ the planet P.
there is a planet named 'Earth' that has the value 1234 as mass.
there is a moon named 'The Moon' that orbits the planet 'Earth'.


conceptualise a ~ star ~ S that has the value M as ~ mass ~.
conceptualise a ~ planet ~ P that ~ orbits ~ the star S and has the value M as ~ mass ~.
conceptualise a ~ moon ~ M that ~ orbits ~ the planet P and has the value R as ~ radius ~.

there is a star named 'The Sun' that has the value 22123 as mass.
there is a planet named 'Earth' that orbits the star 'The Sun' and has the value 1234 as mass.
there is a moon named 'The Moon' that orbits the planet 'Earth' and has the value 232 as radius.
there is a planet named 'Jupiter' that orbits the star 'The Sun' and  that has the value 133 as mass.
there is a moon named 'Europa' that orbits the planet 'Jupiter' and has the value 213 as radius.
there is a planet named 'Saturn' that orbits the star 'The Sun' and  that has the value 123123 as mass.
there is a planet named 'Mars' that orbits the star 'The Sun' and  that has the value 123123 as mass.
there is a moon named 'Phobos' that orbits the planet 'Mars'.
      */

      scope.type = "model"; // || "instances"
      scope.switchType = function (type) {
        scope.type = type;
        update();
        update(scope.ce);
      };

      var svg;
      var zoom;
      var simulation;
      var sizes = {
        width: 0,
        height: 0,
        node: 30
      };

      var waitForChanges;
      scope.$watch('ce', function () {
        if (waitForChanges) {
          $timeout.cancel(waitForChanges);
        }
        waitForChanges = $timeout(function () {
          update(scope.ce);
        }, 2000);
      });

      /* Create Chart */
      function create() {
        svg = d3.select(element[0]).select('svg');
        updateSize();

        svg.append("g")
          .attr("class", "links");
        svg.append("g")
          .attr("class", "nodes");

        zoom = d3.zoom()
          .scaleExtent([0.4, 2])
          .on("zoom", zoomed);

        svg.call(zoom);
      }
      create();

      function triggerSimulation(graph) {
        simulation = d3.forceSimulation()
          .force('charge', d3.forceManyBody().strength(function (d) {
            return d.type === 'property' ? -30 : -30;
          }))
          .force("center", d3.forceCenter(sizes.width / 2, sizes.height / 2))
          .force('collide', d3.forceCollide().radius(scope.type === 'model' ? 40 : 60).strength(scope.type === 'model' ? 0.2 : 0.5))
          .nodes(graph.nodes)
          .force('link', d3.forceLink(graph.links)
            .distance(function (d) {
              return d.type === 'concept:property:value' ? 50 : 90;
            })
            .id(function (d) {
              return d.id;
            }))
          .on('tick', ticked);
      }



      /* Get latest CE and update the chart */
      function update(ce) {
        if (!ce) {
          // clear the chart when changing visualisation type
          updateVis({
            nodes: [],
            links: []
          });
        } else {
          scope.status = {
            status: 'Processing',
            message: 'Checking if CE is valid'
          };
          ceToForceData(ce)
            .then(function (force) {
              return updateVis(force);
            });
          ceService.validate(ce)
            .then(function (validation) {
              if (validation.data.structured_response.invalid_sentences > 0) {
                throw Error('CE is invalid.');
              } else {
                scope.status = {
                  status: 'OK',
                  message: 'Valid CE'
                };
                // if valid - convert CE to force
                return ceToForceData(ce);
              }
            })
            .then(function (force) {
              // get the latest (valid) CE data and visualise it
              // updateVis(force);
            })
            .catch(function (err) {
              console.error(err);
              scope.status = {
                status: 'Error',
                message: err
              };
            });
        }
      }

      /* Update Chart */
      function updateVis(graph) {
        // Bind the new data
        var node = svg.selectAll('.nodes')
          .selectAll("g.node")
          .data(graph.nodes);

        // Nodes - UPDATE old nodes that may have changed type (property to concept for example)
        var nonPropertyNodes = node.filter(function (d, i) {
          // create a circle for 'concepts', etc.
          return d.type !== 'property' && d3.select(this).select('rect').size() > 0;
        });
        nonPropertyNodes.select('rect').remove();
        nonPropertyNodes.select('.node-shape').append('circle')
          .attr("r", sizes.node);

        var propertyNodes = node.filter(function (d, i) {
          // create a rect for 'properties'.
          return d.type === 'property' && d3.select(this).select('circle').size() > 0;
        });
        propertyNodes.select('circle').remove();
        propertyNodes.select('.node-shape').append('rect')
          .style('transform', 'translate(-' + sizes.node + 'px,-' + 0.5 * sizes.node + 'px)')
          .attr("height", sizes.node)
          .attr("width", 2 * sizes.node);

        // Nodes - ENTER
        var newNodes = node.enter()
          .append("g")
          .attr('class', function (d) {
            return 'node type-' + d.type;
          });
        // Add containes for the labels/shapes so that the z-index stays the same throughout the updating
        newNodes.append('g').attr('class', 'node-shape');
        newNodes.append('g').attr('class', 'node-label');

        newNodes
          .style('opacity', 0)
          .transition().duration(300)
          .style('opacity', 1);

        var newNonPropertyNodes = newNodes
          .filter(function (d, i) {
            // create a circle for 'concepts', etc.
            return d.type !== 'property';
          });
        newNonPropertyNodes.select('.node-shape')
          .append('circle')
          .attr("r", sizes.node);

        var newPropertyNodes = newNodes
          .filter(function (d, i) {
            // create a rect for 'properties'.
            return d.type === 'property';
          });
        newPropertyNodes.select('.node-shape')
          .append('rect')
          .style('transform', 'translate(-' + sizes.node + 'px,-' + 0.5 * sizes.node + 'px)')
          .attr("height", sizes.node)
          .attr("width", 2 * sizes.node);

        newNodes.select('.node-label').append('text')
          .style('transform', 'translate(0px,3px)');

        // Nodes - Exit
        node.exit()
          .style('opacity', 1)
          .transition().duration(300)
          .style('opacity', 0)
          .remove();

        // Nodes - Update All
        svg.selectAll('.nodes')
          .selectAll('g.node')
          .attr('class', function (d) {
            return 'node type-' + d.type;
          })
          .on('click', function (d) {
            console.log(d);
          })
          .on('mouseenter', function (d) {
            highlightConnections(d);
          })
          .on('mouseleave', function () {
            highlightConnections();
          })
          .select('text')
          .text(function (d) {
            return d.label || d.id;
          });

        // Links
        var link = svg.selectAll('.links')
          .selectAll("g.link")
          .data(graph.links);

        var newLinks = link.enter()
          .append('g')
          .attr('class', 'link');

        newLinks.append('line');
        newLinks.append('text');

        svg.selectAll('.links')
          .selectAll('g.link')
          .select('text')
          .text(function (d) {
            return d.property;
          });

        newLinks
          .style('opacity', 0)
          .transition().duration(300)
          .style('opacity', 1);

        link.exit()
          .style('opacity', 1)
          .transition().duration(300)
          .style('opacity', 0)
          .remove();

        // Simulation
        triggerSimulation(graph);
      }

      function ticked() {
        var links = svg.selectAll('.links')
          .selectAll('.link');

        links.select('line')
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        links.select('text')
          .style('transform', function (d) {
            var x = (d.source.x + d.target.x) / 2;
            var y = (d.source.y + d.target.y) / 2;
            return 'translate(' + x + 'px,' + y + 'px)';
          });

        svg.selectAll('.nodes')
          .selectAll('g.node')
          .attr("transform", function (d) {
            // var x = Math.max(sizes.node, Math.min(sizes.width - sizes.node, d.x));
            // var y = Math.max(sizes.node, Math.min(sizes.height - sizes.node, d.y));
            return 'translate(' + d.x + ',' + d.y + ')';
          });
      }

      function zoomed() {
        svg.select('.links').attr("transform", d3.event.transform);
        svg.select('.nodes').attr("transform", d3.event.transform);
      }

      /* Resize the chart based on screen/svg size*/
      function updateSize() {
        sizes.width = svg.node().clientWidth;
        sizes.height = svg.node().clientHeight;
      }

      function highlightConnections(node) {
        console.log(node);
        var duration = 200;
        if (node) {
          var connections = [];
          svg.select('.links')
            .selectAll('.link')
            .filter(function (d) {
              if (d.source.id === node.id) {
                connections.push(d.target.id);
              } else if (d.target.id === node.id) {
                connections.push(d.source.id);
              }
              return d.source.id !== node.id && d.target.id !== node.id;
            })
            .transition().duration(duration)
            .style('opacity', 0.2)

          svg.select('.nodes')
            .selectAll('.node')
            .filter(function (d) {
              console.log(d.id, node.id);
              return d.id !== node.id && connections.indexOf(d.id) === -1;
            })
            .transition().duration(duration)
            .style('opacity', 0.2)
        } else {
          svg.select('.nodes').selectAll('.node')
            .transition().duration(duration)
            .style('opacity', 1)
          svg.select('.links').selectAll('.link')
            .transition().duration(duration)
            .style('opacity', 1)
        }
      }

      /*
        Data Management and Formatting
      */
      function ceToForceData(ce) {
        return ceService.save(ce)
          .then(function () {
            if (scope.type === 'model') {
              return ceService.getConcepts()
                .then(function (allConcepts) {
                  var concepts = [];
                  allConcepts.data.forEach(function (c) {
                    // clear out CE's base concepts
                    if (!ceService.isBaseConcept(c._id)) {
                      concepts.push(c);
                    }
                  });
                  console.log(concepts);
                  return conceptsToForce(concepts);
                });
            } else {
              return ceService.getThings()
                .then(function (allInstances) {
                  var instances = [];
                  allInstances.data.forEach(function (i) {
                    // clear out CE's base concepts
                    if (!ceService.isBaseInstance(i._id)) {
                      instances.push(i);
                    }
                  });
                  console.log(instances);
                  return instancesToForce(instances);
                });
            }
          });
      }

      /*
        CE Concepts to d3js Force Network data structure
      */
      function conceptsToForce(concepts) {
        var graph = {
          nodes: [],
          links: []
        };
        concepts.forEach(function (c) {
          graph.nodes.push({
            id: c._id,
            type: c._type,
            properties: c.direct_property_names
          });
          if (c.direct_property_names) {
            c.direct_property_names.forEach(function (p) {
              graph.nodes.push({
                id: c._id + ':' + p,
                label: p,
                type: 'property'
              });
              graph.links.push({
                source: c._id,
                target: c._id + ':' + p,
                type: 'concept:property:value',
              });
            });
          }
        });
        return graph;
      }

      /*
        CE Instances to d3js Force Network data structure
      */
      function instancesToForce(instances) {
        var graph = {
          nodes: [],
          links: []
        };
        var things = []; // array of the names of instances (for checking relationships later)
        // Nodes
        instances.forEach(function (i) {
          things.push(i._id);
          var node = {
            id: i._id,
            label: i._id,
            type: i._concept[0]
          };
          graph.nodes.push(node);
        });
        // Instances - Links
        instances.forEach(function (i) {
          Object.keys(i).forEach(function (k) {
            if (k.indexOf('_') !== 0) {
              if (things.indexOf(i[k]) > -1) {
                // the value of this key is another concept
                graph.links.push({
                  source: i._id,
                  target: i[k],
                  type: 'concept:property:concept',
                  property: k
                });
              } else {
                // standard property that has no direct link to another concept
                graph.nodes.push({
                  id: i._id + ':' + i[k],
                  label: i[k],
                  type: 'property'
                });
                graph.links.push({
                  source: i._id,
                  target: i._id + ':' + i[k],
                  type: 'concept:property:value',
                  property: k
                });
              }
            }
          });
        });
        return graph;
      }
    }
  };
}]);

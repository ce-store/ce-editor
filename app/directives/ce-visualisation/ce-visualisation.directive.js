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
    link: function (scope, element, attrs) {

      /* TEST DATA */
      /*
conceptualise a ~ planet ~ P that has the value M as ~ mass ~.
conceptualise a ~ moon ~ M that ~ orbits ~ the planet P.
there is a planet named 'Earth' that has the value 1234 as mass.
there is a moon named 'The Moon' that orbits the planet 'Earth'.
      */

      scope.type = "model"; // || "instances"
      scope.switchType = function (type) {
        scope.type = type;
        update();
        update(scope.ce);
      };

      var svg;
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
      }
      create();

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
            .then(function(force) {
              return updateVis(force);
            });
          /*ceService.validate(ce)
            .then(function (validation) {
              console.log(validation);
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
              updateVis(force);
            })
            .catch(function (err) {
              console.error(err);
              scope.status = {
                status: 'Error',
                message: err
              };
            });*/
        }
      }

      /* Update Chart */
      function updateVis(graph) {
        var node = svg.selectAll('.nodes')
          .selectAll("g.node")
          .data(graph.nodes);

        // Nodes
        var newNodes = node.enter()
          .append("g")
          .attr('class', 'node');

        newNodes
          .filter(function (d, i) {
            // create a circle for 'concepts', etc.
            return d.type !== 'property';
          })
          .append('circle')
          .attr("r", sizes.node);

        newNodes
          .filter(function (d, i) {
            // create a rect for 'properties'.
            return d.type === 'property';
          })
          .append('rect')
          .style('transform', 'translate(-' + sizes.node + 'px,-' + 0.5 * sizes.node + 'px)')
          .attr("height", sizes.node)
          .attr("width", 2 * sizes.node);

        newNodes.append('text')
          .style('transform', 'translate(0px,3px)');

        newNodes
          .style('opacity', 0)
          .transition().duration(300)
          .style('opacity', 1);

        node.exit()
          .style('opacity', 1)
          .transition().duration(300)
          .style('opacity', 0)
          .remove();

        svg.selectAll('.nodes')
          .selectAll('g.node')
          .selectAll('text')
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
        newLinks.append('text').text(function (d) {
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
        console.log('tick');
        simulation = d3.forceSimulation()
          .force('charge', d3.forceManyBody().strength(function (d) {
            return d.type === 'property' ? -30 : -30;
          }))
          .force("center", d3.forceCenter(sizes.width / 2, sizes.height / 2))
          .force('collide', d3.forceCollide().radius(40).strength(0.3))
          .nodes(graph.nodes)
          .force('link', d3.forceLink(graph.links)
            .distance(function (d) {
              return d.type === 'concept:property:value' ? 60 : 120;
            })
            .id(function (d) {
              return d.id;
            }))
          .on('tick', ticked);
      }

      function ticked() {
        svg.selectAll('.links')
          .selectAll('.link')
          .selectAll('line')
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

        svg.selectAll('.nodes')
          .selectAll('g.node')
          .attr("transform", function (d) {
            // var x = Math.max(sizes.node, Math.min(sizes.width - sizes.node, d.x));
            // var y = Math.max(sizes.node, Math.min(sizes.height - sizes.node, d.y));
            return 'translate(' + d.x + ',' + d.y + ')';
          });
      }

      /* Resize the chart based on screen/svg size*/
      function updateSize() {
        sizes.width = svg.node().clientWidth;
        sizes.height = svg.node().clientHeight;
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
        console.log(graph.nodes);
        // Instances - Links
        instances.forEach(function (i) {
          Object.keys(i).forEach(function (k) {
            if (k.indexOf('_') !== 0) {
              console.log(k, i[k]);
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

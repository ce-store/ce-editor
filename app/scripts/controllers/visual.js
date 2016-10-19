'use strict';

/**
 * @ngdoc function
 * @name ceEditorApp.controller:VisualCtrl
 * @description
 * # VisualCtrl
 * Controller of the ceEditorApp
 */
angular.module('ceEditorApp')
  .controller('VisualCtrl', ['$scope', '$window', '$timeout', 'ce', 'visuals', function ($scope, $window, $timeout, ce, visuals) {
    var graph = visuals.graph();
    var nodeRadius = 40;
    var distanceBetweenNodes = nodeRadius / 2;
    var nodeHeight = nodeRadius * 2;
    var nodeWidth = nodeRadius * 2;
    var link, node;

    var rect = angular.element(document.getElementById('visual'))[0].getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;

    var updateShapesMap = function() {
      graph = visuals.graph();
      update();
    };

    visuals.registerObserverCallback(updateShapesMap);

    var d3 = $window.d3;
    var svg = d3.select('#visual');

    var links = svg.append('g')
        .attr('class', 'links');
    var nodes = svg.append('g')
        .attr('class', 'nodes');

    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink()
        .id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force('collide', d3.forceCollide(nodeRadius + distanceBetweenNodes))
      .alphaDecay(0.005);

    function tick() {
      // console.log('tick');
      links.selectAll('line')
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

      nodes.selectAll('image')
        .attr('x', function(d) { return d.x - nodeRadius; })
        .attr('y', function(d) { return d.y - nodeRadius; });
    }

    function dragstarted() {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
    }

    function dragged(d) {
      d.x = d3.event.x;
      d.y = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
    }

    var update = function() {
      console.log(graph);
      link = links.selectAll('line')
        .data(graph.links); // UPDATE

      link.exit().remove(); // EXIT

      link.enter() // ENTER
        .append('line')
          .attr('stroke-width', 3)
        .merge(link);

      node = nodes.selectAll('image')
        .data(graph.nodes, function(d) { return d.id; }); // UPDATE

      node.exit().remove(); // EXIT

      var image = node.enter() // ENTER
        .append('image')
          .attr('width', nodeWidth)
          .attr('height', nodeHeight)
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      image
        .append('title')
          .text(function(d) { return d.id; });

      image
        .merge(node) // ENTER + UPDATE
          .attr('xlink:href', function(d) {
            if (d.shows.indexOf('famous tennis player') > -1) {
              return 'images/famous_tennis_player.png';
            } else if (d.shows.indexOf('tennis player') > -1) {
              return 'images/tennis_player.png';
            } else if (d.shows.indexOf('person') > -1) {
              return 'images/person.png';
            } else if (d.shows.indexOf('strawberry') > -1) {
              return 'images/strawberry.png';
            } else {
              return 'images/circle.png';
            }
          });

      simulation
          .nodes(graph.nodes)
          .on('tick', tick);

      simulation.force('link')
          .links(graph.links);

      simulation.restart();
      // console.log('restart simulation');
    };

    visuals.update();

    // $timeout(function() {
    //   graph.nodes.splice(1, 1); // remove
    //   update();

    //   $timeout(function() {
    //     graph.nodes.push({id: 'a', shows: ['person']});
    //     graph.nodes.push({id: 'b', shows: ['tennis player']});
    //     update();

    //     $timeout(function() {
    //       graph.links.push({source: 'b', target: 'a'});
    //       update();

    //       $timeout(function() {
    //         graph.links.push({source: 'b', target: 'Andy Murray'});
    //         update();
    //       }, 1000);
    //     }, 1000);
    //   }, 1000);
    //   update();
    // }, 1000);
  }]);

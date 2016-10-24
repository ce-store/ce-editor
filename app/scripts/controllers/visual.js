'use strict';

/**
 * @ngdoc function
 * @name ceEditorApp.controller:VisualCtrl
 * @description
 * # VisualCtrl
 * Controller of the ceEditorApp
 */
angular.module('ceEditorApp')
  .controller('VisualCtrl', ['$window', 'visuals', function ($window, visuals) {
    var graph = visuals.graph();
    var nodeRadius = 40;
    var distanceBetweenNodes = nodeRadius;
    var nodeHeight = nodeRadius * 2;
    var nodeWidth = nodeRadius * 2;
    var link, node;
    var rect = {
      height: 20,
      width: 100,
      fill: '#93c4c5',
      padding: 20
    };

    var boundingRect = angular.element(document.getElementById('visual'))[0].getBoundingClientRect();
    var width = boundingRect.width;
    var height = boundingRect.height;

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
      .force('charge', d3.forceManyBody(30))
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('collide', d3.forceCollide(nodeRadius + distanceBetweenNodes))
      .alphaDecay(0.005);

    function tick() {
      var linkSelection = links.selectAll('.link');

      linkSelection.selectAll('line')
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      var getTransform = function(d) {
        var dx, dy;

        if (d.target.x < d.source.x) {
          dx = d.target.x + (d.source.x - d.target.x) / 2;
        } else {
          dx = d.source.x + (d.target.x - d.source.x) / 2;
        }
        if (d.target.y < d.source.x) {
          dy = d.target.y + (d.source.y - d.target.y) / 2;
        } else {
          dy = d.source.y + (d.target.y - d.source.y) / 2;
        }

        return {x: dx, y: dy};
      };

      linkSelection.selectAll('text')
          .attr('transform', function(d) {
            var t = getTransform(d);
            return 'translate(' + t.x + ', ' + t.y + ')';
          });

      linkSelection.selectAll('rect')
          .attr('transform', function(d) {
            var t = getTransform(d);
            var text = d3.select(this.nextSibling);
            var width = text.node().getComputedTextLength() + rect.padding;
            return 'translate(' + (t.x - width / 2) + ', ' + (t.y - rect.height / 4 * 3) + ')';
          });

      var nodeSelection = nodes.selectAll('.node')
          .attr('transform', function(d) {
            var dx = d.x - nodeRadius;
            var dy = d.y - nodeRadius;
            return 'translate(' + dx + ', ' + dy + ')';
          });

      nodeSelection.selectAll('rect')
          .attr('transform', function() {
            var text = d3.select(this.nextSibling);
            var width = text.node().getComputedTextLength() + rect.padding;
            return 'translate(' + (nodeWidth - width) / 2 + ', ' + (nodeHeight + 5) + ')';
          });

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
      link = links.selectAll('.link')
        .data(graph.links); // UPDATE

      link.exit().remove(); // EXIT

      var linkEnter = link.enter() // ENTER
        .append('g')
          .attr('class', 'link');

      linkEnter.append('line')
          .attr('stroke-width', 3);

      linkEnter.append('rect')
          .style('fill', rect.fill)
          .style('stroke', 'white')
          .style('stroke-width', '1px')
          .attr('height', rect.height);

      linkEnter.append('text')
          .style('fill', 'white')
          .style('text-anchor', 'middle')
          .text(function(d) { return d.name; });

      linkEnter
        .merge(link) // ENTER + UPDATE
        .selectAll('rect')
          .attr('width', function() {
            var text = d3.select(this.nextSibling);
            return text.node().getComputedTextLength() + rect.padding;
          });

      node = nodes.selectAll('.node')
        .data(graph.nodes, function(d) { return d.id; }); // UPDATE

      node.exit().remove(); // EXIT

      var nodeEnter = node.enter() // ENTER
        .append('g')
          .attr('class', 'node')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      var image = nodeEnter.append('image')
          .attr('width', nodeWidth)
          .attr('height', nodeHeight);

      nodeEnter.append('rect')
          .style('fill', rect.fill)
          .style('stroke', 'white')
          .style('stroke-width', '1px')
          .attr('height', rect.height);

      nodeEnter.append('text')
          .style('fill', 'white')
          .style('text-anchor', 'middle')
          .attr('dx', nodeRadius)
          .attr('dy', nodeHeight + 20)
          .text(function(d) { return d.id; });

      image
        .append('title')
          .text(function(d) { return d.id; });

      var nodeMerge = nodeEnter
        .merge(node); // ENTER + UPDATE

      nodeMerge.selectAll('image')
          .attr('xlink:href', function(d) {
            var image = d.shows[0];
            if (!image) {
              image = 'circle.png';
            }
            return 'images/' + d.shows[0];
          });

      nodeMerge.selectAll('rect')
          .attr('width', function() {
            var text = d3.select(this.nextSibling);
            return text.node().getComputedTextLength() + rect.padding;
          });

      simulation
          .nodes(graph.nodes)
          .on('tick', tick);

      simulation.force('link')
          .links(graph.links);

      var alpha = simulation.alpha();
      if (alpha < 0.1) {
        simulation.alpha(alpha + 0.1);
      }
      simulation.restart();
    };

    visuals.update();
  }]);

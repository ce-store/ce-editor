'use strict';

/**
 * @ngdoc function
 * @name ceEditorApp.controller:VisualCtrl
 * @description
 * # VisualCtrl
 * Controller of the ceEditorApp
 */
angular.module('ceEditorApp')
  .controller('VisualCtrl', ['$scope', '$window', 'ce', 'visuals', function ($scope, $window, ce, visuals) {
    var shapesMap = visuals.shapesMap();

    var updateShapesMap = function() {
      shapesMap = visuals.shapesMap();
      update(shapesMap);
    };

    visuals.registerObserverCallback(updateShapesMap);

    var d3 = $window.d3;
    var svg = d3.select('#visual');

    function update(shapesMap) {
      var circleGroups = svg.selectAll('g')
          .data(shapesMap.circle);

      var circleGroup = circleGroups
          .enter()
          .append('g');

      circleGroup.append('image')
          .attr('x', function(d, i) { console.log(d); return i * 100; })
          .attr('y', 0)
          .attr('width', 80)
          .attr('height', 80)
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

      circleGroups.select("image")
          .attr('xlink:href', function(d) {
            console.log(d);
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

      circleGroups.exit().remove();
    }

    visuals.update();
  }]);

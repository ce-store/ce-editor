'use strict';

/**
 * @ngdoc service
 * @name ceEditorApp.visuals
 * @description
 * # visuals
 * Service in the ceEditorApp.
 */
angular.module('ceEditorApp')
  .service('visuals', ['ce', function (ce) {
    var visualThings, shapes;
    var shapesMap = {
      circle: [],
      square: []
    };

    var getShapesMap = function() {
      return shapesMap;
    };

    var update = function() {
      shapesMap = {
        circle: [],
        square: []
      };

      ce.getVisualThings().then(function(response) {
        visualThings = response.data;

        ce.getShapes().then(function(response) {
          shapes = response.data;

          for (var i = 0; i < visualThings.length; ++i) {
            var thing = visualThings[i];
            var renderedBy = thing.property_values['is rendered by'];
            var shows = thing.property_values.shows;

            if (renderedBy) {
              if (renderedBy.indexOf('Square') > -1) {
                shapesMap.square.push(thing._id);
              } else if (renderedBy.indexOf('Circle') > -1) {
                var circleThing = {
                  id: thing._id,
                  shows: []
                };

                if (shows) {
                  for (var j = 0; j < shows.length; ++j) {
                    var show = shows[j].toLowerCase();
                    circleThing.shows.push(show);
                  }
                }

                shapesMap.circle.push(circleThing);
              }
            }
          }

          notifyObservers();
        });
      });
    };

    var observerCallbacks = [];

    var registerObserverCallback = function(callback) {
      observerCallbacks.push(callback);
    };

    var notifyObservers = function() {
      angular.forEach(observerCallbacks, function(callback) {
        callback();
      });
    };

    return {
      shapesMap: getShapesMap,
      update: update,
      registerObserverCallback: registerObserverCallback
    };
  }]);

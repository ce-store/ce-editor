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
    var map = {};
    var graph = {
      nodes: [],
      links: []
    };

    var getGraph = function() {
      // console.log(graph);
      return graph;
    };

    var update = function() {
      // graph = {
      //   nodes: [],
      //   links: []
      // };

      ce.getVisualThings().then(function(response) {
        visualThings = response.data;

        ce.getShapes().then(function(response) {
          shapes = response.data;
          console.log(visualThings);

          var addLink = function(like) {
            graph.links.push({source: thing._id, target: like});
          };

          for (var i = 0; i < visualThings.length; ++i) {
            var thing = visualThings[i];
            var renderedBy = thing.property_values['is rendered by'];
            var shows = thing.property_values.shows;

            if (renderedBy) {
              if (renderedBy.indexOf('Square') > -1) {
                // do something
              } else if (renderedBy.indexOf('Circle') > -1) {
                // var circleThing = {
                //   id: thing._id,
                //   shows: []
                // };

                var showsList = [];
                if (shows) {
                  for (var j = 0; j < shows.length; ++j) {
                    var show = shows[j].toLowerCase();
                    showsList.push(show);
                  }
                  // circleThing.shows = showsList;
                }

                var index = map[thing._id];
                if (typeof index === 'undefined' || index === null) {
                  graph.nodes.push({id: thing._id, shows: showsList});
                  map[thing._id] = graph.nodes.length - 1;
                } else {
                  graph.nodes[index].shows = showsList;
                }

                var likes = thing.property_values.likes;
                if (likes) {
                  likes.forEach(addLink);
                }
              }
            }
          }
          console.log(map);

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
      graph: getGraph,
      update: update,
      registerObserverCallback: registerObserverCallback
    };
  }]);

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
    var graph = {
      nodes: [],
      links: []
    };
    var currentThings = {};

    var getGraph = function() {
      for (var i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i];
        currentThings[node.id] = node.likes;
      }

      return graph;
    };

    var update = function() {
      ce.getVisualThings().then(function(response) {
        visualThings = response.data;

        ce.getShapes().then(function(response) {
          shapes = response.data;
          var newThings = {};

          var addLike = function(like) {
            console.log('add link ' + thing._id + '-' + like);
            graph.links.push({source: thing._id, target: like});
          };

          var removeLike = function(like) {
            var l = graph.links.length;
            while (l--) {
              var link = graph.links[l];

              if (link.source.id === like || link.target.id === like) {
                console.log('remove link ' + link.source.id + '-' + link.target.id);
                graph.links.splice(l, 1);
              }
            }
          };

          for (var i = 0; i < visualThings.length; ++i) {
            var thing = visualThings[i];
            var renderedBy = thing.property_values['is rendered by'];
            var shows = thing.property_values.shows;

            if (renderedBy) {
              if (renderedBy.indexOf('Square') > -1) {
                // do something
              } else if (renderedBy.indexOf('Circle') > -1) {
                var showsList = [];
                var likes = thing.property_values.likes;
                likes = likes ? likes : [];

                if (shows) {
                  for (var j = 0; j < shows.length; ++j) {
                    var show = shows[j].toLowerCase();
                    showsList.push(show);
                  }
                }

                if (!currentThings[thing._id]) {
                  console.log('add node ' + thing._id);
                  graph.nodes.push({
                    id: thing._id,
                    shows: showsList,
                    likes: likes
                  });

                  currentThings[thing._id] = likes;
                  if (likes) {
                    likes.forEach(addLike);
                  }
                } else {
                  var newLikes = likes;
                  var oldLikes = currentThings[thing._id];

                  oldLikes.forEach(removeLike);
                  newLikes.forEach(addLike);
                }

                newThings[thing._id] = showsList;
              }
            }
          }

          var n = graph.nodes.length;
          while (n--) {
            var node = graph.nodes[n];

            if (newThings[node.id]) {
              node.shows = newThings[node.id];
            } else {
              console.log('remove node ' + node.id);
              graph.nodes.splice(n, 1);
              delete currentThings[node.id];

              var l = graph.links.length;
              while (l--) {
                var link = graph.links[l];

                if (link.source.id === node.id || link.target.id === node.id) {
                  console.log('remove link ' + link.source.id + '-' + link.target.id);
                  graph.links.splice(l, 1);
                }
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
      graph: getGraph,
      update: update,
      registerObserverCallback: registerObserverCallback
    };
  }]);

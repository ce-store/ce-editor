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
        currentThings[node.id] = {};

        for (var property in node) {
          if (property !== 'shows') {
            var values = node[property];
            if (Array.isArray(values)) {
              // console.log('getGraph: ' + property);
              currentThings[node.id][property] = values;
            }
          }
        }
      }

      return graph;
    };

    var update = function() {
      ce.getVisualThings().then(function(response) {
        visualThings = response.data;

        ce.getShapes().then(function(response) {
          shapes = response.data;
          var newThings = {};

          var addLink = function(link) {
            console.log('add link ' + thing._id + '-' + link);
            graph.links.push({source: thing._id, target: link});
          };

          var removeLink = function(obj) {
            var l = graph.links.length;
            while (l--) {
              var link = graph.links[l];

              if (link.source.id === obj || link.target.id === obj) {
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
                if (shows) {
                  for (var j = 0; j < shows.length; ++j) {
                    var show = shows[j].toLowerCase();
                    showsList.push(show);
                  }
                }

                newThings[thing._id] = showsList;

                if (!currentThings[thing._id]) {
                  console.log('add node ' + thing._id);
                  var node = {
                    id: thing._id,
                    shows: showsList
                  };

                  currentThings[thing._id] = {};

                  // add links
                  for (var property in thing.property_values) {
                    if (property !== 'is rendered by' && property !== 'shows') {
                      var values = thing.property_values[property];
                      node[property] = values;
                      values.forEach(addLink);
                      // console.log('No currentThing: ' + property);
                      currentThings[thing._id][property] = values;
                    }
                  }

                  graph.nodes.push(node);
                } else {
                  var propertiesChecked = ['is rendered by', 'shows'];
                  for (var property in thing.property_values) {
                    if (property !== 'is rendered by' && property !== 'shows') {
                      var values = thing.property_values[property];
                      values = values ? values : [];
                      // console.log('currentThing: ' + property);
                      propertiesChecked.push(property);
                      currentThings[thing._id][property] = values;

                      var oldLinks = values;
                      var newLinks = values;

                      oldLinks.forEach(removeLink);
                      newLinks.forEach(addLink);
                    }
                  }

                  // Check for removed links of non-existant properties
                  for (var property in currentThings[thing._id]) {
                    if (propertiesChecked.indexOf(property) < 0) {
                      var oldLinks = currentThings[thing._id][property];
                      // console.log('remove property: ' + property);
                      oldLinks.forEach(removeLink);
                      delete currentThings[thing._id][property];
                    }
                  }
                }
              }
            }
          }

          var n = graph.nodes.length;
          while (n--) {
            var node = graph.nodes[n];

            if (newThings[node.id]) {
              // update shows list
              node.shows = newThings[node.id];
            } else {
              // remove node
              console.log('remove node ' + node.id);
              graph.nodes.splice(n, 1);
              delete currentThings[node.id];

              // remove links mentioning node
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

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
    var graph = {
      nodes: [],
      links: []
    };
    var things;
    var currentThings = {};
    var renderingMap = {};

    var metaModel = false;

    var showMetaModel = function() {
      metaModel = true;
    };

    var hideMetaModel = function() {
      metaModel = false;
    };

    var getGraph = function() {
      graph.nodes.forEach(function(node) {
        currentThings[node.id] = {};

        for (var property in node) {
          var values = node[property];
          if (Array.isArray(values)) {
            currentThings[node.id][property] = values;
          }
        }
      });

      return graph;
    };

    var addLinks = function(newLinks, thing, property) {
      newLinks.forEach(function(link) {
        graph.links.push({source: thing._id, target: link, name: property});
      });
    };

    var removeLinks = function(oldLinks) {
      oldLinks.forEach(function(obj) {
        var l = graph.links.length;
        while (l--) {
          var link = graph.links[l];

          if (link.source.id === obj || link.target.id === obj) {
            graph.links.splice(l, 1);
          }
        }
      });
    };

    // Update visuals
    var update = function() {
      // Get all things from model
      ce.getThings().then(function(response) {
        var allThings = response.data;
        things = [];

        // if (metaModel) {
          allThings.forEach(function(thing) {
            if ((thing._concept.indexOf('concept') < 0) &&
                (thing._concept.indexOf('conceptual model') < 0)) {
              things.push(thing);
            }

            if (thing['is rendered by']) {
              renderingMap[thing._id] = thing['is rendered by'];
            }
          });
        // }

        // Get all concepts from model for calculating parents
        ce.getConcepts().then(function(response) {
          var conceptParentMap = {};

          response.data.forEach(function(concept) {
            conceptParentMap[concept._id] = concept.all_parent_names;
          });

          var newThings = {};

          // For each thing, find image and links
          things.forEach(function(thing) {
            var childConcepts = [];

            // Find deepest child to use as image
            if (thing._concept.length > 0) {
              thing._concept.forEach(function(concept) {
                if (childConcepts.length === 0) {
                  childConcepts.push(concept);
                } else {
                  var newChildConcepts = childConcepts.slice();
                  // TODO: If this child doesn't have an image, use parent
                  childConcepts.forEach(function(childConcept, i) {
                    if (conceptParentMap[concept] &&
                        conceptParentMap[concept].indexOf(childConcept) > -1) {
                      newChildConcepts.splice(i, 1, concept);
                    } else if (conceptParentMap[childConcept] &&
                        conceptParentMap[concept].indexOf(concept) < 0) {
                      newChildConcepts.push(concept);
                    }
                  });
                  childConcepts = newChildConcepts;
                }
              });
            } else {
              childConcepts.push('thing');
            }

            var images = [];

            // Get images for concepts
            childConcepts.forEach(function(concept) {
              var image = renderingMap[concept];
              if (!image) {
                image = renderingMap.thing;
              }
              images.push(image);
            });

            newThings[thing._id] = images;
            var property, values;

            // If this is a new node, add it
            if (!currentThings[thing._id]) {
              var node = {
                id: thing._id,
                shows: images
              };

              currentThings[thing._id] = {};

              // Add links
              for (property in thing) {
                if (property.charAt(0) !== '_') {
                  values = thing[property];
                  values = Array.isArray(values) ? values : [values];
                  node[property] = values;
                  addLinks(values, thing, property);
                  currentThings[thing._id][property] = values;
                }
              }

              graph.nodes.push(node);
            // If this node already exists, update it
            } else {
              var propertiesChecked = [];
              for (property in thing) {
                if (property.charAt(0) !== '_') {
                  values = thing[property];
                  values = Array.isArray(values) ? values : [values];
                  propertiesChecked.push(property);
                  currentThings[thing._id][property] = values;

                  removeLinks(values);
                  addLinks(values, thing, property);
                }
              }

              // Check for removed links of non-existant properties
              for (property in currentThings[thing._id]) {
                if (propertiesChecked.indexOf(property) < 0) {
                  var redundantLinks = currentThings[thing._id][property];
                  removeLinks(redundantLinks);
                  delete currentThings[thing._id][property];
                }
              }
            }
          });

          var n = graph.nodes.length;
          while (n--) {
            var node = graph.nodes[n];

            if (newThings[node.id]) {
              // update shows list
              node.shows = newThings[node.id];
            } else {
              // remove node
              graph.nodes.splice(n, 1);
              delete currentThings[node.id];

              // remove links mentioning node
              var l = graph.links.length;
              while (l--) {
                var link = graph.links[l];

                if (link.source.id === node.id || link.target.id === node.id) {
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
      showMetaModel: showMetaModel,
      hideMetaModel: hideMetaModel,
      graph: getGraph,
      update: update,
      registerObserverCallback: registerObserverCallback
    };
  }]);

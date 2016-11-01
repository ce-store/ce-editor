angular.module('ceEditorApp')

.service('ce', ['$http', function ($http) {
  'use strict';

  var getThings = function() {
    return $http({
      method: 'GET',
      url: 'api/things'
    });
  };

  var getInstance = function(name) {
    return $http({
      method: 'GET',
      url: 'api/instance/' + name
    });
  };

  var getInstanceReferences = function(name) {
    return $http({
      method: 'GET',
      url: 'api/instance/' + name + '/references'
    });
  };

  var getConcepts = function() {
    return $http({
      method: 'GET',
      url: 'api/concepts'
    });
  };

  var getConcept = function(name) {
    return $http({
      method: 'GET',
      url: 'api/concept/' + name
    });
  };

  var getRules = function() {
    return $http({
      method: 'GET',
      url: 'api/rules'
    });
  };

  var getCe = function() {
    return $http({
      method: 'GET',
      url: 'api'
    });
  };

  var saveCe = function(ce, lessons) {
    return $http({
      method: 'POST',
      url: 'api',
      data: {
        ce: ce,
        lessons: lessons
      }
    });
  };

  var validateCe = function(ce) {
    return $http({
      method: 'POST',
      url: 'api/validate',
      data: {ce: ce}
    });
  };

  return {
    getThings: getThings,
    getInstance: getInstance,
    getInstanceReferences: getInstanceReferences,
    getConcepts: getConcepts,
    getConcept: getConcept,
    getRules: getRules,
    get: getCe,
    save: saveCe,
    validate: validateCe
  };
}]);

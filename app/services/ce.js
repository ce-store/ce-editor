angular.module('ceEditorApp')

.service('ce', ['$http', function ($http) {
  'use strict';

  var isBaseConcept = function (concept) {
    var baseConcepts = ['attribute concept', 'concept', 'conceptual model', 'datatype property', 'entity concept', 'meaning', 'object property', 'property concept', 'relation concept', 'sequence', 'statement', 'symbol', 'thing'];
    return baseConcepts.indexOf(concept) > -1;
  };

  var isBaseInstance = function (instance) {
    var baseThings = ['Meta model', 'attribute concept', 'concept', 'concept:annotation:value', 'conceptual model', 'conceptual model:defines:concept', 'datatype property', 'entity concept', 'entity concept:sub-concept:entity concept', 'meaning', 'meaning:conceptualises:thing', 'meaning:means the same as:meaning', 'object property', 'property concept', 'property concept:domain:entity concept', 'property concept:property name:value', 'property concept:range:entity concept', 'relation concept', 'sequence', 'statement', 'symbol', 'symbol:expresses:meaning', 'symbol:stands for:thing', 'thing', 'thing:description:value','thing:is related to:thing', 'thing:is the same as:thing'];
    return baseThings.indexOf(instance) > -1;
  };

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
    validate: validateCe,
    isBaseConcept: isBaseConcept,
    isBaseInstance: isBaseInstance
  };
}]);

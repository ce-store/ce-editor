'use strict';

/**
 * @ngdoc service
 * @name ceEditorApp.ce
 * @description
 * # ce
 * Service in the ceEditorApp.
 */
angular.module('ceEditorApp')
  .service('ce', ['$http', function ($http) {
    var getThings = function() {
      return $http({
        method: 'GET',
        url: 'api/things'
      });
    };

    var getConcepts = function() {
      return $http({
        method: 'GET',
        url: 'api/concepts'
      });
    };

    var getCe = function() {
      return $http({
        method: 'GET',
        url: 'api'
      });
    };

    var saveCe = function(ce) {
      return $http({
        method: 'POST',
        url: 'api',
        data: {ce: ce}
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
      getConcepts: getConcepts,
      get: getCe,
      save: saveCe,
      validate: validateCe
    };
  }]);

'use strict';

angular.module('ceEditorApp')
  .service('config', function($http) {
    var getConfig = function() {
      return $http({
        method: 'GET',
        url: 'config'
      });
    };

    return {
      get: getConfig
    };
  });

angular.module('ceEditorApp')

.service('config', function($http) {
  'use strict';
  var getConfig = function() {
    return $http({
      method: 'GET',
      url: 'config'
    });
  };

  var getBase = function() {
    return $http({
      method: 'GET',
      url: 'config/base'
    });
  };

  var getTutorial = function() {
    return $http({
      method: 'GET',
      url: 'config/tutorial'
    });
  };

  return {
    getConfig: getConfig,
    getBase: getBase,
    getTutorial: getTutorial
  };
});

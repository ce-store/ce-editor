'use strict';

/**
 * @ngdoc overview
 * @name ceEditorApp
 * @description
 * # ceEditorApp
 *
 * Main module of the application.
 */
angular.module('ceEditorApp', [
  'ui.router',
  'textAngular'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('');

  $stateProvider
    .state('index', {
      url: '',
      views: {
        'editor': {
          templateUrl: 'views/editor.html',
          controller: 'EditorCtrl'
        },
        'visual': {
          templateUrl: 'views/visual.html',
          controller: 'VisualCtrl'
        }
      }
    });
});

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
  'ui.bootstrap',
  'textAngular'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('');

  $stateProvider
    .state('index', {
      url: '',
      views: {
        'editor': {
          templateUrl: 'routes/editor/editor.html',
          controller: 'EditorCtrl'
        },
        'visual': {
          templateUrl: 'routes/visual/visual.html',
          controller: 'VisualCtrl'
        }
      }
    });
});

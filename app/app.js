angular.module('ceEditorApp', [
  'ui.router',
  'ui.bootstrap',
  'textAngular'
])

.config(function($stateProvider, $urlRouterProvider) {
  'use strict';

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

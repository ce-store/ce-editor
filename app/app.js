angular.module('ceEditorApp', [
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'textAngular'
])

.config(function($stateProvider, $urlRouterProvider) {
  'use strict';

  $urlRouterProvider.otherwise('');

  $stateProvider
    .state('welcome', {
      url: '',
      templateUrl: 'routes/welcome/welcome.html',
      controller: 'WelcomeCtrl'
    })
    .state('playground', {
      url: '/playground',
      templateUrl: 'routes/playground/playground.html',
      controller: 'PlaygroundCtrl'
    })
    .state('tutorial', {
      url: '/tutorial',
      templateUrl: 'routes/tutorial/tutorial.html',
      abstract: true
    })
    .state('tutorial.editor', {
      url: '/editor',
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

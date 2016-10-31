angular.module('ceEditorApp')

.controller('EditorCtrl', function ($scope, $http, $timeout, $interval, $q, $uibModal, ce, visuals, config, tutorial) {
  'use strict';

  $scope.showTutorial = true;

  config.getConfig().then(function(cfg) {
    $scope.ceStore = cfg.data.store;
  });
  $scope.lessons = tutorial.lessons;
  $scope.currentLesson = tutorial.getCurrentLesson();

  tutorial.registerCallback(function() {
    $scope.currentLesson = tutorial.getCurrentLesson();
  });

  $scope.lessons[1].complete();

  $scope.resetTutorial = function() {
    var modalInstance = $uibModal.open({
      templateUrl: '/routes/confirm/confirm.html',
      controller: 'ConfirmCtrl',
      size: 'sm',
      resolve: {
        confirm: function() {
          return 'Reset Tutorial';
        },
        exportFunc: function() {
          return $scope.export;
        }
      }
    });

    modalInstance.result.then(function () {
      tutorial.resetLessons();
      $scope.currentLesson = tutorial.getCurrentLesson();
      $scope.lessons = tutorial.lessons;
      $scope.lessons[1].complete();
    });
  };

  $scope.skipTutorial = function() {
    tutorial.skip();
    var playground = $scope.lessons[$scope.lessons.length - 1];
    $scope.lessons = [$scope.lessons[0], playground];
    playground.complete();
    $scope.showTutorial = false;
  };

  $scope.clear = function() {
    var modalInstance = $uibModal.open({
      templateUrl: '/routes/confirm/confirm.html',
      controller: 'ConfirmCtrl',
      size: 'sm',
      resolve: {
        confirm: function() {
          return 'Clear CE';
        },
        exportFunc: function() {
          return $scope.export;
        }
      }
    });

    modalInstance.result.then(function () {
      $scope.lessons[1].ce = '';
      $scope.lessons[1].complete();
    });
  };

  $scope.export = function() {
    var link = document.createElement('a');
    link.setAttribute('download', 'editor.ce');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($scope.lessons[0].ce + '\n\n' + $scope.lessons[1].ce));
    link.click();
  };

  $scope.openSettings = function() {
    $uibModal.open({
      templateUrl: '/routes/settings/settings.html',
      controller: 'SettingsCtrl'
    });
  };
});

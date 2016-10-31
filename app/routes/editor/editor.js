angular.module('ceEditorApp')

.controller('EditorCtrl', function ($scope, $http, $timeout, $interval, $q, $uibModal, ce, visuals, config, tutorial) {
  'use strict';

  // var intervals = [];
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
    tutorial.resetLessons();
    $scope.currentLesson = tutorial.getCurrentLesson();
    $scope.lessons = tutorial.lessons;
    $scope.lessons[1].complete();
  };

  $scope.skipTutorial = function() {
    tutorial.skip();
    var playground = $scope.lessons[$scope.lessons.length - 1];
    $scope.lessons = [$scope.lessons[0], playground];
    playground.complete();
  };

  $scope.openSettings = function() {
    $uibModal.open({
      templateUrl: '/routes/settings/settings.html',
      controller: 'SettingsCtrl',
    });
  };

  // var getLatestCe = function() {
  //   var ce = '';
  //   $scope.lessons.forEach(function(lesson) {
  //     if (lesson.passed) {
  //       ce += lesson.ce;
  //     }
  //   });
  //   return ce;
  // };

  // var writeSentence = function(text) {
  //   var deferred = $q.defer();
  //   var letter = 0;

  //   if ($scope.writing) {
  //     intervals.push($interval(function() {
  //       $scope.ce += text.slice(letter++, letter);

  //       var editor = document.getElementById('editor');
  //       editor.scrollTop = editor.scrollHeight;

  //       if (letter === text.length) {
  //         $scope.ce += '\n\n';
  //         $scope.validate();
  //         $scope.update();

  //         $timeout(function() {
  //           deferred.resolve();
  //         }, 1000);
  //       }
  //     }, 20, text.length));
  //   } else {
  //     deferred.reject();
  //   }

  //   return deferred.promise;
  // };

  // var doAsyncSeries = function(arr) {
  //   return arr.reduce(function (promise, text) {
  //     return promise.then(function() {
  //       return writeSentence(text);
  //     });
  //   }, $q.when());
  // };

  // Button Functions

  // $scope.update = function() {
  //   var deferred = $q.defer();
  //   var allCe = getLatestCe();
  //   // console.log(allCe);
  //   ce.save(allCe).then(function() {
  //     visuals.update();
  //     deferred.resolve();
  //   });
  //   return deferred.promise;
  // };

  // $scope.clear = function() {
  //   $scope.writing = false;
  //   $scope.ce = '';
  //   intervals.forEach(function(interval) {
  //     $interval.cancel(interval);
  //   });
  //   $scope.update();
  // };

  // $scope.skip = function() {
  //   $scope.writing = false;
  //   $scope.ce = tutorialText.join('\n\n');
  //   intervals.forEach(function(interval) {
  //     $interval.cancel(interval);
  //   });
  //   $scope.validate();
  //   $scope.update();
  // };

  // $scope.restart = function() {
  //   $scope.writing = true;
  //   $scope.ce = '';
  //   intervals.forEach(function(interval) {
  //     $interval.cancel(interval);
  //   });
  //   intervals = [];
  //   doAsyncSeries(tutorialText).then(function() {
  //     $scope.writing = false;
  //   });
  // };
});

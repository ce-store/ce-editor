'use strict';

/**
 * @ngdoc function
 * @name ceEditorApp.controller:EditorCtrl
 * @description
 * # EditorCtrl
 * Controller of the ceEditorApp
 */
angular.module('ceEditorApp')
  .controller('EditorCtrl', ['$scope', '$http', '$timeout', '$interval', '$q', 'ceStore', 'ce', 'visuals', function ($scope, $http, $timeout, $interval, $q, ceStore, ce, visuals) {
    var validText = 'Valid CE';
    var invalidText = 'Invalid CE';
    var validationFailed = 'Validation failed';
    var delay = 1000;
    var intervals = [];

    // $scope.html = '';
    $scope.ce = '';

    var tutorialText = [
      '-- Welcome to the Controlled English (CE) editor.',
      '-- Controlled English allows you to describe a model using English sentences. Any line beginning with a double dash is treated as a comment.',
      '-- Here is a CE sentence:',
      'there is a visual thing named \'Andy Murray\'.',
      ' ',
      '-- CE sentences are used for defining instances in the model.',
      '-- As you can see on the right, Andy Murray now exists in the model.  This tutorial will display any instance that is a visual thing.',
      '-- CE instances can be extended to other concepts:',
      'the visual thing \'Andy Murray\' is a person.',
      'the visual thing \'Andy Murray\' is a tennis player.',
      ' ',
      '-- Andy Murray is now a visual thing, a person and a tennis player.',
      '-- Lets add some more instances:',
      'there is a tennis player named \'Raphael Nadal\'.',
      'there is a food named \'Strawberries\'.',
      ' ',
      '-- Currently, the model doesn\'t know how to render the type food, but we can define it for this instance by adding a property:',
      'the food \'Strawberries\' shows the icon \'Strawberry\'.',
      ' ',
      '-- CE instances can relate to each other using their properties:',
      'the person \'Andy Murray\' likes the food \'Strawberries\'.',
      'the tennis player \'Andy Murray\' plays with the tennis player \'Raphael Nadal\'.',
      ' ',
      '-- You can find out more here: https://github.com/ce-store/ce-store/wiki/cheatsheet'
    ];

    $scope.validate = function() {
      var validateUrl = ceStore + '/sentences?action=validate';

      $http({
        method: 'POST',
        url: validateUrl,
        data: $scope.ce
      }).then(function successCallback(response) {
        if (response.data.alerts.errors.length > 0) {
          $scope.valid = false;
          $scope.validationText = invalidText;
        } else {
          $scope.valid = true;
          $scope.validationText = validText;
        }
      }, function errorCallback(response) {
        $scope.validationText = validationFailed;
        console.log(response);
      });
    };

    var writeSentence = function(text) {
      var deferred = $q.defer();
      var letter = 0;

      // $scope.html += '<p>';
      intervals.push($interval(function() {
        // $scope.html += text.slice(letter, letter + 1);
        $scope.ce += text.slice(letter++, letter);

        var editor = document.getElementById('editor');
        editor.scrollTop = editor.scrollHeight;

        if (letter === text.length) {
          // $scope.html += '</p>';
          $scope.ce += '\n\n';
          $scope.validate();
          $scope.update();

          $timeout(function() {
            deferred.resolve();
          }, 1000);
        }
      }, 20, text.length));

      return deferred.promise;
    };

    var doAsyncSeries = function(arr) {
      return arr.reduce(function (promise, text) {
        return promise.then(function() {
          return writeSentence(text);
        });
      }, $q.when());
    };

    // Button Functions

    $scope.update = function() {
      var loadCe = 'perform load sentences from url "/ce-store/ce/editor/cmd/load.cecmd".';
      ce.save(loadCe + ' ' + $scope.ce).then(function() {
        // console.info('loaded CE');
        visuals.update();
      });
    };

    $scope.skip = function() {
      $scope.ce = tutorialText.join('\n\n');
      intervals.forEach(function(interval) {
        $interval.cancel(interval);
      });
      $scope.validate();
      $scope.update();
    };

    $scope.restart = function() {
      $scope.ce = '';
      intervals.forEach(function(interval) {
        $interval.cancel(interval);
      });
      intervals = [];
      doAsyncSeries(tutorialText).then(function() {
        console.log('done');
      });
    };

    $scope.update();
    $timeout(function() {
      $scope.restart();
    }, delay);
  }]);

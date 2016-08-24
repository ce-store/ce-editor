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
      // '-- Welcome to the Controlled English (CE) editor.',
      // '-- Controlled English allows you to describe a model using English sentences.',
      // '-- Sentences beginning with a double dash are treated as comments.',
      // '-- Here is a CE sentence:',
      'there is a visual thing named \'Andy Murray\'.',
      'there is a person named \'Raphael Nadal\'.',
      // '-- CE sentences are used for defining instances in the model.',
      // '-- Andy Murray now exists in the model.',
      // '-- CE instances can be extended to other concepts:',
      'the visual thing \'Andy Murray\' is a person.',
      'the visual thing \'Andy Murray\' is a tennis player.',
      // '-- Andy Murray is now a visual thing, a person and a tennis player.',
      'there is a food named \'Strawberries\' that\n' +
      '  shows the icon \'Strawberry\'.',
      // '-- CE instances can be assigned properties:',
      'the person \'Andy Murray\' likes the food \'Strawberries\'.'
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

        if (letter === text.length) {
          // $scope.html += '</p>';
          $scope.ce += '\n\n';
          $scope.validate();
          $scope.update();
          deferred.resolve();
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

    $timeout(function() {
      // $scope.restart();
    }, delay);
  }]);

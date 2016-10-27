angular.module('ceEditorApp')

.service('tutorial', function($q, ce, visuals) {
  'use strict';

  var baseDesc = "<p>This is the base CE required for the tutorial and to visualise the model.</p>";

  var baseCe = "conceptualise an ~ entity concept ~ EC that\n" +
    "  ~ is rendered by ~ the value V.\n" +
    "\n" +
    "conceptualise a ~ person ~ P that\n" +
    "  ~ likes ~ the food F and\n" +
    "  ~ is in ~ the location L.\n" +
    "\n" +
    "conceptualise a ~ tennis player ~ TP that\n" +
    "  is a person and\n" +
    "  ~ plays with ~ the tennis player TP.\n" +
    "\n" +
    "conceptualise a ~ famous tennis player ~ FTP that\n" +
    "  is a tennis player.\n" +
    "\n" +
    "conceptualise a ~ food ~ F.\n" +
    "\n" +
    "conceptualise a ~ location ~ L.\n" +
    "\n" +
    "\n" +
    "the entity concept 'thing' is rendered by the value 'circle.png'.\n" +
    "\n" +
    "the entity concept 'location' is rendered by the value 'square.png'.\n" +
    "\n" +
    "the entity concept 'person' is rendered by the value 'person.png'.\n" +
    "\n" +
    "the entity concept 'tennis player' is rendered by the value 'tennis_player.png'.\n" +
    "\n" +
    "the entity concept 'famous tennis player' is rendered by the value 'famous_tennis_player.png'.\n";

  var lessonOneCe = "there is a thing named 'Andy Murray'.\n\n\n";

  var lessonOneDesc = "<p>Welcome to the Controlled English (CE) editor, a visualisation of CE models.</p>" +
    "<p>Controlled English allows you to describe a model using English sentences. Find out more about CE <a href='https://github.com/ce-store/ce-store'>here</a>.</p>" +
    "<p>CE sentences are used for defining instances in the model.</p>" +
    "<p>Here's an example:</p>" +
    "<code>there is a thing named 'Andy Murray'.</code>" +
    "<p>CE instances can be extended to other concepts:</p>" +
    "<code>the thing 'Andy Murray' is a person.</code>" +
    "<p><span class='glyphicon glyphicon-check'></span> <span class='lesson-task'>Task: Turn Andy into a tennis player</span></p>";

  var lessonOneComplete = function(updatedCe) {
    var deferred = $q.defer();
    if (!updatedCe) {
      updatedCe = lessonOneCe;
    }
    var allCe = baseCe + updatedCe;

    ce.save(allCe).then(function() {
      visuals.update();
    }).then(function() {
      ce.getInstance('Andy Murray').then(function(response) {
        if (response) {
          deferred.resolve(response.data);
        } else {
          deferred.reject();
        }
      });
    });
    return deferred.promise;
  };

  var lessonOneNext = function() {

  };

  var lessons = [{
    name: 'Base CE',
    desc: baseDesc,
    ce: baseCe,
    open: false
  }, {
    name: 'Lesson One',
    desc: lessonOneDesc,
    ce: lessonOneCe,
    open: true,
    complete: lessonOneComplete,
    next: lessonOneNext
  }];

  return {
    lessons: lessons
  };
});

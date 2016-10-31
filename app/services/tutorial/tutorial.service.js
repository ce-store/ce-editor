angular.module('ceEditorApp')

.service('tutorial', function($q, ce, visuals) {
  'use strict';

  // Base CE

  var baseDesc = "<p>This is the base CE required for the tutorial and to visualise the model.</p>";

  var baseCe = "conceptualise an ~ entity concept ~ EC that\n" +
    "  ~ is rendered by ~ the value V.\n" +
    "\n" +
    "conceptualise a ~ person ~ P that\n" +
    "  has the value HC as ~ hair colour ~ and \n" +
    "  has the value EC as ~ eye colour ~ and \n" +
    "  ~ owns ~ the value O and\n" +
    "  ~ prefers ~ the value O and\n" +
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

  // Lesson 1

  var lessonOneCe = "there is a thing named 'Andy Murray'.\n\n\n";
  var lessonOneUpdatedCe = lessonOneCe;

  var lessonOneDesc = "<p>Welcome to the Controlled English (CE) editor, a visualisation of CE models.</p>" +
    "<p>Controlled English allows you to describe a model using English sentences. Find out more about CE <a href='https://github.com/ce-store/ce-store'>here</a>.</p>" +
    "<p>CE sentences are used for defining instances in the model.</p>" +
    "<p>Here's an example:</p>" +
    "<code>there is a thing named 'Andy Murray'.</code>" +
    "<p>CE sentences always end in a full stop <code>.</code> and instance names need to be surrounded with single quotes <code>''</code> if they contain spaces.</p>" +
    "<p>Instances can be extended to other concepts:</p>" +
    "<code>the thing 'Andy Murray' is a person.</code>" +
    "<p><span class='glyphicon glyphicon-check'></span> <span class='lesson-task'>Task: Turn Andy into a tennis player</span></p>";

  var lessonOneComplete = function(updatedCe) {
    var deferred = $q.defer();
    if (!updatedCe) {
      updatedCe = lessonOneCe;
    }
    lessonOneUpdatedCe = updatedCe;
    var allCe = getCurrentCe();

    ce.save(allCe, lessons).then(function() {
      visuals.update();
    }).then(function() {
      ce.getInstance('Andy Murray').then(function(response) {
        if (response) {
          var instance = response.data;

          if (instance._concept && instance._concept.indexOf('tennis player') > -1) {
            deferred.resolve();
            return;
          }
        }

        deferred.reject();
      });
    });
    return deferred.promise;
  };

  var lessonOneNext = function() {
    lessons[1].passed = true;
    currentLesson++;
    lessons[1].open = false;
    lessons[2].open = true;
    notifyObservers();
  };

  // Lesson 2

  var lessonTwoDesc = "<p>Properties can be added to instances. There are two ways to assign a property, and which one you use depends on the model.</p>" +
    "<p>Look at these examples:</p>" +
    "<pre><code>the person 'Andy Murray'\n" +
    "  has 'brown' as hair colour.</code></pre>" +
    "<pre><code>the person 'Andy Murray'\n" +
    "  owns 'cats'.</code></pre>" +
    "<p>The first example puts the property value <code>brown</code> first, and the second puts the property value <code>cats</code> second.</p>" +
    "<p>We can find out which definition to use from the model:</p>" +
    "<pre><code>conceptualise a ~ person ~ P that\n" +
    "  has the value HC as ~ hair colour ~ and\n" +
    "  has the value EC as ~ eye colour ~ and\n" +
    "  ~ owns ~ the value O and\n" +
    "  ~ prefers ~ the value P.\n</code></pre>" +
    "<p>A later lesson will explain the different components in a conceptualise statement. The important parts here are the different property definitions and the word ordering.</p>" +
    "<p><span class='glyphicon glyphicon-check'></span> <span class='lesson-task'>Task: Set Andy's eye colour and prefers properties.</span></p>";

  var lessonTwoCe = "the person 'Andy Murray'\n" +
    "  has 'brown' as hair colour and\n" +
    "  owns 'cats'.\n\n\n\n";
  var lessonTwoUpdatedCe = lessonTwoCe;

  var lessonTwoComplete = function(updatedCe) {
    var deferred = $q.defer();
    if (!updatedCe) {
      updatedCe = lessonTwoCe;
    }
    lessonTwoUpdatedCe = updatedCe;
    var allCe = getCurrentCe();

    ce.save(allCe, lessons).then(function() {
      visuals.update();
    }).then(function() {
      ce.getInstance('Andy Murray').then(function(response) {
        if (response) {
          var instance = response.data;

          if (instance['eye colour'] && instance.prefers) {
            deferred.resolve();
            return;
          }
        }

        deferred.reject();
      });
    });
    return deferred.promise;
  };

  var lessonTwoNext = function() {
    lessons[2].passed = true;
    currentLesson++;
    lessons[2].open = false;
    lessons[3].open = true;
    notifyObservers();
  };

  var observerCallbacks = [];

  var registerCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  // Lesson 3

  var lessonThreeDesc = "<p>Similar to the last example, we can connect instances through their properties.</p>" +
    "<p>Look at the model for a tennis player:</p>" +
    "<pre><code>conceptualise a ~ tennis player ~ TP that\n" +
    "  is a person and\n" +
    "  ~ plays with ~ the tennis player TP.</code></pre>" +
    "<p>Here we can see a concept inheriting from another, <code>tennis player</code> becomes a child concept of <code>person</code> and inherits its properties.</p>" +
    "<p>It also gains a new property <code>plays with</code>, this property is a bit different as it accepts a <code>tennis player</code> instead of a regular string value. For example:</p>" +
    "<pre><code>the tennis player 'Andy Murray'\n" +
    "  plays with the tennis player 'Tim Henman'.</code></pre>" +
    "<p>Note the concept prefix <code>tennis player</code> is required when specifying an instance property.</p>" +
    "<p><span class='glyphicon glyphicon-check'></span> <span class='lesson-task'>Task: Create a new tennis player that plays with Andy.</span></p>";

  var lessonThreeCe = "there is a tennis player named 'Andy Murray'.\n\n\n\n\n";
  var lessonThreeUpdatedCe = lessonThreeCe;

  var lessonThreeComplete = function(updatedCe) {
    var deferred = $q.defer();
    if (!updatedCe) {
      updatedCe = lessonThreeCe;
    }
    lessonThreeUpdatedCe = updatedCe;
    var allCe = getCurrentCe();

    ce.save(allCe, lessons).then(function() {
      visuals.update();
    }).then(function() {
      ce.getInstance('Andy Murray').then(function(response) {
        if (response) {
          var instance = response.data;

          if (instance['plays with']) {
            deferred.resolve();
            return;
          }
        }

        deferred.reject();
      });
    });
    return deferred.promise;
  };

  var lessonThreeNext = function() {
    lessons[3].passed = true;
    currentLesson++;
    lessons[3].open = false;
    lessons[4].open = true;
    notifyObservers();
  };

  // Lesson 4

  var lessonFourDesc = "<p>In the previous examples we've used the base model to create instances. The base model can be viewed under the Base CE tab.</p>" +
    "<p>If we want to extend our model further, we need to create new concepts.</p>" +
    "<p>Defining concepts uses the keyword <code>conceptualise</code>, this tells the CE-Store we're creating a new concept. For example:</p>" +
    "<pre><code>conceptualise a ~ person ~ P.</code></pre>" +
    "<p>Tildes <code>~</code> surround any user defined names, such as the name of the concept.</p>" +
    "<p>After the concept name is the letter <code>P</code>, this symbolises where the instance name would go in the instance definition.</p>" +
    "<p>It is not necessary to add any properties to your concept, they can always be added later.</p>" +
    // "<p>The following lines define the properties. As these won't connect to other instances we use <code>the value</code> to describe the type (This can also be used in defining instances, but it's not necessary). Again, letters are used to define where the property name will appear, and we place the property name within the tildes.</p>"
    "<p><span class='glyphicon glyphicon-check'></span> <span class='lesson-task'>Task: Create a new concept named 'spectator' and add a new spectator instance.</span></p>";

  var lessonFourCe = "\n\n\n";
  var lessonFourUpdatedCe = lessonFourCe;

  var lessonFourComplete = function(updatedCe) {
    var deferred = $q.defer();
    if (!updatedCe) {
      updatedCe = lessonThreeCe;
    }
    lessonThreeUpdatedCe = updatedCe;
    var allCe = getCurrentCe();

    ce.save(allCe, lessons).then(function() {
      visuals.update();
    }).then(function() {
      ce.getConcept('spectator').then(function(response) {
        if (response) {
          var instances = response.data;

          if (instances.length > 0) {
            deferred.resolve();
            return;
          }
        }

        deferred.reject();
      });
    });
    return deferred.promise;
  };

  var lessonFourNext = function() {
    lessons[4].passed = true;
    currentLesson++;
    lessons[4].open = false;
    lessons[5].open = true;
    notifyObservers();
  };

  // Playground

  var playgroundDesc = "<p>Congratulations on completing the tutorial!</p>" +
    "Now you can build your own model from scratch.";

  var playgroundComplete = function(updatedCe) {
    var deferred = $q.defer();
    if (!updatedCe) {
      updatedCe = '';
    }
    var allCe = lessons[0].ce + updatedCe;

    ce.save(allCe, lessons).then(function() {
      visuals.update();
    }).then(function() {
      deferred.resolve();
    });
    return deferred.promise;
  };

  // General functions

  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback) {
      callback();
    });
  };

  var currentLesson = 1;

  var getCurrentLesson = function() {
    return currentLesson;
  };

  var getCurrentCe = function() {
    var allCe = '';
    var prevLesson;
    lessons.forEach(function(lesson) {
      if (lesson.passed || (prevLesson && prevLesson.passed)) {
        allCe += lesson.ce;
      }
      prevLesson = lesson;
    });
    return allCe;
  };

  var resetLessons = function() {
    lessonOneUpdatedCe = lessonOneCe;
    lessonTwoUpdatedCe = lessonTwoCe;
    lessonThreeUpdatedCe = lessonThreeCe;

    lessons.forEach(function(lesson) {
      lesson.open = false;
      lesson.passed = false;
    });
    lessons[0].passed = true;
    lessons[1].open = true;
    currentLesson = 1;

    lessons[1].ce = lessonOneUpdatedCe;
    lessons[2].ce = lessonTwoUpdatedCe;
    lessons[3].ce = lessonThreeUpdatedCe;
    lessons[4].ce = '';

    return lessons[1].complete();
  };

  var skip = function() {
    resetLessons();
    currentLesson = lessons.length - 1;
    lessons[1].open = false;
    lessons[currentLesson].open = true;
    lessons[currentLesson].passed = true;
  };

  var getLessons = function() {
    var deferred = $q.defer();

    ce.get().then(function(response) {
      if (response.data && response.data.lessons) {
        var sessionLessons = response.data.lessons;
        currentLesson = 1;
        sessionLessons.forEach(function(lesson, i) {
          lesson.complete = lessons[i].complete;
          lesson.next = lessons[i].next;
          if (i > 0 && lesson.passed) {
            currentLesson++;
          }
        });
        lessons = sessionLessons;

        if (lessons[lessons.length - 1].passed) {
          currentLesson = lessons.length - 1;
        }

        deferred.resolve(response.data.lessons);
      } else {
        deferred.resolve(lessons);
      }
    });

    return deferred.promise;
  };

  var lessons = [{
    name: 'Base CE',
    desc: baseDesc,
    ce: baseCe,
    open: false,
    passed: true
  }, {
    name: 'One: Extending an instance',
    desc: lessonOneDesc,
    ce: lessonOneUpdatedCe,
    open: true,
    complete: lessonOneComplete,
    next: lessonOneNext,
    passed: false
  }, {
    name: 'Two: Adding basic properties',
    desc: lessonTwoDesc,
    ce: lessonTwoUpdatedCe,
    open: false,
    complete: lessonTwoComplete,
    next: lessonTwoNext,
    passed: false
  }, {
    name: 'Three: Connecting instances',
    desc: lessonThreeDesc,
    ce: lessonThreeUpdatedCe,
    open: false,
    complete: lessonThreeComplete,
    next: lessonThreeNext,
    passed: false
  }, {
    name: 'Four: New concepts',
    desc: lessonFourDesc,
    ce: lessonFourUpdatedCe,
    open: false,
    complete: lessonFourComplete,
    next: lessonFourNext,
    passed: false
  }, {
    name: 'Playground',
    desc: playgroundDesc,
    ce: '',
    open: false,
    complete: playgroundComplete,
    passed: false
  }];

  return {
    getLessons: getLessons,
    getCurrentLesson: getCurrentLesson,
    registerCallback: registerCallback,
    resetLessons: resetLessons,
    skip: skip
  };
});

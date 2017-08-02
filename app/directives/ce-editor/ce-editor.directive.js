angular.module('ceEditorApp')

.directive('ceEditor', [function () {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      ce: '=',
      status: '='
    },
    templateUrl: 'directives/ce-editor/ce-editor.html',
    link: function (scope, element, attrs) {
      var lastKeyPressed;

      var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'ce',
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        theme: 'ambiance',
        extraKeys: {
          Tab: function (cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
          }
        },
        // gutters: ["CodeMirror-lint-markers"],
        // lint: true
      });

      editor.on('keyup', function (cm, event) {
        updateScopeCE();
        // event.keyCodes: 91 = cmd, 17 = ctrl
        if (lastKeyPressed &&
          lastKeyPressed !== 91 &&
          lastKeyPressed !== 17) {
          // cm.state.completionActive enables keyboard navigation in autocomplete list
          // show autocomplete for a-z, A-Z, 0-9, - and _
          var input = String.fromCharCode(event.keyCode);
          if (!cm.state.completionActive &&
            (/[a-zA-Z0-9-_]/.test(input))) {
            CodeMirror.commands.autocomplete(cm, null, {
              completeSingle: false
            });
          }
        }

        lastKeyPressed = event.keyCode;
      });

      function updateScopeCE() {
        scope.ce = editor.getValue('.').toString();
        scope.$apply();
      }
    }
  };
}]);

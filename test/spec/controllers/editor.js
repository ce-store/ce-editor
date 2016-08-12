'use strict';

describe('Controller: EditorCtrl', function () {

  // load the controller's module
  beforeEach(module('ceEditorApp'));

  var EditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorCtrl = $controller('EditorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditorCtrl.awesomeThings.length).toBe(3);
  });
});

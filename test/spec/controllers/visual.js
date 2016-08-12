'use strict';

describe('Controller: VisualCtrl', function () {

  // load the controller's module
  beforeEach(module('ceEditorApp'));

  var VisualCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VisualCtrl = $controller('VisualCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VisualCtrl.awesomeThings.length).toBe(3);
  });
});

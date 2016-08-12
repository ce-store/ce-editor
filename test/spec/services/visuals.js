'use strict';

describe('Service: visuals', function () {

  // load the service's module
  beforeEach(module('ceEditorApp'));

  // instantiate service
  var visuals;
  beforeEach(inject(function (_visuals_) {
    visuals = _visuals_;
  }));

  it('should do something', function () {
    expect(!!visuals).toBe(true);
  });

});

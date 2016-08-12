'use strict';

describe('Service: ce', function () {

  // load the service's module
  beforeEach(module('ceEditorApp'));

  // instantiate service
  var ce;
  beforeEach(inject(function (_ce_) {
    ce = _ce_;
  }));

  it('should do something', function () {
    expect(!!ce).toBe(true);
  });

});

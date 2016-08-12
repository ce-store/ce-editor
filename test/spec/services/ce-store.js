'use strict';

describe('Service: ceStore', function () {

  // load the service's module
  beforeEach(module('ceEditorApp'));

  // instantiate service
  var ceStore;
  beforeEach(inject(function (_ceStore_) {
    ceStore = _ceStore_;
  }));

  it('should do something', function () {
    expect(!!ceStore).toBe(true);
  });

});

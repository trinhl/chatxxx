'use strict';

describe('Component: ChatComponent', function () {

  // load the controller's module
  beforeEach(module('chatAppApp'));
  beforeEach(module('stateMock'));
  beforeEach(module('socketMock'));

  var ChatComponent
    , scope
    , state
    , $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(
    _$httpBackend_,
    $http,
    $componentController,
    $rootScope,
    $state,
    socket) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/message')
        .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      scope = $rootScope.$new();
      state = $state;
      ChatComponent = $componentController('chat', {
        $http: $http,
        $scope: scope,
        socket: socket
      });
  }));

  it('should attach a list of things to the controller', function() {
    ChatComponent.$onInit();
    $httpBackend.flush();
    expect(ChatComponent.receiveMess.length).toBe(4);
  });
});

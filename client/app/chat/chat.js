'use strict';

angular.module('chatAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        template: '<createroom></createroom>'
      })
      .state('on_chat', {
        url: '/chat/:room_name',
        template: '<chat></chat>'
      });
  });


angular.module('chatAppApp').filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);
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

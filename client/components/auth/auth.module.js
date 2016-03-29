'use strict';

angular.module('chatAppApp.auth', [
  'chatAppApp.constants',
  'chatAppApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });

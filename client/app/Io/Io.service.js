'use strict';

angular.module('chatAppApp')
  .factory('Io', function () {
      if (typeof io === 'undefined') {
        throw new Error('Socket.io required');
      }
      return io;
  });

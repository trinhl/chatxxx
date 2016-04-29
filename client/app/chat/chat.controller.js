'use strict';
(function(){

class ChatComponent {
  constructor($http, $scope, socket, Auth, $stateParams) {
    this.$http = $http;
    this.socket = socket;
    this.receiveMess = [];
    this.user = Auth.getCurrentUser();
    this.roomName = $stateParams.room_name;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('message');
    });
    this.startVideo();
  }

 $onInit() {
   this.$http.get('/api/message?room_name=' + this.roomName).then(response => {
     this.receiveMess = response.data;
     this.socket.syncUpdates('message', this.receiveMess);

     this.autoScrollBot();
   });
   $('[ui-view]').addClass('background-create-room')
 }

getnickName() {
  if(this.nickName){
    return this.nickName;
  }
}

addMessage() {
  if (this.newMessage) { 
		var data = { mess: this.newMessage, user_id: this.user._id, room_name: this.roomName, email: this.user.email, user_name: this.user.name };
		this.$http.post('/api/message', data);
		this.newMessage = '';

    this.autoScrollBot();
  }
}

createRoom() {
  if (this.room_name) {
		// $state.go("on_chat",{room_name: this.room_name})
		window.location = '/chat/' + this.room_name
  }

  return false;
}

startVideo() {
    // Put variables in global scope to make them available to the browser console.
  var video = document.querySelector('video');
  var constraints = window.constraints = {
    audio: false,
    video: true
  };
  var errorElement = document.querySelector('#errorMsg');

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    var videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using video device: ' + videoTracks[0].label);
    stream.onended = function() {
      console.log('Stream ended');
    };
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
  })
  .catch(function(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
          constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
      errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);
  });

  function errorMsg(msg, error) {
    errorElement.innerHTML += '<p>' + msg + '</p>';
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }
}

autoScrollBot() {
  setTimeout(function() {
    var elem = document.getElementById('message_list');
    elem.scrollTop = elem.scrollHeight + 200;
  }, 50);
}

  join() {
      if (this.nickname.length > 0){
        this.user.name = this.nickname;
      } else {
        alert('Please enter your nickname!')
      }
      return false;
    }

  }


angular.module('chatAppApp')
  .component('chat', {
    templateUrl: 'app/chat/chat.html',
    controller: ChatComponent
  }).component('createroom', {
    templateUrl: 'app/chat/create_room.html',
    controller: ChatComponent
  });

})();

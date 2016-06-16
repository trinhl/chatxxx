'use strict';

var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
                        window.webkitRTCPeerConnection;
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;

(function(){

class ChatComponent {
  constructor($http, $scope, socket, Auth, $stateParams, $sce, VideoStream, Room) {
    this.$http = $http;
    this.socket = socket;
    this.VideoStream = VideoStream;
    this.receiveMess = [];
    this.user = Auth.getCurrentUser();
    this.roomName = $stateParams.room_name;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('message');
    });
    // this.startVideo();
    document.title = 'Chat';


    var stream;
    VideoStream.get()
    .then(function(s) {
      stream = s;
      Room.init(stream);
      stream = URL.createObjectURL(stream);
      Room.joinRoom($stateParams.room_name);
    }, function () {
      $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
    });
    $scope.peers = [];
    Room.on('peer.stream', function (peer) {
      console.log('Client connected, adding new stream');
      $scope.peers.push({
        id: peer.id,
        stream: URL.createObjectURL(peer.stream)
      });
    });
    Room.on('peer.disconnected', function (peer) {
      console.log('Client disconnected, removing stream');
      $scope.peers = $scope.peers.filter(function (p) {
        return p.id !== peer.id;
      });
    });
    $scope.getLocalVideo = function () {
      return $sce.trustAsResourceUrl(stream);
    };
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

startCall() {
  // Create an RTCPeerConnection via the polyfill.
  var STUN = {
      urls: 'stun:stun.l.google.com:19302'
  };

  var TURN = {
      urls: 'turn:turn.bistri.com:80',
      credential: 'homeo',
      username: 'homeo'
  };

  var iceServers = {
     iceServers: [STUN, TURN]
  };
  window.pc1Local = new RTCPeerConnection(iceServers);
  window.pc1Remote = new RTCPeerConnection(iceServers);
  pc1Remote.onaddstream = this.gotRemoteStream1.bind(this);
  pc1Local.onicecandidate = this.iceCallback1Local.bind(this);
  pc1Remote.onicecandidate = this.iceCallback1Remote.bind(this);

  if (window.localStream) {
    console.log('-> window.localStream', window.localStream)
    pc1Local.addStream(window.localStream);
    pc1Local.createOffer(this.gotDescription1Local, this.onCreateSessionDescriptionError,
        this.offerOptions);
  }
}

gotRemoteStream1(e) {
  window.remoteVideo.srcObject = e.stream;
  console.log('pc1: received remote stream');
}

iceCallback1Local(event) {
  this.handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
}

iceCallback1Remote(event) {
  handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote');
}

gotDescription1Local(desc) {
  window.pc1Local.setLocalDescription(desc);
  console.log('Offer from pc1Local \n' + desc.sdp);
  window.pc1Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  window.pc1Remote.createAnswer(gotDescription1Remote,
      onCreateSessionDescriptionError);

  function gotDescription1Remote(desc) {
    window.pc1Remote.setLocalDescription(desc);
    trace('Answer from pc1Remote \n' + desc.sdp);
    window.pc1Local.setRemoteDescription(desc);
  }

  function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
  }
}

onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

gotDescription1Remote(desc) {
  window.pc1Remote.setLocalDescription(desc);
  trace('Answer from pc1Remote \n' + desc.sdp);
  window.pc1Local.setRemoteDescription(desc);
}

handleCandidate(candidate, dest, prefix, type) {
  if (candidate) {
    dest.addIceCandidate(new RTCIceCandidate(candidate),
        this.onAddIceCandidateSuccess, this.onAddIceCandidateError);
    console.log(prefix + 'New ' + type + ' ICE candidate: ' + candidate.candidate);
  }
}

onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

onAddIceCandidateError(error) {
  trace('Failed to add ICE candidate: ' + error.toString());
}

startVideo() {
  // Put variables in global scope to make them available to the browser console.
  var localVideo = window.localVideo = document.querySelector('video#local');
  var remoteVideo = window.remoteVideo = document.querySelector('video#remote');
  var constraints = window.constraints = {
    audio: true,
    video: true
  };
  var errorElement = document.querySelector('#errorMsg');

  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    var videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using video device: ' + videoTracks[0].label);
    stream.onended = function() {
      console.log('Stream ended');
    };
    window.stream = stream; // make variable available to browser console
    window.localStream = stream; // make variable available to browser console
    localVideo.srcObject = stream;

    this.startCall();
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
    var elem = document.getElementsByClassName('messages-content');
    elem.scrollTop = elem.scrollHeight + 200;
  }, 50);
  // $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
  //     scrollInertia: 10,
  //     timeout: 0
  //   });
}

  join() {
      if (this.nickname.length > 0){
        this.user.name = this.nickname;
        this.user.email = this.nickname;
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




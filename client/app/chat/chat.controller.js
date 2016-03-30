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
  }

 $onInit() {
   this.$http.get('/api/message?room_name=').then(response => {
     this.receiveMess = response.data;
     this.socket.syncUpdates('message', this.receiveMess);
   });
 }


addMessage() {
    if (this.newMessage) {
		var data = { name: this.newMessage, user_id: this.user._id };
		this.$http.post('/api/message', data);
		this.newMessage = '';
    }
  }

 createRoom() {
    if (this.room_name) {
		// $state.go("on_chat",{room_name: this.room_name})
		window.location = '/chat/' + this.room_name
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

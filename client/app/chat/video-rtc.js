// setTimeout(function() {
//   // Put variables in global scope to make them available to the browser console.
//   var videoLocal = document.querySelector('video#local');
//   var videoRemote = document.querySelector('video#remote');
//   var constraints = window.constraints = {
//     audio: true,
//     video: true
//   };
//   var errorElement = document.querySelector('#errorMsg');
//
//   var gotStream = function(stream) {
//     var videoTracks = stream.getVideoTracks();
//     console.log('Got stream with constraints:', constraints);
//     console.log('Using video device: ' + videoTracks[0].label);
//     stream.onended = function() {
//       console.log('Stream ended');
//     };
//     window.localstream = stream; // make variable available to browser console
//     videoLocal.srcObject = stream;
//   };
//
//   navigator.mediaDevices.getUserMedia(constraints)
//   .then(gotStream)
//   .catch(function(error) {
//     if (error.name === 'ConstraintNotSatisfiedError') {
//       errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
//           constraints.video.width.exact + ' px is not supported by your device.');
//     } else if (error.name === 'PermissionDeniedError') {
//       errorMsg('Permissions have not been granted to use your camera and ' +
//         'microphone, you need to allow the page access to your devices in ' +
//         'order for the demo to work.');
//     }
//     errorMsg('getUserMedia error: ' + error.name, error);
//   });
//
//   function errorMsg(msg, error) {
//     errorElement.innerHTML += '<p>' + msg + '</p>';
//     if (typeof error !== 'undefined') {
//       console.error(error);
//     }
//   }
//
//   function startVideoCall = function() {
//     console.log('Start call ...');
//
//     var audioTracks = window.localstream.getAudioTracks();
//     var videoTracks = window.localstream.getVideoTracks();
//
//     console.log('audioTracks', audioTracks);
//     console.log('videoTracks', videoTracks);
//
//
//   }
//
// }, 1000)

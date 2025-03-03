
// PeerJS implementation for WebRTC
import Peer from 'peerjs';

let localStream: MediaStream | null = null;

export const initPeer = (userId: string) => {
  console.log(`Initializing peer for user ${userId}`);
  
  // Initialize PeerJS with the user's ID
  const peer = new Peer(userId, {
    debug: 2,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:numb.viagenie.ca', username: 'webrtc@live.com', credential: 'muazkh' }
      ]
    }
  });

  peer.on('open', (id) => {
    console.log(`Connected to PeerJS server with ID: ${id}`);
  });

  peer.on('error', (err) => {
    console.error('PeerJS error:', err);
  });
  
  return {
    connect: (peerId: string) => {
      console.log(`Connecting to peer ${peerId}`);
      
      if (localStream) {
        const call = peer.call(peerId, localStream);
        
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream from call', remoteStream);
          return remoteStream;
        });
        
        return call;
      } else {
        console.error('No local stream available for call');
        return null;
      }
    },
    answerCall: (call: any, stream: MediaStream) => {
      call.answer(stream);
    },
    onIncomingCall: (callback: (call: any) => void) => {
      peer.on('call', (call) => {
        console.log('Incoming call from', call.peer);
        callback(call);
      });
    },
    disconnect: () => {
      console.log("Disconnecting from peer");
      peer.disconnect();
    },
    destroy: () => {
      console.log("Destroying peer connection");
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
      peer.destroy();
    },
  };
};

export const setupVideoCall = (
  localVideoRef: React.RefObject<HTMLVideoElement>,
  remoteVideoRef: React.RefObject<HTMLVideoElement>,
  audioOnly: boolean = false
) => {
  console.log("Setting up video/audio call");
  
  return new Promise<{ localStream: MediaStream }>((resolve, reject) => {
    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ 
        video: !audioOnly, 
        audio: true 
      })
      .then((stream) => {
        // Store locally for reuse
        localStream = stream;
        
        // Set local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true; // Avoid feedback loop
        }
        
        resolve({ localStream: stream });
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        reject(err);
      });
  });
};

export const handleRemoteStream = (
  remoteVideoRef: React.RefObject<HTMLVideoElement>,
  remoteStream: MediaStream
) => {
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = remoteStream;
  }
};

export const cleanupMedia = () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
};

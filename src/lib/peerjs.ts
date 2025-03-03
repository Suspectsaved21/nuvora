
// PeerJS implementation for WebRTC
import Peer from 'peerjs';

let localStream: MediaStream | null = null;
let peer: Peer | null = null;

export const getPeerInstance = () => peer;

export const initPeer = (userId: string) => {
  console.log(`Initializing peer for user ${userId}`);
  
  try {
    // Initialize PeerJS with the user's ID
    peer = new Peer(userId, {
      debug: 3, // Increase debug level for more verbose logs
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'turn:numb.viagenie.ca', username: 'webrtc@live.com', credential: 'muazkh' }
        ]
      }
    });

    // Add more event listeners for debugging
    peer.on('open', (id) => {
      console.log(`Connected to PeerJS server with ID: ${id}`);
    });

    peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });

    peer.on('disconnected', () => {
      console.log('Peer disconnected from server');
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
    });
    
    return {
      connect: (peerId: string) => {
        console.log(`Connecting to peer ${peerId}`);
        
        if (!peer) {
          console.error('Peer not initialized');
          return null;
        }
        
        if (localStream) {
          const call = peer.call(peerId, localStream);
          
          call.on('stream', (remoteStream) => {
            console.log('Received remote stream from call', remoteStream);
            return remoteStream;
          });

          call.on('error', (err) => {
            console.error('Call error:', err);
          });

          call.on('close', () => {
            console.log('Call closed');
          });
          
          return call;
        } else {
          console.error('No local stream available for call');
          return null;
        }
      },
      answerCall: (call: any, stream: MediaStream) => {
        console.log('Answering call with stream', stream.id);
        call.answer(stream);
      },
      onIncomingCall: (callback: (call: any) => void) => {
        if (!peer) {
          console.error('Peer not initialized');
          return;
        }
        
        peer.on('call', (call) => {
          console.log('Incoming call from', call.peer);
          callback(call);
        });
      },
      reconnect: () => {
        if (peer && peer.disconnected) {
          console.log('Attempting to reconnect to PeerJS server');
          peer.reconnect();
        }
      },
      disconnect: () => {
        console.log("Disconnecting from peer");
        peer?.disconnect();
      },
      destroy: () => {
        console.log("Destroying peer connection");
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
          localStream = null;
        }
        peer?.destroy();
        peer = null;
      },
    };
  } catch (error) {
    console.error('Error initializing peer:', error);
    return null;
  }
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
  console.log("Setting remote stream to video element", remoteStream.id);
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = remoteStream;
  } else {
    console.error("Remote video reference is null");
  }
};

export const cleanupMedia = () => {
  if (localStream) {
    console.log("Cleaning up media streams");
    localStream.getTracks().forEach(track => {
      console.log(`Stopping track: ${track.kind}`, track.id);
      track.stop();
    });
    localStream = null;
  }
};

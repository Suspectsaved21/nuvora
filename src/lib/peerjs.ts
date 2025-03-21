
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
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { 
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
            credential: 'w1WpauqUtbZQzYgaGEPY6R/Litg7XTJliJYWbDDMzHQ='
          }
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
      // Automatically try to reconnect after a short delay
      setTimeout(() => {
        if (peer && peer.disconnected) {
          peer.reconnect();
        }
      }, 3000);
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
          try {
            const call = peer.call(peerId, localStream);
            
            if (!call) {
              console.error('Failed to create call object');
              return null;
            }
            
            console.log('Call created successfully', call);
            
            return call;
          } catch (error) {
            console.error('Error creating call:', error);
            return null;
          }
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
    // Get local media stream with retry mechanism
    const getMediaWithRetry = (retries = 3) => {
      navigator.mediaDevices
        .getUserMedia({ 
          video: !audioOnly ? { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } : false, 
          audio: true 
        })
        .then((stream) => {
          // Store locally for reuse
          localStream = stream;
          
          // Set local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true; // Avoid feedback loop
            localVideoRef.current.play().catch(err => console.error("Error playing local video:", err));
          }
          
          resolve({ localStream: stream });
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err);
          if (retries > 0) {
            console.log(`Retrying getUserMedia (${retries} attempts left)...`);
            setTimeout(() => getMediaWithRetry(retries - 1), 1000);
          } else {
            reject(err);
          }
        });
    };
    
    getMediaWithRetry();
  });
};

export const handleRemoteStream = (
  remoteVideoRef: React.RefObject<HTMLVideoElement>,
  remoteStream: MediaStream
) => {
  console.log("Setting remote stream to video element", remoteStream.id);
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = remoteStream;
    remoteVideoRef.current.play().catch(err => console.error("Error playing remote video:", err));
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

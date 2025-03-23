
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

export const setupCallEventListeners = (
  call: any, 
  remoteVideoRef: React.RefObject<HTMLVideoElement>,
  onCallClosed: () => void
) => {
  // Handle remote stream
  call.on('stream', (remoteStream: MediaStream) => {
    console.log("Received remote stream from call");
    handleRemoteStream(remoteVideoRef, remoteStream);
  });
  
  // Handle call closing
  call.on('close', () => {
    console.log('Call closed by remote peer');
    onCallClosed();
  });
  
  // Handle errors in the call
  call.on('error', (err: any) => {
    console.error("Call error:", err);
  });
};

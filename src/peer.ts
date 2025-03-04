import Peer from "peerjs";

export const createPeerConnection = () => {
  const peer = new Peer();

  peer.on("open", (id) => {
    console.log("My peer ID is:", id);
  });

  return peer;
};

export const connectToPeer = (peer: Peer, peerId: string) => {
  const mediaConstraints = { video: true, audio: true };

  navigator.mediaDevices.getUserMedia(mediaConstraints)
    .then((stream) => {
      const call = peer.call(peerId, stream);

      call.on("stream", (remoteStream) => {
        const video = document.createElement("video");
        video.srcObject = remoteStream;
        video.play();
        document.body.appendChild(video);
      });
    })
    .catch((error) => {
      console.error("Error getting media:", error);
    });
};
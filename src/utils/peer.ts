
import Peer from "peerjs";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

export const createPeerConnection = () => {
  const peer = new Peer({
    debug: 3, // Log level set to maximum for debugging
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" }
      ]
    }
  });

  peer.on("open", (id) => {
    console.log("My peer ID is:", id);
  });

  peer.on("error", (err) => {
    console.error("PeerJS error:", err);
    toast.error(`Connection error: ${err.type}`);
  });

  return peer;
};

export const connectToPeer = async (peer: Peer, peerId: string) => {
  try {
    console.log("Connecting to peer:", peerId);
    const mediaConstraints = { video: true, audio: true };

    // Create local stream
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    
    // Setup local video
    const localVideo = document.createElement("video");
    localVideo.srcObject = stream;
    localVideo.muted = true; // Mute local video to prevent feedback
    localVideo.play();
    localVideo.className = "rounded-lg shadow-lg w-1/3 h-auto absolute bottom-20 right-4 z-10";
    document.body.appendChild(localVideo);
    
    // Call the peer
    const call = peer.call(peerId, stream);
    
    if (!call) {
      throw new Error("Failed to establish call");
    }

    // Handle the remote stream
    call.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      
      const remoteVideo = document.createElement("video");
      remoteVideo.srcObject = remoteStream;
      remoteVideo.className = "rounded-lg shadow-lg w-full h-auto";
      remoteVideo.autoplay = true;
      document.body.appendChild(remoteVideo);
      
      toast.success("Connected to video chat");
    });

    call.on("close", () => {
      console.log("Call closed");
      toast.info("Call has ended");
      
      // Remove videos when call ends
      localVideo.remove();
      document.querySelectorAll("video:not([muted])").forEach(v => v.remove());
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
      toast.error(`Call error: ${err}`);
    });

    // Return the call object for further handling
    return call;
  } catch (error) {
    console.error("Error connecting to peer:", error);
    toast.error(`Failed to connect: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

// Register a user as waiting for a match
export const registerAsWaiting = async (peerId: string) => {
  try {
    console.log("Registering as waiting with peer ID:", peerId);
    
    const { data, error } = await supabase
      .from("waiting_users")
      .insert([{ peer_id: peerId, is_available: true }]);
      
    if (error) throw error;
    
    console.log("Successfully registered as waiting");
    return true;
  } catch (error) {
    console.error("Error registering as waiting:", error);
    toast.error("Failed to join waiting list");
    return false;
  }
};

// Remove a user from the waiting list
export const removeFromWaitingList = async (peerId: string) => {
  try {
    console.log("Removing from waiting list, peer ID:", peerId);
    
    const { error } = await supabase
      .from("waiting_users")
      .delete()
      .eq("peer_id", peerId);
      
    if (error) throw error;
    
    console.log("Successfully removed from waiting list");
    return true;
  } catch (error) {
    console.error("Error removing from waiting list:", error);
    return false;
  }
};

// Find a match from the waiting list
export const findMatch = async (ownPeerId: string) => {
  try {
    console.log("Finding a match for peer ID:", ownPeerId);
    
    const { data, error } = await supabase
      .from("waiting_users")
      .select("peer_id")
      .neq("peer_id", ownPeerId)
      .eq("is_available", true)
      .limit(1);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log("Match found:", data[0].peer_id);
      return data[0].peer_id;
    }
    
    console.log("No match found");
    return null;
  } catch (error) {
    console.error("Error finding match:", error);
    toast.error("Failed to find a match");
    return null;
  }
};

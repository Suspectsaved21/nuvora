import Peer from 'peerjs';
import { supabase } from './supabaseClient'; // ✅ Make sure this path is correct!

class PeerService {
  peer: Peer | null = null;
  localStream: MediaStream | null = null;

  initializePeer(userId: string) {
    this.peer = new Peer(userId, {
      host: 'peerjs-server.herokuapp.com', // Public PeerJS server
      port: 443,
      secure: true,
    });

    this.peer.on('open', (id) => {
      console.log(`Peer connected with ID: ${id}`);
      this.updatePeerId(userId, id);
    });

    this.peer.on('error', (err) => {
      console.error('Peer error:', err);
    });
  }

  async updatePeerId(userId: string, peerId: string) {
    const { error } = await supabase
      .from('active_users')
      .update({ peer_id: peerId })
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to update Peer ID:', error);
    } else {
      console.log('Peer ID updated successfully');
    }
  }

  async getUserPeerId(userId: string) {
    const { data, error } = await supabase
      .from('active_users')
      .select('peer_id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch peer ID:', error);
      return null;
    }

    return data?.peer_id;
  }

  async callUser(remotePeerId: string, stream: MediaStream) {
    if (!this.peer) return;

    const call = this.peer.call(remotePeerId, stream);
    call?.on('stream', (remoteStream) => {
      console.log('Receiving remote stream');
    });

    call?.on('error', (err) => {
      console.error('Call error:', err);
    });
  }

  async getUserStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('Local stream obtained');
      return this.localStream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      return null;
    }
  }
}

export default new PeerService();

import { supabase } from "./client";
import { toast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/auth";

export async function registerPeer(peerId: string, user: UserProfile | null) {
  if (!user) return;

  try {
    // Try to update active_users record first
    const { error } = await supabase
      .from('waiting_users')
      .insert({
        user_id: user.id,
        peer_id: peerId,
        is_available: true
      });

    if (error) {
      console.error("Error registering peer:", error);
      toast({
        variant: "destructive",
        description: "Failed to register peer connection."
      });
    }
  } catch (error) {
    console.error("Error in registerPeer:", error);
  }
}

export async function unregisterPeer(user: UserProfile | null) {
  if (!user) return;

  try {
    const { error } = await supabase
      .from('waiting_users')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error("Error unregistering peer:", error);
    }
  } catch (error) {
    console.error("Error in unregisterPeer:", error);
  }
}

export async function updatePeerStatus(isAvailable: boolean, user: UserProfile | null) {
  if (!user) return;

  try {
    const { error } = await supabase
      .from('waiting_users')
      .update({ is_available: isAvailable })
      .eq('user_id', user.id);

    if (error) {
      console.error("Error updating peer status:", error);
    }
  } catch (error) {
    console.error("Error in updatePeerStatus:", error);
  }
}

export async function setUserOnline(user: UserProfile | null, isOnline: boolean = true) {
  if (!user) return;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        online_status: isOnline,
        last_seen_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error("Error updating online status:", error);
    }
  } catch (error) {
    console.error("Error in setUserOnline:", error);
  }
}

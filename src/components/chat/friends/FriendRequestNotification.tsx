
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";

interface FriendRequestNotificationProps {
  senderId: string;
  senderName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const FriendRequestNotification: React.FC<FriendRequestNotificationProps> = ({
  senderId,
  senderName,
  onAccept,
  onDecline
}) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-blue-500" />
        <div className="flex-1">
          <p className="font-medium">{senderName}</p>
          <p className="text-sm text-muted-foreground">
            Sent you a friend request
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <Button 
          size="sm" 
          onClick={onAccept}
          className="flex-1"
        >
          Accept
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onDecline}
          className="flex-1"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};

export default FriendRequestNotification;

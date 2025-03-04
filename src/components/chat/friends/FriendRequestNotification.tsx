
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

const FriendRequestNotification = ({
  senderId,
  senderName,
  onAccept,
  onDecline,
}: FriendRequestNotificationProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          <UserPlus size={16} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">
            {senderName} sent you a friend request
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          onClick={onDecline}
        >
          <X size={16} />
        </Button>
        <Button size="sm" className="h-8" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default FriendRequestNotification;

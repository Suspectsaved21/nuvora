
import { Button } from "@/components/ui/button";
import { UserPlus, Flag } from "lucide-react";

interface PartnerInfoProps {
  partner: { username?: string; country?: string; id: string } | null;
  handleAddFriend: () => void;
  reportPartner?: () => void;
}

const PartnerInfo = ({ partner, handleAddFriend, reportPartner }: PartnerInfoProps) => {
  if (!partner) return null;
  
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-40">
      <div className="glass-morphism px-4 py-2 rounded-full text-sm text-white flex items-center gap-2">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span className="truncate max-w-40 font-medium">
            {partner.username || 'Anonymous'} · {partner.country || 'Unknown'}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddFriend}
          className="bg-green-500/80 hover:bg-green-600 border-0 text-white rounded-full h-8 px-3 py-0"
        >
          <UserPlus size={14} className="mr-1" />
          <span>Add Friend</span>
        </Button>
        
        {reportPartner && (
          <Button
            variant="outline"
            size="sm"
            onClick={reportPartner}
            className="bg-red-500/80 hover:bg-red-600 border-0 text-white rounded-full h-8 px-3 py-0"
          >
            <Flag size={14} className="mr-1" />
            <span>Report</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PartnerInfo;


import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface PartnerInfoProps {
  partner: { username?: string; country?: string; id: string } | null;
  handleAddFriend: () => void;
}

const PartnerInfo = ({ partner, handleAddFriend }: PartnerInfoProps) => {
  if (!partner) return null;
  
  return (
    <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white z-40 flex items-center gap-2">
      <span className="truncate max-w-40">{partner.username || 'Anonymous'} · {partner.country || 'Unknown'}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddFriend}
        className="bg-green-500/70 hover:bg-green-600/90 border-0 text-white rounded-full h-6 px-2 py-0 text-xs"
      >
        <UserPlus size={12} className="mr-1" />
        <span>Add</span>
      </Button>
    </div>
  );
};

export default PartnerInfo;

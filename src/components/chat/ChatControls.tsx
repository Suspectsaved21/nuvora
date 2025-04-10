
import { useContext, useState } from "react";
import { SkipForward, Flag, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ChatContext from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";

const ChatControls = () => {
  const { findNewPartner, partner, reportPartner, addFriend, locationEnabled, isFindingPartner, cancelFindPartner, isConnected } = useContext(ChatContext);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  
  const handleReport = () => {
    reportPartner(reportReason);
    setReportDialogOpen(false);
  };
  
  const handleAddFriend = () => {
    if (partner) {
      addFriend(partner.id);
      toast({
        title: "Friend Added",
        description: `${partner.username} was added to your friends list.`,
      });
    }
  };
  
  // Single search trigger - no automatic continuation
  const handleFindPartner = () => {
    findNewPartner();
  };
  
  // Cancel search and return to video interface
  const handleCancelSearch = () => {
    cancelFindPartner();
  };
  
  return (
    <div className="glass-morphism rounded-lg p-4 flex flex-col gap-4">
      <h3 className="font-semibold text-center">Chat Controls</h3>
      
      <div className="flex flex-col gap-2">
        {/* Main partner search control - more prominent */}
        {isFindingPartner ? (
          <Button
            variant="destructive"
            className="w-full py-6 text-lg"
            onClick={handleCancelSearch}
          >
            <X size={20} className="mr-2" />
            Cancel Search
          </Button>
        ) : (
          <Button
            variant={isConnected ? "default" : "outline"}
            className={`w-full py-6 text-lg ${isConnected ? "bg-purple hover:bg-purple-dark" : "border-purple border-2 text-purple hover:bg-purple/10"}`}
            onClick={handleFindPartner}
          >
            <SkipForward size={20} className="mr-2" />
            {isConnected ? "Next Person" : "Start Random Chat"} {locationEnabled && "(Location Based)"}
          </Button>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddFriend}
            disabled={!partner}
          >
            <UserPlus size={16} className="mr-2" />
            Add Friend
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setReportDialogOpen(true)}
            disabled={!partner}
          >
            <Flag size={16} className="mr-2" />
            Report
          </Button>
        </div>
      </div>
      
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Please select a reason for reporting this user. This user will be immediately disconnected and your report will be reviewed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup defaultValue="inappropriate" onValueChange={setReportReason}>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="inappropriate" id="inappropriate" />
                <Label htmlFor="inappropriate">Inappropriate content</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="abusive" id="abusive" />
                <Label htmlFor="abusive">Abusive behavior</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam">Spam</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport} className="bg-destructive">
              Report & Skip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatControls;

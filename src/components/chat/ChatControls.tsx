
import { useContext, useState } from "react";
import { SkipForward, Flag, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChatContext } from "@/context/chat";
import { toast } from "@/components/ui/use-toast";

const ChatControls = () => {
  const { findNewPartner, partner, reportPartner, addFriend, locationEnabled } = useContext(ChatContext);
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
  
  return (
    <div className="glass-morphism rounded-lg p-4 flex flex-col gap-4">
      <h3 className="font-semibold text-center">Chat Controls</h3>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="default"
          className="flex-1 bg-purple hover:bg-purple-dark"
          onClick={findNewPartner}
        >
          <SkipForward size={16} className="mr-2" />
          Next Person {locationEnabled && "(Location Based)"}
        </Button>
        
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

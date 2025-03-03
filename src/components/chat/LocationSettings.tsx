
import { useContext } from "react";
import { MapPin, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ChatContext from "@/context/ChatContext";

const LocationSettings = () => {
  const { locationEnabled, toggleLocationTracking } = useContext(ChatContext);
  
  return (
    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border p-4">
      <h3 className="font-semibold flex items-center mb-4">
        <Globe size={18} className="mr-2" />
        Location Settings
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 mt-0.5 text-purple" />
            <div>
              <Label htmlFor="location-toggle" className="font-medium">
                Location Matching
              </Label>
              <p className="text-sm text-muted-foreground">
                Match with people in your geographical region
              </p>
            </div>
          </div>
          <Switch 
            id="location-toggle" 
            checked={locationEnabled} 
            onCheckedChange={toggleLocationTracking}
          />
        </div>
        
        {locationEnabled && (
          <div className="p-3 bg-secondary/80 rounded-md text-sm">
            <p className="mb-2">Your current location settings:</p>
            <div className="glass-morphism px-3 py-2 rounded flex items-center justify-center">
              <MapPin size={14} className="mr-2 text-purple" />
              <span>Location sharing is enabled</span>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>
            Your privacy is important to us. Location data is only used for matching 
            and is never shared with other users beyond country-level information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;

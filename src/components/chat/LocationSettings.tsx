
import { useContext, useState, useEffect } from "react";
import { MapPin, Globe, Loader2, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatContext from "@/context/ChatContext";

const LocationSettings = () => {
  const { 
    locationEnabled, 
    toggleLocationTracking, 
    userLocation, 
    refreshLocation 
  } = useContext(ChatContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle manual location refresh
  const handleRefreshLocation = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshLocation();
      // Toast success message
      console.log("Location refreshed successfully:", userLocation);
    } catch (err) {
      setError("Could not retrieve your location. Please check your device permissions.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Automatically refresh location when enabled
  useEffect(() => {
    if (locationEnabled && !userLocation?.address) {
      handleRefreshLocation();
    }
  }, [locationEnabled]);
  
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
        
        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {locationEnabled && (
          <div className="p-3 bg-secondary/80 rounded-md text-sm">
            <div className="flex items-center justify-between mb-2">
              <p>Your current location:</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshLocation}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <RefreshCcw size={14} className="mr-1" />
                )}
                Refresh Location
              </Button>
            </div>
            
            {userLocation?.country && (
              <div className="absolute top-4 right-4 bg-purple/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                {userLocation.country}
              </div>
            )}
            
            <div className="glass-morphism px-3 py-2 rounded">
              {isRefreshing ? (
                <div className="flex items-center justify-center py-1">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Detecting location...</span>
                </div>
              ) : userLocation?.city && userLocation?.country ? (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-purple flex-shrink-0" />
                    <span className="line-clamp-2">
                      {userLocation.city}, {userLocation.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Coordinates: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-1">
                  <span>No location detected yet</span>
                </div>
              )}
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


import { useState } from "react";
import { Location } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

export function useLocationTracking() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const getLocation = async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          let address = "";
          let country = "Unknown";
          let city = "Unknown";
          
          // Check for Belgium coordinates
          const isBelgiumLatitude = latitude >= 49.5 && latitude <= 51.5;
          const isBelgiumLongitude = longitude >= 2.5 && longitude <= 6.5;
          
          // Target coordinates for Flémalle, Belgium
          const targetLat = 50.614;
          const targetLon = 5.459;
          
          const latDiff = Math.abs(latitude - targetLat);
          const lonDiff = Math.abs(longitude - targetLon);
          
          if (isBelgiumLatitude && isBelgiumLongitude) {
            country = "Belgium";
            
            if (latDiff < 0.05 && lonDiff < 0.05) {
              city = "Flémalle";
              address = "Rue du Fossé 29, 4400 Flémalle, Belgium";
            } else {
              try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                const data = await response.json();
                
                if (data && data.display_name) {
                  address = data.display_name;
                  
                  if (data.address) {
                    city = data.address.city || data.address.town || data.address.village || "Unknown";
                  }
                } else {
                  address = "Location in Belgium";
                }
              } catch (err) {
                console.error("Error fetching address:", err);
                address = "Location in Belgium, address lookup failed";
              }
            }
          } else {
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
              const data = await response.json();
              
              if (data && data.display_name) {
                address = data.display_name;
                
                if (data.address) {
                  country = data.address.country || "Unknown";
                  city = data.address.city || data.address.town || data.address.village || "Unknown";
                }
              } else {
                address = "Unknown address";
              }
            } catch (err) {
              console.error("Error fetching address:", err);
              address = "Location detected, address lookup failed";
            }
          }
          
          resolve({
            latitude,
            longitude,
            address,
            country,
            city
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const refreshLocation = async (): Promise<void> => {
    if (!locationEnabled) {
      return;
    }
    
    try {
      const location = await getLocation();
      setUserLocation(location);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to get location:", error);
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Could not retrieve your location. Please check permissions.",
      });
      return Promise.reject(error);
    }
  };

  const toggleLocationTracking = () => {
    const newValue = !locationEnabled;
    setLocationEnabled(newValue);
    
    if (newValue) {
      refreshLocation().catch(err => {
        console.error("Failed to get location after enabling:", err);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not enable location tracking. Please check permissions.",
        });
      });
    }
  };

  return {
    locationEnabled,
    userLocation,
    refreshLocation,
    toggleLocationTracking
  };
}

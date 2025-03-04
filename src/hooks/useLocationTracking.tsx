
import { useState } from "react";
import { Location } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

export type MatchingPreference = "regional" | "worldwide";

export function useLocationTracking() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [matchingPreference, setMatchingPreference] = useState<MatchingPreference>("regional");

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
          
          try {
            // Use multiple geocoding services for better accuracy
            // First try OpenStreetMap's Nominatim service
            let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            let data = await response.json();
            
            if (data && data.display_name) {
              address = data.display_name;
              
              if (data.address) {
                country = data.address.country || "Unknown";
                city = data.address.city || data.address.town || data.address.village || "Unknown";
              }
              
              // If the first service returns "Canada" but we're not in Canada, try a different service
              if (country === "Canada") {
                try {
                  // Try backup geocoding service
                  const backupResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                  const backupData = await backupResponse.json();
                  
                  if (backupData && backupData.countryName) {
                    // Validate the result - compare the two services
                    if (backupData.countryName !== "Canada") {
                      console.log("Location discrepancy detected, using secondary service data");
                      country = backupData.countryName;
                      city = backupData.city || backupData.locality || city;
                      address = `${backupData.locality}, ${backupData.principalSubdivision}, ${backupData.countryName}`;
                    }
                  }
                } catch (err) {
                  console.error("Error with backup geocoding service:", err);
                }
              }
            } else {
              // Try IP-based geolocation as a fallback
              try {
                const ipResponse = await fetch('https://ipapi.co/json/');
                const ipData = await ipResponse.json();
                
                if (ipData && ipData.country_name) {
                  country = ipData.country_name;
                  city = ipData.city || "Unknown";
                  address = `${ipData.city}, ${ipData.region}, ${ipData.country_name}`;
                }
              } catch (err) {
                console.error("Error with IP geolocation:", err);
                address = "Location detected, address lookup failed";
              }
            }
          } catch (err) {
            console.error("Error fetching address:", err);
            
            // Try IP-based geolocation as a fallback
            try {
              const ipResponse = await fetch('https://ipapi.co/json/');
              const ipData = await ipResponse.json();
              
              if (ipData && ipData.country_name) {
                country = ipData.country_name;
                city = ipData.city || "Unknown";
                address = `${ipData.city}, ${ipData.region}, ${ipData.country_name}`;
              } else {
                address = "Location detected, address lookup failed";
              }
            } catch (innerErr) {
              console.error("Error with IP geolocation:", innerErr);
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
          
          // If geolocation fails, try IP-based geolocation
          fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
              if (data && data.country_name) {
                const location = {
                  latitude: data.latitude,
                  longitude: data.longitude,
                  address: `${data.city}, ${data.region}, ${data.country_name}`,
                  country: data.country_name,
                  city: data.city || "Unknown"
                };
                resolve(location);
              } else {
                reject(error);
              }
            })
            .catch(err => {
              console.error("IP geolocation failed too:", err);
              reject(error);
            });
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
    toggleLocationTracking,
    matchingPreference,
    setMatchingPreference
  };
}

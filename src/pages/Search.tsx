
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthContext from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserResult {
  id: string;
  username: string;
  country?: string;
}

const Search = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a username to search",
      });
      return;
    }

    setIsSearching(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, country')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;
      
      setSearchResults(data || []);
      
      if (data?.length === 0) {
        toast({
          description: "No users found matching your search",
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        variant: "destructive",
        description: "Failed to search users. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (userId: string, username: string) => {
    try {
      // Use the 'friends' table instead of 'friend_requests'
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: userId,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: "Friend Request Sent",
        description: `Friend request sent to ${username}.`,
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        variant: "destructive",
        description: "Failed to send friend request. Please try again.",
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Search Users</h1>
            <p className="text-muted-foreground mt-2">Find and connect with other users</p>
          </div>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                  onClick={clearSearch}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
              <SearchIcon size={16} className="ml-2" />
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <Card key={result.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {result.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{result.username}</div>
                          {result.country && (
                            <div className="text-sm text-muted-foreground">{result.country}</div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddFriend(result.id, result.username)}
                      >
                        <UserPlus size={16} className="mr-2" />
                        Add Friend
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;

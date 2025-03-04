
import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

interface FriendSearchProps {
  currentUserId?: string;
  onAddFriend: (userId: string, userData?: { username: string; country?: string }) => void;
  isAdding: boolean;
}

const FriendSearch = ({ currentUserId, onAddFriend, isAdding }: FriendSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !currentUserId) return;
    
    setIsSearching(true);
    try {
      // Search by username in the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, country')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', currentUserId) // Don't show current user
        .limit(5);
      
      if (error) throw error;
      
      setSearchResults(data || []);
      
      if (data && data.length === 0) {
        toast({
          description: "No users found with that username."
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        variant: "destructive",
        description: "Failed to search for users. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = (userId: string, username: string, country?: string) => {
    onAddFriend(userId, { username, country });
    // Clear search results after adding
    setSearchResults([]);
    setSearchQuery("");
    
    sonnerToast.success(`Friend request sent to ${username}`);
  };

  return (
    <div className="p-4 border-b border-border">
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for friends by username"
            className="pl-9"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
          Search
        </Button>
      </form>
      
      {searchResults.length > 0 && (
        <div className="mt-2 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Search Results</h4>
          <ul className="divide-y divide-border rounded-md border border-border overflow-hidden">
            {searchResults.map((user) => (
              <li key={user.id} className="flex items-center justify-between p-3 bg-secondary/30">
                <div>
                  <p className="font-medium">{user.username}</p>
                  {user.country && (
                    <p className="text-xs text-muted-foreground">{user.country}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddFriend(user.id, user.username, user.country)}
                  disabled={isAdding}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendSearch;

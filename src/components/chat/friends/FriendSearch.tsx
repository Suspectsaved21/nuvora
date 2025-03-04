
import { useState } from "react";
import { Search, UserPlus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FriendSearchProps {
  currentUserId?: string;
  onAddFriend: (userId: string, userData?: { username: string; country?: string }) => void;
  isAdding: boolean;
}

const FriendSearch = ({ currentUserId, onAddFriend, isAdding }: FriendSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTab, setSearchTab] = useState<'username' | 'location'>('username');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !currentUserId) return;
    
    setIsSearching(true);
    try {
      let query = supabase
        .from('profiles')
        .select('id, username, country, created_at')
        .neq('id', currentUserId); // Don't show current user
      
      if (searchTab === 'username') {
        query = query.ilike('username', `%${searchQuery}%`);
      } else if (searchTab === 'location' && searchQuery) {
        query = query.ilike('country', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.limit(10);
      
      if (error) throw error;
      
      // Sort results: newest accounts first to help with finding friends who just joined
      const sortedData = data?.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      }) || [];
      
      setSearchResults(sortedData);
      
      if (sortedData.length === 0) {
        toast({
          description: `No users found with that ${searchTab === 'username' ? 'username' : 'location'}.`
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

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddFriend = (userId: string, username: string, country?: string) => {
    onAddFriend(userId, { username, country });
    // Don't clear search results here so users can add multiple friends
    sonnerToast.success(`Friend request sent to ${username}`);
  };

  return (
    <div className="p-4 border-b border-border">
      <Tabs 
        defaultValue="username" 
        value={searchTab}
        onValueChange={(value) => setSearchTab(value as 'username' | 'location')}
        className="mb-2"
      >
        <TabsList className="w-full">
          <TabsTrigger value="username" className="flex-1">Search by Username</TabsTrigger>
          <TabsTrigger value="location" className="flex-1">Search by Location</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4 relative">
        <div className="relative flex-grow">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchTab === 'username' 
              ? "Search for people by username" 
              : "Search for people by country or location"
            }
            className="pl-9 pr-8"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          {searchQuery && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1 h-8 w-8" 
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" disabled={isSearching || !searchQuery.trim()} className="flex-shrink-0">
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching
            </>
          ) : (
            'Search'
          )}
        </Button>
      </form>
      
      {searchResults.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">
                Search Results <Badge variant="outline">{searchResults.length}</Badge>
              </h4>
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                Clear
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-card hover:bg-accent/20 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      {user.country && (
                        <p className="text-xs text-muted-foreground">{user.country}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFriend(user.id, user.username, user.country)}
                    disabled={isAdding}
                    className="ml-2"
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Add Friend
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FriendSearch;

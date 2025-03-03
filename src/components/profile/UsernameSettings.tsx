
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AuthContext from "@/context/AuthContext";

const UsernameSettings = () => {
  const { user, updateUsername } = useContext(AuthContext);
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a valid username.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUsername(newUsername);
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update username. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 glass-morphism rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Update Your Username</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter new username"
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-purple hover:bg-purple-dark"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Username"}
        </Button>
      </form>
    </div>
  );
};

export default UsernameSettings;


import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AuthContext from "@/context/AuthContext";
import { Facebook, Mail, Github } from "lucide-react";

const AuthForm = () => {
  const { signIn, signUp, continueAsGuest, signInWithSocial } = useContext(AuthContext);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(formData.email, formData.password);
      toast({
        title: "Account created",
        description: "You've successfully signed up.",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please try again with a different email.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    toast({
      title: "Welcome!",
      description: "You're now using Nuvora as a guest.",
    });
  };

  const handleSocialSignIn = (provider: string) => {
    setIsLoading(true);
    try {
      signInWithSocial(provider);
      toast({
        title: "Processing login",
        description: `Signing in with ${provider}...`,
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: `Could not sign in with ${provider}.`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 glass-morphism animate-fade-in rounded-xl">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('google')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Google</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('facebook')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Facebook className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('github')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Github className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">GitHub</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('google')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Google</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('facebook')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Facebook className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('github')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Github className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">GitHub</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGuestAccess}
          disabled={isLoading}
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;


import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AuthContext from "@/context/AuthContext";
import { Facebook, Mail, Instagram, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthForm = () => {
  const { signIn, signUp, continueAsGuest, signInWithSocial } = useContext(AuthContext);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (error) setError(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to sign in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(formData.email, formData.password);
      toast({
        title: "Account created",
        description: "Your account has been successfully created. You can now use the application.",
      });
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to sign up. Please try with a different email.");
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
    } catch (error: any) {
      console.error(error);
      setError(`Could not sign in with ${provider}.`);
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
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
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
                onClick={() => handleSocialSignIn('instagram')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Instagram className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Instagram</span>
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
                disabled={isLoading}
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
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
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
                onClick={() => handleSocialSignIn('instagram')}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <Instagram className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Instagram</span>
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
}

export default AuthForm;

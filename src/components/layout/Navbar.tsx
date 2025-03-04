
import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, Users, User, Settings, GamepadIcon, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthContext from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user, signOut, hasActiveSubscription } = useContext(AuthContext);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Create a function to get menu items that includes conditional items based on subscription
  const getMenuItems = () => {
    const items = [
      { title: "Chat", path: "/chat", icon: MessageSquare },
      { title: "Friends", path: "/friends", icon: Users },
      { title: "Online Users", path: "/online-users", icon: UserPlus },
    ];
    
    // Only add Games menu item for users with active subscription
    if (hasActiveSubscription()) {
      items.push({ title: "Games", path: "/games", icon: GamepadIcon });
    }
    
    items.push(
      { title: "Profile", path: "/profile", icon: User },
      { title: "Settings", path: "/settings", icon: Settings }
    );
    
    return items;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <NavLink to="/" className="font-bold text-xl">
          Nuvora
        </NavLink>
        
        {user ? (
          <div className="flex items-center space-x-4">
            {isMobile ? (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:w-64">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through the app.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="grid gap-4 mt-4">
                    {getMenuItems().map((item) => (
                      <NavLink
                        key={item.title}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive ? "bg-accent text-accent-foreground" : "text-foreground/60"
                          )
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    ))}
                    <Button variant="ghost" className="justify-start" onClick={signOut}>
                      Sign Out
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            )}
          </div>
        ) : null}
      </div>
      
      {user && !isMobile && (
        <nav className="container px-4 py-1">
          <ul className="flex items-center space-x-4">
            <li>
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                Chat
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/friends"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                Friends
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/online-users"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                Online Users
              </NavLink>
            </li>
            {hasActiveSubscription() && (
              <li>
                <NavLink
                  to="/games"
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                    )
                  }
                >
                  Games
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;

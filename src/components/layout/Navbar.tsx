
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, LogOut, User, Settings } from "lucide-react";
import Logo from "./Logo";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-10" />
          <span className="font-heading font-semibold text-lg text-umblue hidden sm:inline-block">
            UM Surabaya Room Scheduler
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              {user.role === "admin" ? (
                <>
                  <Link to="/admin/dashboard" className="text-umblue hover:text-umblue-light transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/admin/buildings" className="text-umblue hover:text-umblue-light transition-colors">
                    Buildings
                  </Link>
                  <Link to="/admin/bookings" className="text-umblue hover:text-umblue-light transition-colors">
                    All Bookings
                  </Link>
                  <Link to="/admin/users" className="text-umblue hover:text-umblue-light transition-colors">
                    Users
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-umblue hover:text-umblue-light transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/book" className="text-umblue hover:text-umblue-light transition-colors">
                    Book Room
                  </Link>
                  <Link to="/my-bookings" className="text-umblue hover:text-umblue-light transition-colors">
                    My Bookings
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-umblue text-white">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="btn-hover">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-umblue hover:bg-umblue-light btn-hover">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden py-4 px-6 bg-white border-b border-border">
          <nav className="flex flex-col gap-4">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/buildings" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Buildings
                    </Link>
                    <Link 
                      to="/admin/bookings" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      All Bookings
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Users
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/book" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Book Room
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="py-2 px-3 text-left rounded-md text-red-500 hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

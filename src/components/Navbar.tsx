import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Sparkles, Heart, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useFavorites from "@/hooks/useFavorites";
import SearchBar from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Frases", path: "/frases" },
    { label: "Resumos", path: "/resumos" },
    { label: "Favoritos", path: "/favoritos", badge: favoritesCount },
    { label: "Buscar", path: "/buscar" },
    { label: "Notificações", path: "/notificacoes" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-hero rounded-xl group-hover:animate-glow group-hover:scale-110 transition-all duration-500 shadow-md">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Spark Phrase Bank
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="mr-4">
              <SearchBar placeholder="Buscar..." size="sm" className="w-64" />
            </div>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "hero" : "glass"}
                  size="sm"
                  className="relative group"
                >
                  {item.label === "Favoritos" && (
                    <Heart className="h-4 w-4 mr-2 text-accent transition-colors" />
                  )}
                  {item.label === "Notificações" && (
                    <Bell className="h-4 w-4 mr-2 text-primary transition-colors" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce-in shadow-sm"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="glass"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="relative overflow-hidden"
            >
              <div className={`transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-3 pt-3 pb-4 space-y-3 glass-dark rounded-xl mt-3 mb-4 border border-border/30 shadow-lg">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBar placeholder="Buscar frases, resumos..." size="md" />
              </div>
              
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Button
                    variant={isActive(item.path) ? "hero" : "glass"}
                    className="w-full justify-start group animate-slide-in-right"
                  >
                    {item.label === "Favoritos" && (
                      <Heart className="h-4 w-4 mr-3 text-accent group-hover:scale-110 transition-transform" />
                    )}
                    {item.label === "Notificações" && (
                      <Bell className="h-4 w-4 mr-3 text-primary group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs animate-bounce-in shadow-sm"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
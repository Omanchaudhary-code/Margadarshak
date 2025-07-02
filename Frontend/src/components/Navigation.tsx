
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/calculator", label: "Try Calculator" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Professional Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
              <span className="text-white font-semibold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-semibold text-slate-900">
                Margadarshak
              </span>
              <div className="text-xs text-slate-500 font-medium">Academic Planning</div>
            </div>
          </Link>

          {/* Clean Center Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Professional Right side button - Desktop */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                size="sm" 
                onClick={handleGetStarted}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Loading...' : 'Get Started'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Clean Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-blue-700 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                {isLoggedIn ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setIsOpen(false);
                      handleGetStarted();
                    }}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {loading ? 'Loading...' : 'Get Started'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

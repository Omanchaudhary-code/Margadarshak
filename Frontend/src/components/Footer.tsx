import { Link } from "react-router-dom";
import { Github, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com",
      color: "hover:text-slate-600",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:info@margadarshak.tech",
      color: "hover:text-slate-600",
    },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">Margadarshak</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-md">
              Empowering BBIS students at Kathmandu University with AI-powered graduation timeline predictions and academic insights.
            </p>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <span>Trusted by 500+ students</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Connect</h3>
            <div className="space-y-3 mb-4">
              <div className="text-sm text-slate-600">
                <div className="font-medium text-slate-700">Email</div>
                <div>info@margadarshak.tech</div>
              </div>
              <div className="text-sm text-slate-600">
                <div className="font-medium text-slate-700">University</div>
                <div>Kathmandu University</div>
              </div>
            </div>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 transition-all duration-200 hover:border-slate-300 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-slate-500 text-sm text-center md:text-left">
            <p>&copy; 2025 Margadarshak. All rights reserved.</p>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 text-xs">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 text-xs">
              Terms of Service
            </Link>
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 text-xs h-8 px-3"
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

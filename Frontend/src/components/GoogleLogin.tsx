
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLogin: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // You'll need to replace this with your actual client ID
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          });
        }
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await signInWithGoogle(response.credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleManualLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.3)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop')`,
        }}
      />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <Card className="shadow-2xl border-0 transform hover:scale-105 transition-all duration-500 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center transform transition-all duration-500 hover:rotate-12">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Margadarshak</CardTitle>
            <p className="text-gray-600">Sign in with your Google account to continue</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Google Sign-In Button Container */}
              <div ref={googleButtonRef} className="w-full"></div>
              
              {/* Fallback manual button */}
              <Button 
                onClick={handleManualLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleLogin;

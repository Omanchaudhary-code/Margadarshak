
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationLoader } from '@/components/ui/graduation-loader';
import { LogIn, User, Lock, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Auth: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        toast({
          title: "Success!",
          description: "Successfully signed in",
        });
        navigate('/dashboard');
      } else {
        await signUpWithEmail(email, password, fullName);
        
        // Check if user needs email confirmation
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is immediately signed in (no email confirmation required)
          toast({
            title: "Success!",
            description: "Account created and signed in successfully",
          });
          navigate('/dashboard');
        } else {
          // User needs to confirm email
          setShowSuccessModal(true);
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your signup",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isLogin ? 'sign in' : 'sign up'}`,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `https://nmlngslctmindvcnmqai.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">📧 Check Your Email!</h2>
        <p className="text-gray-600 mb-6">
          We've sent you a confirmation link. Click it to complete your signup and access your dashboard.
        </p>
        <Button 
          onClick={() => setShowSuccessModal(false)}
          className="w-full"
        >
          Got it!
        </Button>
      </div>
    </div>
  );

  return (
    <>
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
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to access your dashboard' : 'Join us to get started'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type="text" 
                        placeholder="Enter your full name" 
                        className="pl-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        autoFocus={!isLogin}
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="pl-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus={isLogin}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      className="pl-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading || isRedirecting}
                  className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 relative"
                >
                  {loading || isRedirecting ? (
                    <div className="flex items-center justify-center">
                      <GraduationLoader size="sm" showText={false} />
                      <span className="ml-2">{isRedirecting ? 'Redirecting...' : 'Processing...'}</span>
                    </div>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {isLogin ? 'Sign In' : 'Sign Up'}
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || isRedirecting}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    disabled={loading || isRedirecting}
                    className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  By continuing, you agree to our{" "}
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

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default Auth;

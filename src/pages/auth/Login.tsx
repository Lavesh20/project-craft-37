
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Handle login form data changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle register form data changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Form Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle register submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password.length < 6) {
      toast({
        title: "Password Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(registerData.name, registerData.email, registerData.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes, we'll provide test login credentials
  const fillDemoCredentials = () => {
    setLoginData({
      email: 'demo@example.com',
      password: 'password123'
    });
    toast({
      title: "Demo Credentials",
      description: "Demo credentials filled. Click Sign In to continue.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="container mx-auto p-6">
        <div className="flex items-center gap-2">
          <span className="text-jetpack-blue text-2xl font-bold">jetpack</span>
          <span className="text-jetpack-blue text-lg">=</span>
          <span className="text-jetpack-blue text-lg font-light">workflow</span>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="container mx-auto flex flex-col lg:flex-row p-6">
          {/* Left column - Content/Marketing */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center mb-8 lg:mb-0 pr-0 lg:pr-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your client work done on time, every time</h1>
            <p className="text-gray-600 mb-6 text-lg">
              It's the easiest way to standardize your work, automate your deadlines, and track everything in your firm.
            </p>
            <img
              src="/lovable-uploads/f9aeb9fb-935f-462b-81a8-28acf68e12b6.png"
              alt="Jetpack Workflow Demo"
              className="hidden lg:block rounded-lg shadow-lg mb-4 max-w-md"
            />
          </div>

          {/* Right column - Auth form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome to Jetpack Workflow</CardTitle>
                <CardDescription className="text-center">
                  {activeTab === 'login' 
                    ? 'Sign in to your account to continue' 
                    : 'Create an account to get started'}
                </CardDescription>
              </CardHeader>
              
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mx-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="m-0">
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            className="pl-10"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="pl-10"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <Button 
                        type="submit" 
                        className="w-full bg-jetpack-blue hover:bg-blue-700" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      
                      <div className="mt-4 w-full">
                        <Separator className="my-4" />
                        <Button 
                          type="button"
                          variant="outline"
                          className="w-full" 
                          onClick={fillDemoCredentials}
                        >
                          Use Demo Account
                        </Button>
                      </div>
                      
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <button 
                          type="button" 
                          className="text-jetpack-blue hover:underline"
                          onClick={() => setActiveTab('register')}
                        >
                          Sign Up
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="m-0">
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            className="pl-10"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            className="pl-10"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="pl-10"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="pl-10"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <Button 
                        type="submit" 
                        className="w-full bg-jetpack-blue hover:bg-blue-700" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <button 
                          type="button" 
                          className="text-jetpack-blue hover:underline"
                          onClick={() => setActiveTab('login')}
                        >
                          Sign In
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2025 Jetpack Workflow. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="#" className="text-sm text-gray-500 hover:text-jetpack-blue">Privacy</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-jetpack-blue">Terms</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-jetpack-blue">Help</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-jetpack-blue">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;

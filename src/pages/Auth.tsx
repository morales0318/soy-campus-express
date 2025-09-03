import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, getCurrentUser } from "@/lib/auth";
import { CAMPUS_OPTIONS } from "@/data/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [facebook, setFacebook] = useState('');
  const [campus, setCampus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (user) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !contact || !campus) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await signUp(email, password, username, contact, facebook, campus);
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (user) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account",
        });
        setMode('login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Sign up for a new account to get started'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="Enter your contact number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook Account (Optional)</Label>
                  <Input
                    id="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="Enter your Facebook username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campus">Campus Location</Label>
                  <Select value={campus} onValueChange={setCampus} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPUS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setEmail('');
                setPassword('');
                setUsername('');
                setContact('');
                setFacebook('');
                setCampus('');
              }}
              className="text-sm"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
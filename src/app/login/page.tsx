'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser, FirebaseClientProvider } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

function LoginPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router, toast]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (auth) {
        // We are using anonymous sign-in for this demo.
        initiateAnonymousSignIn(auth);
    } else {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Could not connect to authentication service.",
        });
        setIsLoading(false);
    }
    // The useEffect hook will handle the redirect on successful login.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12.4 2.7c.3-.3.8-.3 1.1 0l7.1 7.1c.3.3.3.8 0 1.1l-7.1 7.1c-.3-.3-.8-.3-1.1 0l-7.1-7.1c-.3-.3-.3-.8 0-1.1l7.1-7.1z"/><path d="M5.3 9.8 2.7 12.4c-.3.3-.3.8 0 1.1l7.1 7.1c.3.3.8.3 1.1 0l2.6-2.6"/></svg>
                </div>
                <h1 className="text-2xl font-bold">PermitFlow</h1>
            </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Sign in to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || isUserLoading}>
              {(isLoading || isUserLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In As Guest
            </Button>
            <p className="text-center text-xs text-muted-foreground">
                This is a demo. You will be logged in anonymously.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <LoginPageContent />
        </FirebaseClientProvider>
    )
}

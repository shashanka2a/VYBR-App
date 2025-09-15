import { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Lock, LogIn, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface AuthGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
}

export function AuthGate({ children, feature, description }: AuthGateProps) {
  const { user } = useAuth();

  if (user?.isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center p-8">
          <div className="text-primary/60 mb-6">
            <Lock className="w-16 h-16 mx-auto mb-4" />
          </div>
          
          <h2 className="heading-3 mb-3">Authentication Required</h2>
          
          <p className="body-normal text-muted-foreground mb-2">
            Sign in to access {feature}
          </p>
          
          {description && (
            <p className="body-small text-muted-foreground/80 mb-6">
              {description}
            </p>
          )}
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent-emerald hover:from-primary/90 hover:to-accent-emerald/90"
              onClick={() => window.location.href = '/auth/login'}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/auth/register'}
            >
              <Mail className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </div>
          
          <p className="body-small text-muted-foreground/60 mt-6">
            Join with your .edu email address
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect } from 'react';
import { useLogging } from '@/hooks/useLogging';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { identifyUser } = useLogging();

  useEffect(() => {
    // When user logs in
    const handleLogin = (user: any) => {
      identifyUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    };

    // Add your auth listener here
    // Example with Supabase:
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        handleLogin(session.user);
      }
    });
  }, []);

  return <>{children}</>;
}
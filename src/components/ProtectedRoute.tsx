import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from './SessionProvider';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { session, profile } = useSession();
    const location = useLocation();

    // If loading session, show a loading state
    // If session exists but profile is still undefined (initial load), show loading
    if (session === undefined || (session && profile === undefined)) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mb-4" />
                <p className="text-gray-600 font-medium animate-pulse">Protegendo sua conexão...</p>
            </div>
        );
    }

    // If no session, redirect to login
    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

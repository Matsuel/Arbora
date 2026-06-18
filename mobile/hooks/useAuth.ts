// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Session initiale
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Écoute les changements (login, logout, refresh du token)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_, session) => setSession(session)
        );

        return () => subscription.unsubscribe();
    }, []);

    return {
        session,
        user: session?.user ?? null,
        userId: session?.user.id ?? null,
        token: session?.access_token ?? null,
    }
}
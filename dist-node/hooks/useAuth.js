import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore, useUIStore } from '../store';
export function useAuth() {
    const { user, profile, isLoading, setUser, setProfile, setLoading, reset } = useAuthStore();
    const { addToast } = useUIStore();
    useEffect(() => {
        // Fetch initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        });
        // Subscribe to auth state changes
        const { data: { subscription }, } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            else {
                setProfile(null);
            }
        });
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('Tab visible - refreshing session...');
                supabase.auth.getSession().then(({ data: { session } }) => {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        fetchProfile(session.user.id);
                    }
                });
            }
        };
        const handleFocus = () => {
            console.log('Window focused - refreshing session...');
            supabase.auth.getSession().then(({ data: { session } }) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                }
            });
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        return () => {
            subscription.unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);
    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            console.error('Error fetching profile:', error.message);
            return;
        }
        setProfile(data);
    };
    const signUp = useCallback(async (formData) => {
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: { full_name: formData.full_name },
            },
        });
        if (error)
            throw new Error(error.message);
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: formData.full_name,
                role: 'both',
                caretaker_email: formData.caretaker_email || null,
                notification_time: '20:00',
            });
            if (profileError)
                throw new Error(profileError.message);
        }
        addToast({
            type: 'success',
            title: 'Account created!',
            message: 'Please check your email to verify your account.',
        });
        return data;
    }, []);
    const signIn = useCallback(async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error)
            throw new Error(error.message);
        addToast({
            type: 'success',
            title: 'Welcome back!',
            message: "You've successfully signed in.",
        });
        return data;
    }, []);
    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error)
            throw new Error(error.message);
        reset();
        addToast({ type: 'info', title: 'Signed out', message: 'See you next time!' });
    }, []);
    const updateProfile = useCallback(async (updates) => {
        if (!user)
            throw new Error('Not authenticated');
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        setProfile(data);
        addToast({ type: 'success', title: 'Profile updated!' });
        return data;
    }, [user]);
    return {
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile: () => user && fetchProfile(user.id),
    };
}

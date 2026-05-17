import { useState, useEffect } from 'react';

export function useUser() {
    const [user, setUser] = useState<{ user_id: number; email: string; created_at: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('http://localhost:5000/me', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading };
}
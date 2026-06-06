import { useEffect, useState } from 'react';

type Member = {
    user_id: number;
    email: string;
    role: string;
}

export function useProjectMember(projectId: number) {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchMembers() {
        try {
            const res = await fetch(`/http://localhost:5000/projects/${projectId}/members`)
            if (res.ok) {
                const data = await res.json();
                setMembers(data.members);
            } else {
                setError('Failed to fetch members');
            }
        } catch (err) {
            setError('Could not reach server');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (projectId) {
            fetchMembers();
        }
    }, [projectId]);

    return { members, loading, error, refetch: fetchMembers };
}
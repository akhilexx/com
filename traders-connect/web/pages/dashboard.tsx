import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name || user.email}</h1>
      <button onClick={logout} className="mt-4 bg-primary px-3 py-1 rounded">
        Logout
      </button>
    </main>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-primary">Traders Connect</h1>
      <p className="mt-4">Community platform coming soon.</p>
      <div className="space-x-4 mt-6">
        <a href="/login" className="underline">
          Login
        </a>
        <a href="/register" className="underline">
          Register
        </a>
      </div>
    </main>
  );
}

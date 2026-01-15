import ProtectedPage from '@/app/components/ProtectedPage';

export default function page() {
  return (
    <ProtectedPage>
      <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
        <h1 className="mb-6 text-3xl font-bold">User Page</h1>
        <p>Welcome to the user dashboard.</p>
      </div>
    </ProtectedPage>
  )
}

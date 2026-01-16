import { LoginForm } from "../components/loginform";

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-linear-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

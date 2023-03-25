import { FullFakebooksLogo, inputClasses } from '@/components'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { SignIn, SignOut } from '@/components/login'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <h1 className="mb-12">
        <FullFakebooksLogo size="lg" position="center" />
      </h1>
      <div className="items center mx-auto flex w-full max-w-md justify-center px-8">
        <SignIn />
      </div>
    </div>
  )
}

{
  /* <form method="POST" action="/api/auth/" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={emailError ? true : undefined}
                aria-describedby="email-error"
                className={inputClasses}
              />
              {emailError && (
                <div className="pt-1 text-red-700" id="email-error">
                  {emailError}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={passwordError ? true : undefined}
                aria-describedby="password-error"
                className={inputClasses}
              />
              {passwordError && (
                <div className="pt-1 text-red-700" id="password-error">
                  {passwordError}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <button
              type="submit"
              name="intent"
              value="login"
              className="w-full rounded bg-green-500 py-2 px-4 text-white hover:bg-green-600 focus:bg-green-400"
            >
              Log in w/ Github
            </button>
            <button
              type="submit"
              name="intent"
              value="signup"
              className="w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Sign Up
            </button>
          </div>
        </form> */
}

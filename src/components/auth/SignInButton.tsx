'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function SignInButton() {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('facebook')}>Sign in with Facebook</button>
    </div>
  )
}
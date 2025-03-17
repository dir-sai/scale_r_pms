import { type NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { type JWT } from '@auth/core/jwt'
import { type Session, type User } from '@auth/core/types'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { DefaultSession } from '@auth/core/types'
import type { Account, Profile } from 'next-auth'

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [], // Required by NextAuthConfig type
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
  callbacks: {
    authorized({ request, auth }: { request: NextRequest, auth: Session | null }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard')
      const isOnPortal = request.nextUrl.pathname.startsWith('/portal')
      const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')

      if (isOnDashboard || isOnPortal || isOnAdmin) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
      }
      return true
    },
    async session({ session, token }: { session: Session & { user: { role?: string } }, token: JWT & { role?: string } }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user, account, profile, trigger, isNewUser, session }: { 
      token: JWT, 
      user: User, 
      account: Account | null,
      profile?: Profile,
      trigger?: "signIn" | "signUp" | "update",
      isNewUser?: boolean,
      session?: any
    }) {
      if (user) {
        token.id = user.id
        // Only set role if it exists on the user
        if ('role' in user) {
          token.role = (user as User & { role: string }).role
        }
      }
      return token
    }
  },
  session: {
    strategy: 'jwt'
  }
}

export const { auth, signIn, signOut } = NextAuth(authOptions)
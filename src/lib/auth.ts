import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { JWT } from 'next-auth/jwt'

import type { NextAuthConfig } from 'next-auth'

export const config = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnPortal = nextUrl.pathname.startsWith('/portal')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      if (isOnDashboard || isOnPortal || isOnAdmin) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  },
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(config) 
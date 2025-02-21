import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { users } from '@/db/schema';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';

interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<User> {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                try {
                    const user = await db.select().from(users).where(eq(users.email, credentials.email));

                    if (user.length === 0) {
                        throw new Error('No user found with this email');
                    }
                    else {
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user[0].password
                        );

                        if (!isPasswordCorrect) {
                            throw new Error('Incorrect password');
                        }

                        return {
                            id: user[0].id.toString(),
                            username: user[0].username,
                            email: user[0].email,
                            createdAt: user[0].createdAt,
                            updatedAt: user[0].updatedAt,
                        };
                    }
                } catch (err: unknown) {
                    throw new Error(err as string);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id?.toString();
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
    },
};
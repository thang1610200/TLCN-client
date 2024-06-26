import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { BACKEND_URL } from '@/lib/constant';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

async function refreshToken(token: JWT): Promise<JWT> {
    const res = await fetch(BACKEND_URL + '/auth/refresh', {
        method: 'POST',
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });

    const response = await res.json();

    return {
        ...token,
        backendTokens: response,
    };
}

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            clientId: process.env.GITHUB_CLIENT_ID as string,
            async profile(profile) {
                const res = await fetch(BACKEND_URL + '/auth/login/social', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: profile.login,
                        email: profile.email,
                        image: `https://ui-avatars.com/api/?background=random&name=${profile.login
                            .split(' ')
                            .join('+')}`,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.status == 401 || res.status === 500) {
                    return null;
                }
                const user = await res.json();

                return { ...profile, ...user };
            },
        }),
        GoogleProvider({
            clientId: process.env.CLIENT_ID_GOOGLE as string,
            clientSecret: process.env.CLIENT_SECRET_GOOGLE as string,
            async profile(profile) {
                const res = await fetch(BACKEND_URL + '/auth/login/social', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: profile.name,
                        email: profile.email,
                        image: `https://ui-avatars.com/api/?background=random&name=${profile.name
                            .split(' ')
                            .join('+')}`,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.status == 401 || res.status === 500) {
                    return null;
                }
                const user = await res.json();

                return { ...profile, ...user, id: profile.sub };
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'name@example.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const { email, password } = credentials;

                const res = await fetch(BACKEND_URL + '/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 401 || res.status === 500) {
                    return null;
                }
                const user = await res.json();
                return user;
            },
        }),
    ],
    callbacks: {
        // async redirect({ url, baseUrl }) {
        //     if (url.startsWith("/")) return `${baseUrl}${url}`
        //     else if (new URL(url).origin === baseUrl) return url
        //     return baseUrl
        // },
        async jwt({ token, user, trigger, session }) {
            if (trigger === 'update') {
                token.user.name = session.user.name;
                token.user.image = session.user.image;
                token.user.role = session.user.role;
                return { ...token };
            }
            if (user) return { ...token, ...user };
            if (new Date().getTime() < token.backendTokens.expiresIn) {
                return token;
            }
            return await refreshToken(token);
        },

        async session({ token, session }) {
            session.user = token.user;
            session.backendTokens = token.backendTokens;
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: '/login',
    },
};
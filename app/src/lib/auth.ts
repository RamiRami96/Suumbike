import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { v4 as uuid } from "uuid";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "signin",
      credentials: {
        tgNickname: {
          label: "tgNickname",
          type: "tgNickname",
          placeholder: "@tgNickname",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.tgNickname || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            tgNickname: credentials.tgNickname,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          randomKey: "randomKey-" + uuid(),
          extraData: {
            age: user.age,
            tgNickname: user.tgNickname,
            avatar: user.avatar,
          },
        };
      },
    }),
  ],
  callbacks: {
    jwt: (data) => {
      const token = {
        age: (data.user as any)?.extraData?.age,
        tgNickname: (data.user as any)?.extraData?.tgNickname,
        avatar: (data.user as any)?.extraData?.avatar,
        randomKey: (data.user as any)?.randomKey,
      };

      return Object.assign(token, data.token);
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          age: token.age,
          tgNickname: token.tgNickname,
          avatar: token.avatar,
          randomKey: token.randomKey,
        },
      };
    },
  },
};

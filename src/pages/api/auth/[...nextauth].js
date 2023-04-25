import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../prisma/prismaClient";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const userExists = await prisma.profile.findUnique({
        where: { id: user.id },
      });
      if (!userExists) {
        const newUser = {
          avatar: user.image,
          name: user.name,
          email: user.email,
        };

        await prisma.profile.create({ data: newUser });
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);

import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../../prisma/prismaClient";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      return { ...session, id: user.id };
    },
    async signIn({ user }) {
      try {
        const userExists = await prisma.profile.findFirst({
          where: { email: user.email },
        });
        if (!userExists) {
          const newUser = {
            avatar: user.image,
            name: user.name,
            email: user.email,
          };

          await prisma.profile.create({ data: newUser });
        }
      } catch (error) {
        console.log(error);
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

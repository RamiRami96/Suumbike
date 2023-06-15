import { prisma } from "../../../prisma/prismaClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return null;

  const profile = await prisma.profile.findFirst({
    where: { email },
    include: { likedProfiles: true },
  });

  const likedProfile = profile?.likedProfiles?.at(-1);

  if (!likedProfile) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center h-92">
      <Image
        src={likedProfile.avatar}
        className="object-cover rounded-full w-[300px] h-[300px] mt-10 md:mt-14"
        alt="contact"
        width={300}
        height={300}
      />
      <h2 className="text-primary text-center font-bold text-xl mt-14">
        <span className="text-pink-600 font-extrabold text-4xl">
          {likedProfile.name}
        </span>
        {"  "}
        has been added to your contacts
      </h2>
    </div>
  );
}

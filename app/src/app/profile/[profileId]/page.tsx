import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Params = {
  profileId: string;
};

type Props = {
  params: Params;
};

export default async function Page({ params }: Props) {
  const profile = await prisma.user.findFirst({
    where: { id: params.profileId },
  });

  if (!profile)
    return (
      <h2 className="text-center py-6 text-pink-600">User hasn't found :(</h2>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href="/profile"
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg cursor-pointer"
      >
        Back to profile page
      </Link>
      <div className="mt-10 flex flex-col items-center">
        <div className="relative w-[300px] h-[300px]">
          <Image
            className="absolute rounded-t-3xl object-cover w-[300px] h-[300px] cursor-pointer border border-pink-600 mx-auto"
            src={
              profile.avatar ? "/avatars/" + profile.avatar : "/icons/user.svg"
            }
            alt="Avatar"
            width={300}
            height={300}
            placeholder="blur"
            blurDataURL={"/icons/user.svg"}
          />
        </div>
        <div className="mt-4 w-[300px] p-4 bg-pink-600 text-white rounded-b-xl">
          <h2 className="text-4xl">{profile.name} </h2>
          <ul className="mt-4 list-none">
            <li>
              <span className="font-bold">Age</span> - {profile.age}
            </li>
            <li>
              <span className="font-bold">Nick</span> - @{profile.tgNickname}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

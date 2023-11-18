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
      <h2 className="text-center py-6 text-pink-400">Qullanuçı tabılmadı :(</h2>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href="/profile"
        className="bg-pink-400 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg cursor-pointer"
      >
        Profilgä qaytu
      </Link>
      <div className="mt-10 flex flex-col items-center">
        <div className="relative w-[300px] h-[300px]">
          <Image
            className="absolute rounded-t-3xl object-cover w-[300px] h-[300px] cursor-pointer border border-pink-400 mx-auto"
            src={
              profile.avatar ? "/avatars/" + profile.avatar : "/icons/user.svg"
            }
            alt="Avatar"
            width="300"
            height="300"
          />
        </div>
        <div className="mt-4 w-[300px] p-4 bg-pink-400 text-white rounded-b-xl">
          <h2 className="text-4xl flex items-center">
            {profile.name}{" "}
            <div className="relative flex h-3 w-3 ml-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  profile.isOnline ? "bg-green-500" : "bg-red-500"
                } `}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  profile.isOnline ? "bg-green-600" : "bg-red-700"
                } `}
              ></span>
            </div>
          </h2>
          <ul className="mt-4 list-none">
            <li>
              <span className="font-bold">Yaş</span> - {profile.age}
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

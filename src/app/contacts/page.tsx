import { getServerSession } from "next-auth";
import Image from "next/image";
import { prisma } from "../../../prisma/prismaClient";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Profile } from "../types/profile";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return null;

  const profile = await prisma.profile.findFirst({
    where: { email },
    include: { likedProfiles: true },
  });

  const LIKED_PROFILES = profile?.likedProfiles as unknown as Profile[];
  return (
    <div className="flex justify-center">
      {!LIKED_PROFILES || LIKED_PROFILES?.length === 0 ? (
        <h2> Not liked users :(</h2>
      ) : (
        <div className="overflow-x-auto w-full sm:w-5/6">
          <table className="min-w-[320px] w-full sm:w-5/6 divide-y divide-pink-400 mt-24 border border-pink-400">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-pink-400 uppercase tracking-wider"
                >
                  Avatar
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-pink-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-pink-400 uppercase tracking-wider"
                >
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-400 ">
              {LIKED_PROFILES.map(({ avatar, name, email }) => (
                <tr className="border-b-pink-400">
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={avatar}
                          alt="Avatar"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-pink-400">{name}</div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-pink-400">{email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import ProfileDetails from "@/modules/profile/components/ProfileDetails";
import { prisma } from "@/shared/lib/prisma";

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
      <h2 className="text-center py-6 text-pink-600">User hasn&apos;t found :(</h2>
    );

  return <ProfileDetails profile={profile} />;
}

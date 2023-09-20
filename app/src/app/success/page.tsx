import Image from "next/image";

type Props = {
  searchParams?: { name: string; avatar: string };
};

export default async function Page({ searchParams }: Props) {
  if (!searchParams?.avatar && !searchParams?.name) return null;

  const avatar = searchParams.avatar;
  const name = searchParams.name;

  return (
    <section className="flex flex-col justify-center items-center h-92">
      <Image
        src={"/avatars/" + avatar}
        className="object-cover rounded-full w-[300px] h-[300px] mt-10 md:mt-14"
        alt="contact"
        width={300}
        height={300}
      />
      <h2 className="text-primary text-center font-bold text-xl mt-14">
        <span className="text-pink-600 font-extrabold text-4xl">{name}</span>
        {"  "}
        has been added to your contacts
      </h2>
    </section>
  );
}

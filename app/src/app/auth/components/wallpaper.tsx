import Image from "next/image";

export default function Wallpaper() {
  return (
    <div className="h-[90.3vh] bg-gradient-to-l from-pink-400 to-pink-500 hidden md:flex justify-center items-center w-3/6 pb-2">
      <Image
        src={"/images/couple.png"}
        alt="couple"
        width={500}
        height={500}
        className="animate-waving-couple"
      />
    </div>
  );
}

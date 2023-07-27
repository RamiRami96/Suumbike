"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import heartIcon from '../../public/heart.svg'

export default function StartButton() {
  const { push } = useRouter();
  
  const session = {
    user: {
      name: 'Ramil Usmanov',
      email: 'ramiramiusmanov1996@gmail.com',
      image: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=178142988471195&height=50&width=50&ext=1692864040&hash=AeT01IymBxPIPs24aOI'
    },
    id: 'clki0bxro0000tzl4f4878uxk'
  }


  const handleClick = () => {
    if (!session || (session && !session?.user)) {
      console.log('signIn')
    }
    push("/stream");
  };

  const numberOfBubbles = 25;

  const generateBubbleStyles = (index:number) => {
    return {
      '--bubble-radius': `${index}vw`,
      '--bubble-float-duration': `${index * 4}s`,
      '--bubble-sway-duration': `${index * 0.5}s`,
      '--bubble-float-delay': `${index * 0.1}s`,
      '--bubble-sway-delay': `${index * 0.1}s`,
      '--bubble-sway-type': index % 2 === 0 ? 'sway-left-to-right' : 'sway-right-to-left',
    };
  };
  return (
    <div className="h-[90.3vh] flex flex-col items-center justify-center relative overflow-hidden">
    <div className="bubbles h-[90.3vh]">
      {Array.from({ length: numberOfBubbles }, (_, index) => (
        <div
          key={index}
          className="bubble animation-pulse"
          style={generateBubbleStyles(index + 1) as React.CSSProperties}
        >
          ❤
        </div>
      ))}
    </div>
    <button
      className="absolute z-50 border-2 border-pink-400 h-48 w-48 rounded-full bg-white text-pink-600 font-bold uppercase shadow-2xl shadow-pink-300"
      onClick={handleClick}
    >
      Start
    </button>
  </div>
  );
}

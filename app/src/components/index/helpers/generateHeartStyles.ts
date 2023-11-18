export const generateHeartStyles = (index: number) => {
  return {
    "--heart-radius": `${index}vw`,
    "--heart-float-duration": `${index * 4}s`,
    "--heart-sway-duration": `${index * 0.5}s`,
    "--heart-float-delay": `${index * 0.1}s`,
    "--heart-sway-delay": `${index * 0.1}s`,
    "--heart-sway-type":
      index % 2 === 0 ? "sway-left-to-right" : "sway-right-to-left",
  };
};

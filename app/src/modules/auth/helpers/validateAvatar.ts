export const validateAvatar = (value: File | null) => {
  if (!value) return true;

  if (value.type !== "image/jpeg" && value.type !== "image/png") {
    return "This image must be jpeg or png";
  }

  return true;
};

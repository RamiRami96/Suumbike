export const calculateAge = (birthdate: string): number => {
  const currentDate = new Date();
  const birthDate = new Date(birthdate);

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  const currentMonth = currentDate.getMonth();
  const birthMonth = birthDate.getMonth();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const validateAge = (value: string) => {
  const selectedDate = calculateAge(value);
  const minDate = 18;
  const maxDate = 99;

  if (selectedDate < minDate || selectedDate > maxDate) {
    return "Age must be more than 18 and less than 99";
  }

  return true;
};

export const validateAvatar = (value: File | null) => {
  if (!value) return true;

  if (value.type !== "image/jpeg" && value.type !== "image/png") {
    return "This image must be jpeg or png";
  }

  return true;
};

export const input_style =
  "form-control block w-full px-4 py-4 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-400 focus:outline-none";

export const error_style = "text-red-500 text-xs h-8 flex items-center";

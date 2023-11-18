import { calculateAge } from "./calculateAge";

export const validateAge = (value: string) => {
  const selectedDate = calculateAge(value);
  const minDate = 18;
  const maxDate = 99;

  if (selectedDate < minDate || selectedDate > maxDate) {
    return "Age must be more than 18 and less than 99";
  }

  return true;
};

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
  

  
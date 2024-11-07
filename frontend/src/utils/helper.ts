export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name: string | undefined) => {
  if (!name) return "";

  const words = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return words;
};

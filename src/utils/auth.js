export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // true لو فيه توكن
};

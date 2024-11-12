// utils/auth.ts
export const isAuthenticated = () => {
  // Check if the session token exists in cookies (or localStorage)
  const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('ANAS-AUTH='));
  return token ? true : false;
};

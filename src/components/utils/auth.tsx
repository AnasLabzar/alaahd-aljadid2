// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('ANAS-AUTH') !== null;
};

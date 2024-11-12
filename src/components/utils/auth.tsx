"use client"

export const isAuthenticated = (): boolean => {
  // Check if window is defined (code is running in the browser)
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('ANAS-AUTH') !== null;
  }
  return false;
};

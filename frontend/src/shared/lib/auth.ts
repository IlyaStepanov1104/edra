export const useAuth = () => {
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwtToken');
    }
    return null;
  };

  const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwtToken', token);
      document.cookie = `jwtToken=${token}; path=/; max-age=86400; secure=${process.env.NODE_ENV === 'production'}; samesite=strict`;
    }
  };

  const removeToken = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
      document.cookie = 'jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  const isAuthenticated = (redirect = false): boolean => {
    const hasToken = !!getToken();
    if (!hasToken && redirect && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return hasToken;
  };

  return {
    getToken,
    setToken,
    removeToken,
    isAuthenticated
  };
};
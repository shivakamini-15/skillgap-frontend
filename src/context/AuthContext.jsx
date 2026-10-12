import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const signIn = (auth) => {
    localStorage.setItem('token', auth.token);
    const u = { id: auth.id, fullName: auth.fullName, email: auth.email, role: auth.role };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export const homePath = (role) => (role === 'STUDENT' ? '/student' : '/admin');

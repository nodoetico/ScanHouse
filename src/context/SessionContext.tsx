import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Agency, AgencyId } from '../types/agency';
import { findAgencyByCredentials, getAgencyById } from '../data/agencies';

interface SessionState {
  agency: Agency | null;
  login: (email: string, password: string) => Agency | null;
  logout: () => void;
  switchAgency: (id: AgencyId) => void;
}

const SessionContext = createContext<SessionState>({
  agency: null,
  login: () => null,
  logout: () => {},
  switchAgency: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [agency, setAgency] = useState<Agency | null>(null);

  const login = useCallback((email: string, password: string) => {
    const found = findAgencyByCredentials(email, password);
    if (found) {
      setAgency(found);
      return found;
    }
    return null;
  }, []);

  const logout = useCallback(() => setAgency(null), []);

  const switchAgency = useCallback((id: AgencyId) => {
    setAgency(getAgencyById(id));
  }, []);

  const value = useMemo(() => ({ agency, login, logout, switchAgency }), [agency, login, logout, switchAgency]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
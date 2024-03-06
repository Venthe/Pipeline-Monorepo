import React, { createContext, useEffect, useRef, useState } from 'react';
import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

const MAX_TIMESTAMP = 8640000000000000;

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:15380/auth',
  realm: 'Example',
  clientId: 'example-client'
};

const initOptions: KeycloakInitOptions = {
};

export interface User {
  isAuthenticated: boolean
  roles: string[]
  email?: string
  login?: string
  fullName?: string
  expiration?: Date
  authenticationDate?: Date
  timeRemaining: number
}

type LoginProps = {
  redirectUrl?: string;
};

type Context = {
  user?: User;
  logout: () => void;
  login: (props?: LoginProps) => void;
  refreshSession: () => void;
};

export const SessionContext = createContext<Context | undefined>(undefined);

const calculateRemainingTime = (a: Date | undefined, b: Date | undefined): number => {
  const d1 = a ?? new Date();
  const d2 = b ?? new Date(MAX_TIMESTAMP)

  return d2.getTime() -  d1.getTime()
}

export const LoginContextProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useState<User | undefined>();

  const keycloakInitRef = useRef(false)

  const keycloakRef = useRef(new Keycloak(keycloakConfig));
  const keycloak = keycloakRef.current;

  const refreshSession = () => {
    setTimeout(() => {
      keycloak.updateToken(70).then((result) => {
        if (result) {
          console.debug('Token refreshed' + result);
        } else {
          console.warn('Token not refreshed, valid for '
            + Math.round((keycloak.tokenParsed?.exp ?? 0) + (keycloak.timeSkew ?? 0) - new Date().getTime() / 1000) + ' seconds');
        }
      }).catch(() => {
        console.error('Failed to refresh token');
      });
    }, 60000);
  }

  const resetSession = () => {
    setUser(undefined)
    keycloak.clearToken()
  };

  const logout = () => {
    resetSession();
    keycloak.logout().then(console.log).catch(console.error);
  };

  const login = (props?: LoginProps) => {
    keycloak.login({ redirectUri: props?.redirectUrl }).then(console.log).then(() => setUser(undefined)).catch(console.error);
  };

  useEffect(() => {
    if (!keycloakInitRef.current) {
      keycloakInitRef.current = true;
      keycloak.init(initOptions).then((auth) => {
        if (!auth) {
          console.warn("User not authenticated")
        } else {
          console.debug('Authenticated', keycloak.tokenParsed);
          const token = keycloak.tokenParsed
          if (!token) throw new Error("")
          const expiration = token.exp ? new Date(token.exp * 1000) : undefined;
          const authenticationDate = token.auth_time ? new Date(token.auth_time * 1000) : undefined;
          setUser({
            isAuthenticated: true,
            roles: token.roles,
            email: token.email,
            fullName: token.name,
            login: token.preferred_username,
            expiration: expiration,
            authenticationDate: authenticationDate,
            timeRemaining: calculateRemainingTime(new Date(Date.now()), expiration)
          })
        }
      }).catch(() => {
        console.error('Authenticated Failed');
      });

      const updateTime = () => setTimeout(() => {
        setUser(u => {
          if(!u) return u
          const remainingTime = calculateRemainingTime(new Date(Date.now()), u?.expiration);

          if(keycloak.isTokenExpired()) resetSession()

          return {...u, timeRemaining: remainingTime}
        })

        updateTime();
      }, 1000)

      updateTime();
    }
  }, []);

  return <SessionContext.Provider value={{ user, logout, login, refreshSession }}>{children}</SessionContext.Provider>;
};

export default LoginContextProvider;

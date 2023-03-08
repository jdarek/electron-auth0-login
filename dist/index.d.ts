import { Config } from './types';
export declare function auth0Login(config: Config): {
    getToken: () => Promise<string>;
    getIDToken: () => Promise<string>;
    hasRefreshToken: () => Promise<boolean>;
    isLoggedIn: () => Promise<boolean>;
    login: () => Promise<string>;
    logout: () => Promise<void>;
};

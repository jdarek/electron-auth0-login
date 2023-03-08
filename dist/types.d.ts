import keytar from 'keytar';
export declare type Keytar = typeof keytar;
export declare type Operation<I, O> = (ctx: Context, input: I) => O;
export declare type Adapter = (cfg: Config) => Partial<Context>;
export declare type Context = {
    authAPI: {
        exchangeRefreshToken(refreshToken: string): Promise<TokenResponse>;
        exchangeAuthCode(authCode: string, pair: PKCEPair): Promise<TokenResponse>;
    };
    authWindow: {
        login(pair: PKCEPair): Promise<string>;
        logout(): Promise<void>;
    };
    cryptography: {
        getPKCEChallengePair(): PKCEPair;
    };
    logger: {
        debug(...s: string[]): void;
        warn(...s: string[]): void;
    };
    tokens: Store<TokenResponse> & {
        expiresIn(): number;
    };
    refreshTokens?: Store<string>;
};
export declare type PKCEPair = {
    verifier: string;
    challenge: string;
};
export declare type TokenResponse = {
    access_token: string;
    id_token: string;
    expires_in: number;
    scope: string;
    refresh_token?: string;
    token_type: string;
};
export declare type Config = {
    debug?: boolean;
    auth0: {
        audience: string;
        clientId: string;
        domain: string;
        scopes: string;
        redirectUri: string;
    };
    login?: {
        windowConfig?: object;
        authorizeParams?: object;
    };
    logout?: {
        windowConfig?: object;
    };
    refreshTokens?: {
        keytar: typeof keytar;
        appName: string;
    } | {
        store: Store<string>;
    };
};
export declare type Store<T> = {
    delete(): Promise<void>;
    get(): Promise<T | null>;
    set(t: T): Promise<void>;
};

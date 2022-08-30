# API

## getToken

`getToken(): Promise<string>`

Returns an authorization token you can use against an Auth0-secured API.

If one not available, tries using refresh tokens, then launches the login screen.

## getIdToken

`getIdToken(): Promise<string>`

Returns an ID token you can use.

If one not available, tries using refresh tokens, then launches the login screen.

## hasRefreshToken

`hasRefreshToken(): Promise<string>`

Returns whether a refresh token exists (the user has logged in before). It may or may not be valid.


## isLoggedIn

`isLoggedIn(): boolean`

Checks whether we have tokens already. May be useful for the UI.

## login

`login(): Promise<string>`

Manually begins a login flow.

Note that if you just want a token, you can use `getToken` instead.

## logout

`logout(): Promise<void>`

Logs the user out, which deletes local and refresh tokens. Also clears any Auth0 cookies.

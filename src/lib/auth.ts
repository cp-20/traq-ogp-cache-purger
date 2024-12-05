import { env } from "$env/dynamic/public";
import { sha256 } from "js-sha256";

const baseUrl = "https://q.trap.jp/api/v3/oauth2";

const codeVerifierKey = (state: string) => `traq-auth-code-verifier-${state}`;
export const tokenKey = "traq-auth-token";

const clientId = env.PUBLIC_TRAQ_AUTH_CLIENT_ID;
if (!clientId) throw new Error("TRAQ_AUTH_CLIENT_ID is not set");

const randomString = (len: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  let array = crypto.getRandomValues(new Uint32Array(len));
  array = array.map((val) => characters.charCodeAt(val % charactersLength));
  return String.fromCharCode(...array);
};

const getCodeChallenge = (codeVerifier: string) => {
  const sha256Result = sha256(codeVerifier);
  const bytes = new Uint8Array(sha256Result.length / 2);
  for (let i = 0; i < sha256Result.length; i += 2) {
    bytes[i / 2] = Number.parseInt(sha256Result.substring(i, i + 2), 16);
  }
  const base64 = btoa(String.fromCharCode(...bytes));
  const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(
    /=/g,
    "",
  );
  return base64url;
};

const getTraqAuthCodeRequestUrl = () => {
  const url = `${baseUrl}/authorize`;

  const state = randomString(10);
  const codeVerifier = randomString(43);
  const codeChallenge = getCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const redirectUri = `${url}?${params.toString()}`;

  return { redirectUri, codeVerifier, state };
};

const sendTraqAuthTokenRequest = (
  code: string,
  codeVerifier: string,
) => {
  const url = `${baseUrl}/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
  });

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "omit",
    body: body.toString(),
  });
};

export const requestAuth = () => {
  const { redirectUri, codeVerifier, state } = getTraqAuthCodeRequestUrl();
  localStorage.setItem(codeVerifierKey(state), codeVerifier);
  return redirectUri;
};

export const handleAuthCallback = async () => {
  const url = new URL(location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    throw new Error("Invalid callback");
  }

  const codeVerifier = localStorage.getItem(codeVerifierKey(state));
  if (!codeVerifier) {
    throw new Error("Invalid callback");
  }

  const tokenRes = await sendTraqAuthTokenRequest(code, codeVerifier);
  const tokenData = await tokenRes.json();

  const token = tokenData.access_token;
  localStorage.removeItem(codeVerifierKey(state));
  if (!token) {
    throw new Error("Invalid callback");
  }

  localStorage.setItem(tokenKey, token);
  location.href = "/";
};

export const getAuthToken = () => {
  return localStorage.getItem(tokenKey);
};

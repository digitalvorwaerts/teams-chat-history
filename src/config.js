export const msalConfig = {
  auth: {
    clientId: "5f186bf7-ee97-451e-9725-174a6afcf99a",
    authority: "https://login.microsoftonline.com/4dfcfa03-b79c-48f1-8205-7a5c0782545c",
    redirectUri: "http://localhost:5173"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["User.Read", "Chat.Read"]
};

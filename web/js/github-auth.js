import { REDIRECT_URI, CLIENT_ID } from "./config.js";

export function initiateGitHubLogin() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
    window.location.href = githubAuthUrl;
}

export async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);

    if (code) {
        const url = `https://api.cookify.projects.bbdgrad.com/api/auth/login?code=${code}`;
        const tokenRes = await fetch(url);
        console.log(tokenRes);
        const token = (await tokenRes.json()).accessToken;

        if (token) {
            sessionStorage.setItem('accessToken', token);
            window.location.href = '/';
        }
    }
}
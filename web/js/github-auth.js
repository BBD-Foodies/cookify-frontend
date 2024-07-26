import { REDIRECT_URI, CLIENT_ID } from "./config.js";

export function initiateGitHubLogin() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
    window.location.href = githubAuthUrl;
}

export async function handleCallback(code) {
    alert(code);
    if (code) {
        const url = `https://api.cookify.projects.bbdgrad.com/api/auth/login?code=${code}`;
        let tokenRes;
        try {
            tokenRes = await fetch(url);

        } catch (error) {
            console.error(error);
        }
        const tokenBody = (await tokenRes.json());
        console.log(tokenBody);
        const token = tokenBody.accessToken;

        if (token) {
            sessionStorage.setItem('accessToken', token);
            alert(token);
            window.location.href = '/';
        }
    }
}
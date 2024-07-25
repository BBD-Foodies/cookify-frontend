import { LOGIN_URL } from './config.js';

function validateSession() {
    sessionStorage.setItem('accessToken', accessToken);
    const storedAccessToken = sessionStorage.getItem('accessToken');
}

const clearSessionAndLogout = () => {
    sessionStorage.clear();
    window.location.href = LOGIN_URL;
}

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function validateToken(token) {
    try {
        if (!token) {
            clearSessionAndLogout();
        } else {
            const decodedToken = parseJwt(token);
            const expirationTime = decodedToken.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime >= expirationTime) {
                clearSessionAndLogout();
            }
        }
    } catch {
        clearSessionAndLogout();
    }
}

const getUsername = () => {
    return parseJwt(sessionStorage.getItem('idToken')).given_name ?? 'Doe';
}

export { validateSession, clearSessionAndLogout, parseJwt, validateToken, getUsername }
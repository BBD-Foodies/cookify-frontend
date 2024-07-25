const CLIENT_ID = 'Ov23li6A1ROcDeq1lkxJ';
const REDIRECT_URI = 'http://localhost:5000/api/auth/callback';

export function initiateGitHubLogin() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
    window.location.href = githubAuthUrl;
}

export function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        fetch('/api/auth/login', {
            method: '`GET`',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
        .then(response => response.json())
        .then(console.log(JSON.stringify(repsonse)))
        .then(data => {
            if (data.accessToken) {
                sessionStorage.setItem('accessToken', data.accessToken);
                window.location.href = '/';
                console.log("worked")
            }
        })
        .catch(error => console.error('Error:', error));
        console.log("done");
    }
}
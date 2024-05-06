document.getElementById('loginbtn').addEventListener('click', async function(event) {
    event.preventDefault();
    console.log("Début login...");
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://192.168.65.121:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const results = await response.json();
            console.log('Login successful:', results);
            document.cookie = `reco=${username}; path=/`;
            window.location.href = 'index.html'; // Redirect user to successful login page
        } else if (response.status === 401 || response.status === 409) {
            const errorText = await response.json();
            console.error('Login failed:', errorText.error);
        } else {
            console.error('Login failed: An error occurred');
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
    }
});

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
            console.log('Connexion réussie:', results);
            document.cookie = `reco=${username}; path=/`;
            window.location.href = 'index.html';
        } 
        else if (response.status === 401 || response.status === 409) {
            const errorText = await response.json();
            console.error('Echec de la connexion:', errorText.error);
            document.querySelector('.error-message').textContent = errorText.error;
        } 
        else {
            console.error('Echec de la connexion: Une erreur est survenue');
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la connexion:', error);
    }
});

document.getElementById('loginbtn').addEventListener('click', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://192.168.65.121:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        const results = await response.text(); // Assuming the server sends plain text
        console.log('Login successful:', results);
        window.location.href = 'index.html'; // Redirigez l'utilisateur vers la page de connexion réussie
    } else if (response.status === 409) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        window.location.href = 'index.html';
        // Afficher un message d'erreur à l'utilisateur indiquant que le nom d'utilisateur existe déjà
    } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        window.location.href = 'index.html';
        // Afficher un message d'erreur générique à l'utilisateur
    }
});

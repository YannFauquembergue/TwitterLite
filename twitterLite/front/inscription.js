document.getElementById('registerbtn').addEventListener('click', async function() {
    let userInput = document.getElementById('username').value;
    let passwordInput = document.getElementById('password').value;
    
    // Vérifiez si les champs sont vides
    if (!userInput || !passwordInput) {
        displayResult('Erreur, veuillez remplir les deux champs', 'red');
        return;
    }

    const data = {
        username: userInput,
        password: passwordInput
    };

    // Enregistrer l'utilisateur
    try {
        const responseData = await register(data);
        displayResult(responseData, 'green');
    } catch (error) {
        displayResult('Erreur lors de l\'inscription', 'red');
        console.error('Erreur lors de l\'inscription:', error);
    }
});

async function register(data) {
    try {
        const url = 'http://192.168.65.121:3000/register';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la requête HTTP: ' + response.statusText);
        }

        return await response.text(); // Obtenir le contenu de la réponse

    } catch (error) {
        throw new Error('Erreur lors de l\'envoi de la requête: ' + error.message);
    }
}

function displayResult(message, color) {
    let resultDiv = document.getElementById('result');
    resultDiv.innerText = message;
    resultDiv.style.color = color;
}

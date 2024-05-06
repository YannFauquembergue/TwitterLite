document.getElementById('logoutBtn').addEventListener('click', function() {
    // Supprimer le cookie de l'identifiant de l'utilisateur
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Rediriger l'utilisateur vers la page de connexion
    window.location.href = 'connexion.html';
});
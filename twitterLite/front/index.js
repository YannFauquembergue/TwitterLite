document.addEventListener('DOMContentLoaded', function() {
    const submitTweetBtn = document.querySelector('#submitTweet');
    const logoutBtn = document.querySelector('#logoutBtn');
  
    submitTweetBtn.addEventListener('click', async function(event) {
      event.preventDefault();
  
      const tweetContent = document.getElementById('tweet').value;
      const username = getCookie('username'); // Supposons que vous ayez une fonction getCookie pour récupérer le nom d'utilisateur
  
      try {
        const response = await fetch('http://192.168.65.121:3000/postTweet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: tweetContent, username: username })
        });
  
        if (response.ok) {
          console.log('Tweet publié avec succès');
          // Actualiser la liste des tweets après avoir ajouté un nouveau tweet
          fetchTweets();
        } else {
          console.error('Erreur lors de la publication du tweet');
        }
      } catch (error) {
        console.error('Une erreur est survenue lors de la publication du tweet:', error);
      }
    });
  
    // Gestionnaire d'événements pour le bouton de déconnexion
    logoutBtn.addEventListener('click', async function(event) {
      try {
        const response = await fetch('http://192.168.65.121:3000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          console.log('Déconnexion réussie');
          document.cookie = 'local_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = 'connexion.html';
        } else {
          console.error('Erreur lors de la déconnexion');
        }
      } catch (error) {
        console.error('Une erreur est survenue lors de la déconnexion:', error);
      }
    });

    // Fonction pour afficher les tweets sur la page
    function displayTweets(tweets) {
        const tweetsContainer = document.querySelector('#tweetsContainer');
        tweetsContainer.innerHTML = ''; // Effacer le contenu précédent des tweets
    
        tweets.forEach(tweet => {
          const tweetElement = document.createElement('div');
          tweetElement.textContent = `${tweet.username} dit : ${tweet.content}`;
          tweetsContainer.appendChild(tweetElement);
        });
    }
  
    // Fonction pour récupérer et afficher les tweets
    async function fetchTweets() {
      try {
        const response = await fetch('http://192.168.65.121:3000/tweets');
  
        if (response.ok) {
          const tweets = await response.json();
          displayTweets(tweets);
        } else {
          console.error('Erreur lors de la récupération des tweets');
        }
      } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des tweets:', error);
      }
    }
  
    fetchTweets();
    setInterval(fetchTweets, 1000);
  });
  
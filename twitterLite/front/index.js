document.getElementById('logoutBtn').addEventListener('click', function() {
    // Supprimer le cookie de l'identifiant de l'utilisateur
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Rediriger l'utilisateur vers la page de connexion
    window.location.href = 'connexion.html';
});

document.addEventListener('DOMContentLoaded', function() {
    const submitTweetBtn = document.querySelector('#submitTweet');
  
    submitTweetBtn.addEventListener('click', async function(event) {
      event.preventDefault();
  
      const tweetContent = document.getElementById('tweet').value;
      const username = getCookie('username');
  
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
          fetchTweets();
        } else {
          console.error('Erreur lors de la publication du tweet');
        }
      } catch (error) {
        console.error('Une erreur est survenue lors de la publication du tweet:', error);
      }
    });

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
  
    // Appel initial pour récupérer et afficher les tweets
    fetchTweets();
  });
  
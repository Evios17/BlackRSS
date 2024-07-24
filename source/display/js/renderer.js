const parseString = require('xml2js').parseString;
const axios = require('axios');

/*document.querySelector('.refresh-btn').addEventListener('click', async () => {
  const rssUrl = document.querySelector('.rss-input').value;

  if (!rssUrl) {
    alert('Please enter a URL');
    return;
  }

  try {
    const response = await axios.get(rssUrl);
    const xmlData = response.data;

    parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error parsing XML', err);
        alert('Failed to parse RSS feed');
        return;
      }
      
      console.log(result.rss.channel[0]);
      
      const items = result.rss.channel[0].item;
      const feedList = document.querySelector('.feed-list');
      feedList.innerHTML = '';

      //items.forEach(item => {
        const listItem = document.createElement('article');
        listItem.textContent = item.title[0];
        feedList.appendChild(listItem);
      });//
      
      // Extract favicon and channel title
      const faviconUrl = new URL('/favicon.ico', rssUrl).href;
      const title = result.rss.channel[0].title;

      // Function to extract the first image from the content:encoded
      const extractFirstImage = (content) => {
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = content.match(imgRegex);
        return match ? match[1] : 'media/no-image.png';
      };
      
      // Function to calculate the number of days ago
      function formatDateRelative(dateStr) {
        // Convertir la chaîne de date en un objet Date
        const targetDate = new Date(dateStr);

        // Obtenir la date actuelle
        const now = new Date();

        // Calculer la différence de temps en millisecondes
        const delta = now - targetDate;

        // Obtenir les différences en secondes, minutes, heures, et jours
        const seconds = Math.floor(delta / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Déterminer la chaîne de retour
        if (seconds < 60) {
          return `${seconds} s`;
        } else if (minutes < 60) {
          return `${minutes} m`;
        } else if (hours < 24) {
          return `${hours} h`;
        } else {
          return `${days} d`;
        }
      }

      let counter = 0;
      
      items.forEach(item => {
        let image;

        if (item.thumb && item.thumb[0]) {
          image = item.thumb[0];
        } else if (item["content:encoded"] && item["content:encoded"][0]) {
          image = extractFirstImage(item["content:encoded"][0]);
        } else {
          image = "media/no-image.png"
        }

        feedList.innerHTML += `
          <article class="feed-item">
              <div class="feed-item-content">
                  <div class="feed-item-details">
                      <div class="feed-item-top">
                          <div class="feed-item-logo" title="${title}">
                              <img src="${faviconUrl}" alt="Channel Logo">
                              <p class="feed-item-channel">${title}</p>
                          </div>
                          <p class="feed-item-date">${formatDateRelative(item.pubDate[0])}</p>
                      </div>
                      <h2 title="${item.title[0]}">${item.title[0]}</h2>
                      <p>${item.description[0]}</p>
                  </div>
              </div>
              <div class="feed-item-img">
                  <img src="${image}" alt="Feed Thumbnail" class="feed-item-img-content">
              </div>
          </article>
        `;

        counter++;
      });

      document.querySelector('.section-footer-counter').innerHTML = "We have " + counter + " elements!";
    });
  } catch (error) {
    console.error('Error fetching RSS feed', error);
    alert('Failed to fetch RSS feed');
  }
});*/

// Fonction pour afficher les abonnements à partir du local storage
const displayStoredSubscriptions = async () => {
  // Récupérer les abonnements stockés
  const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
  console.log('Stored subscriptions:', subscriptions);

  const feedList = document.querySelector('.feed-list');
  feedList.innerHTML = '';

  if (subscriptions.length === 0) {
    feedList.innerHTML = '<p>No subscriptions found.</p>';
    return;
  }

  // Pour chaque URL d'abonnement, récupérer et afficher les données
  for (const rssUrl of subscriptions) {
    try {
      const response = await axios.get(rssUrl);
      const xmlData = response.data;

      parseString(xmlData, (err, result) => {
        if (err) {
          throw new Error('Error parsing XML' + err);
        }

        console.log(result.rss.channel[0]);

        const items = result.rss.channel[0].item;

        // Extract favicon and channel title
        const faviconUrl = new URL('/favicon.ico', rssUrl).href;
        const title = result.rss.channel[0].title;

        // Function to extract the first image from the content:encoded
        const extractFirstImage = (content) => {
          const imgRegex = /<img[^>]+src="([^">]+)"/;
          const match = content.match(imgRegex);
          return match ? match[1] : 'media/no-image.png';
        };

        // Function to calculate the number of days ago
        function formatDateRelative(dateStr) {
          const targetDate = new Date(dateStr);
          const now = new Date();
          const delta = now - targetDate;
          const seconds = Math.floor(delta / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);

          if (seconds < 60) return `${seconds} s`;
          if (minutes < 60) return `${minutes} m`;
          if (hours < 24) return `${hours} h`;
          return `${days} d`;
        }

        let counter = 0;

        items.forEach(item => {
          let image;

          if (item.thumb && item.thumb[0]) {
            image = item.thumb[0];
          } else if (item["content:encoded"] && item["content:encoded"][0]) {
            image = extractFirstImage(item["content:encoded"][0]);
          } else {
            image = "media/no-image.png";
          }

          feedList.innerHTML += `
            <article class="feed-item">
                <div class="feed-item-content">
                    <div class="feed-item-details">
                        <div class="feed-item-top">
                            <div class="feed-item-logo" title="${title}">
                                <img src="${faviconUrl}" alt="Channel Logo">
                                <p class="feed-item-channel">${title}</p>
                            </div>
                            <p class="feed-item-date">${formatDateRelative(item.pubDate[0])}</p>
                        </div>
                        <h2 title="${item.title[0]}">${item.title[0]}</h2>
                        <p>${item.description[0]}</p>
                    </div>
                </div>
                <div class="feed-item-img">
                    <img src="${image}" alt="Feed Thumbnail" class="feed-item-img-content">
                </div>
            </article>
          `;

          counter++;
        });

        document.querySelector('.section-footer-counter').innerHTML = "We have " + counter + " elements!";
      });
    } catch (error) {
      document.querySelector('.console-log').innerHTML += error;
      console.error('Error fetching RSS feed', error);
    }
  }
};

// Ajouter un événement pour le bouton de rafraîchissement
document.querySelector('.refresh-btn').addEventListener('click', () => {
  console.log('Refresh button clicked');
  displayStoredSubscriptions();
});







document.querySelector('.add-btn').addEventListener('click', () => {
  const rssUrl = document.querySelector('.rss-input-sub').value;
  console.log('Add button clicked');
  console.log('RSS URL:', rssUrl);

  if (!rssUrl) {
    alert('Please enter a URL');
    console.log('No URL entered');
    return;
  }

  let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
  console.log('Current subscriptions:', subscriptions);

  if (!subscriptions.includes(rssUrl)) {
    subscriptions.push(rssUrl);
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    console.log('New subscription added:', rssUrl);
    renderSubscriptions();
  } else {
    alert('URL already subscribed');
    console.log('URL already subscribed:', rssUrl);
  }
});

const renderSubscriptions = () => {
  console.log('Rendering subscriptions');

  const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
  const subscriptionList = document.querySelector('.subscription-list');
  subscriptionList.innerHTML = '';

  subscriptions.forEach(url => {
    subscriptionList.innerHTML += `
      <article class="subscription-item">
        <div class="subscription-details">
          <div class="subscription-logo">
            <img src="${new URL('/favicon.ico', url).href}" alt="Channel Logo">
            <p>${url}</p>
          </div>
          <button class="button__type-1-1x1 remove-btn" data-url="${url}"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </article>`;
  });

  console.log('Subscriptions rendered:', subscriptions);

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = e.target.closest('.remove-btn').dataset.url;
      console.log('Remove button clicked for URL:', url);

      let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
      subscriptions = subscriptions.filter(sub => sub !== url);
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      console.log('Subscription removed:', url);
      renderSubscriptions();
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded');
  renderSubscriptions();
});
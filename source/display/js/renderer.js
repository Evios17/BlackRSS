const parseString = require('xml2js').parseString;
const axios = require('axios');

document.querySelector('.load-feed').addEventListener('click', async () => {
  const rssUrl = document.querySelector('.rss-url').value;

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

      /*items.forEach(item => {
        const listItem = document.createElement('article');
        listItem.textContent = item.title[0];
        feedList.appendChild(listItem);
      });*/
      
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
          return `${days} j`;
        }
      }
      
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
          <article class="section-list__article">
            <img src="${image}" alt="" srcset="" class="section-list__article-overlay">
            <div class="section-list__article-content">
              <div class="section-list__article-status"></div>
              <div class="section-list__article-infos">
                  <div class="section-list__article-logo">
                      <img src="${faviconUrl}" alt="" srcset="">
                      <p>${title}</p>
                  </div>
                  <h2>${item.title[0]}</h2>
                  <p>${item.description[0]}</p>
              </div>
              <div class="section-list__article-date">
                  <i class="fa-solid fa-stopwatch"></i>
                  <p>${formatDateRelative(item.pubDate[0])}</p>
              </div>
            </div>
          </article>
        `;
      });
    });
  } catch (error) {
    console.error('Error fetching RSS feed', error);
    alert('Failed to fetch RSS feed');
  }
});

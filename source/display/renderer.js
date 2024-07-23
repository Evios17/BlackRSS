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
        return match ? match[1] : 'media/default-image.jpg';
      };
      
      // Function to calculate the number of days ago
      const daysAgo = (pubDate) => {
        const articleDate = new Date(pubDate);
        const now = new Date();
        const diffTime = now - articleDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      };
      
      items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'feed';

        const div1 = document.createElement('div');
        const img1 = document.createElement('img');
        //img1.src = extractFirstImage(item["content:encoded"][0]); // Assuming you want a static logo for each article
        
        // Check for image in item.thumb, then fallback to content:encoded
        if (item.thumb && item.thumb[0]) {
          img1.src = item.thumb[0];
        } else if (item["content:encoded"] && item["content:encoded"][0]) {
          img1.src = extractFirstImage(item["content:encoded"][0]);
        } else {
          
        }
        
        div1.appendChild(img1);

        const feedContent = document.createElement('div');
        feedContent.className = 'feed-content';

        const div2 = document.createElement('div');

        const chanelLogo = document.createElement('div');
        chanelLogo.className = 'chanel-logo';
        const img2 = document.createElement('img');
        img2.src = faviconUrl; // Assuming a static logo for channel as well
        const spanChanel = document.createElement('span');
        spanChanel.textContent = title; // Assuming static channel name
        chanelLogo.appendChild(img2);
        chanelLogo.appendChild(spanChanel);

        const div3 = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.textContent = item.title[0];
        const p = document.createElement('p');
        p.textContent = item.description[0]; // Assuming item has a description

        div3.appendChild(h2);
        div3.appendChild(p);

        div2.appendChild(chanelLogo);
        div2.appendChild(div3);

        const div4 = document.createElement('div');
        const spanDays = document.createElement('span');
        //spanDays.textContent = '23 Jours'; // Static value, adjust if needed
        spanDays.innerHTML = `${daysAgo(item.pubDate[0])} J`;
        
        div4.appendChild(spanDays);

        feedContent.appendChild(div2);
        feedContent.appendChild(div4);

        article.appendChild(div1);
        article.appendChild(feedContent);

        feedList.appendChild(article);
      });
    });
  } catch (error) {
    console.error('Error fetching RSS feed', error);
    alert('Failed to fetch RSS feed');
  }
});

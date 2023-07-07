const express = require("express")
const router = express.Router()
require('dotenv').config();

const cheerio = require('cheerio');
const axios = require('axios');
// const puppeteer = require('puppeteer')
const fs = require('fs')

const cors = require("cors");

router.use(cors());
router.options('*', cors())

// router.get('/scrape-save', (req, res) => {
router.get('/scrape-save', async (req, res) => {

    // res.send('All Scraps Overview working')
    // res.json({message:'All Scraps Overview working 2'});

    try {
      // console.log('hello from the api 2')
      // res.json({message:'message', message2:'message 2'});
      const scrapedData = await scrapeData();
      // await saveToDatabase(scrapedData);
      // res.send(scrapedData)
      res.json(scrapedData)
    } catch (error) {
      console.log('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred while scraping the data.' });
    }

})

// async function scrapeData() {
//   const baseUrl = 'https://martinique.123-click.com';
//   const initialUrl = `${baseUrl}/store/frais`;
//   const scrapedData = []


//   scrapedData.push({dairy1:'dairy1', dairy2:'dairy2'})
//   console.log('Hello from the scrapeData')
//   return scrapedData;
// }


async function scrapeData() {
  const baseUrl = 'https://martinique.123-click.com';
  const initialUrl = `${baseUrl}/store/frais`;
  const scrapedData = []


// Function to fetch additional pages
async function fetchAdditionalPages(url) {
  try {
    const response = await axios.get(url, {
      // headers: {
      //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      // },
      });
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      const dairy0 = []
      $('div.product-list-affichage-mobile', response.data).each(function() {
              const nom = $(this).find('a').attr('title')
              const prix = $(this).find('p.price-full').text()

              const url = $(this).find('a').attr('href')
              const prixspecial = $(this).find('p.price-special').text()
              const img = $(this).find('img.owl-lazy').attr('data-src')
              const quantite = $(this).find('div.desc-small-text').text()
              // const quantite2 = $(this).find('div.poids-suffixe-holder').text().replaceAll('\n', '').replaceAll('\t', '').replaceAll(' ', '')
              const quantite2 = $(this).find('div.poids-suffixe-holder').text().replace(/\n|\t| /g, '');
              // const prixunite = $(this).find('div.unity-price').text().replaceAll('\n', '').replaceAll('\t', '').replaceAll(' ', '')
              const prixunite = $(this).find('div.unity-price').text().replace(/\n|\t| /g, '');
              const nutriscore = $(this).find('div.picto-item').find('img').attr('src')
              const web = 'https://martinique.123-click.com'
              const nutrifull = web.concat(nutriscore)

              dairy0.push({
                nom,
                prix,
                url,
                prixspecial,
                img,
                quantite,
                quantite2,
                prixunite,
                nutriscore,
                nutrifull
              })

      })
      let uniqueDairy0 = [...new Set(dairy0)]
      const productNames = uniqueDairy0

    console.log('from ProductNames fetch: ', productNames)
    // res.send(productNames)

    // Adding scraped data to the final array
    addDataToFinalArray(productNames)

     // Checking if there are more items to load
     const nextPageUrl = getNextPageUrl($);
     if (nextPageUrl) {
       // Fetching additional pages recursively
       await fetchAdditionalPages(nextPageUrl);
     }
    }
    } catch (error) {
      throw error;
    }
}

// Function to add scraped data to the final array
// function addDataToFinalArray(names, prices) {
  function addDataToFinalArray(dairy) {
  for (let i = 0; i < dairy.length; i++) {
    scrapedData.push({
      dairy: dairy[i],
      // price: prices[i]
    });
    // Add the scraped data to the database
    // await saveToDatabase(dairy);
  }
  // console.log(names.length)
}

// Function to extract the URL of the next page
function getNextPageUrl($) {
  const nextPageLink = $('.pagination')
    .find('.next_page')
    .attr('href');

  if (nextPageLink) {
    return `${baseUrl}${nextPageLink}`;
  }

  return null;
}

// Start scraping by fetching the initial page
await fetchAdditionalPages(initialUrl);

console.log('from the first scrap: ', scrapedData)
return scrapedData;
}



// async function saveToDatabase(data) {
//   // Logic to save the data to the database using Prisma or any other ORM
//   try {
//     console.log('from api saveToDB')
//     for (const item of data) {
//       await db.dairy.create({
//         data: {
//           nom: item.dairy.nom,
//           prix: item.dairy.prix,
//           url: item.dairy.url,
//           prixspecial: item.dairy.prixspecial,
//           img: item.dairy.img,
//           quantite: item.dairy.quantite,
//           quantite2: item.dairy.quantite2,
//           prixunite: item.dairy.prixunite,
//           nutriscore: item.dairy.nutriscore,
//           nutrifull: item.dairy.nutrifull,
//         },

//     });
//   }
//   } catch (error) {
//     console.log('An error occurred while adding data to the database:', error);
//   }
// }




module.exports = router

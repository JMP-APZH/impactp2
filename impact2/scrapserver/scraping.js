const express = require("express")
const router = express.Router()
require('dotenv').config();

const cheerio = require('cheerio');
const axios = require('axios');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const port = process.env.PORT || 5013;

const cors = require("cors");

const app = express()

router.use(cors());
router.options('*', cors())

app.use(cors());
app.options('*', cors())

app.get('/fetchdairies', async (req, res) => {
  try {
    console.log('hello from fetchdairies')
    const dairies2 = fetchDairies()
    console.log(dairies2)
    res.json(dairies2)
  } catch (error) {
    console.log('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while scraping the data.' });
  }
})

// app.get('/fetchdairies2', async (req, res) => {
//   try {
//     const dairies = await prisma.dairy.findMany();
//     res.json(dairies)
//     // console.log('Dairy records:', dairies);
//   } catch (error) {
//     console.error('Error fetching dairies:', error);
//   }
// })

app.get('/fetchdairies2', async (req, res) => {
  // function fetchDairies(res) {
      try {
        const sendairies = await fetchDairies()
        // const dairies = prisma.dairy.findMany();
        res.json(sendairies)
        console.log('all dairies from DB:', sendairies)
        // console.log('Dairy records:', dairies);
      } catch (error) {
        console.error('Error fetching dairies:', error);
      }
    // }
})

// async function fetchDairies(res) {
//   try {
//     const dairies = await prisma.dairy.findMany();
//     res.send(dairies)
//     // console.log('Dairy records:', dairies);
//   } catch (error) {
//     console.error('Error fetching dairies:', error);
//   }
// }

app.get('/scrapandsave2', async (req, res) => {
  try {
    const scrapedData = await scrapeData();
    console.log('From the beginning:', scrapedData)
    await saveToDatabase(scrapedData);
    res.json(scrapedData)
    // await fetchDairies()
  } catch (error) {
    console.log('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while scraping the data.' });
  }
})

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

              dairy0.push({
                nom,
                prix,
                url,
                prixspecial,
                img,
                quantite,
                quantite2,
                prixunite,
              })

      })
      let uniqueDairy0 = [...new Set(dairy0)]
      const productNames = uniqueDairy0

    // console.log('from ProductNames fetch: ', productNames)
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
  async function addDataToFinalArray(dairy) {
  for (let i = 0; i < dairy.length; i++) {
    scrapedData.push({
      dairy: dairy[i],
      // price: prices[i]
    });
    // Add the scraped data to the database
    // await createDairy(dairy[i]);
  }
  // await createD(scrapedData)

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

// console.log('from the first scrap: ', scrapedData)
return scrapedData;
}


// ...

async function saveToDatabase(data) {
  try {
    for (const item of data) {
      await prisma.dairy.create({
        data: {
          nom: item.dairy.nom,
          prix: item.dairy.prix,
          url: item.dairy.url,
          prixspecial: item.dairy.prixspecial,
          img: item.dairy.img,
          quantite: item.dairy.quantite,
          quantite2: item.dairy.quantite2,
          prixunite: item.dairy.prixunite,
        },
      });
    }
  } catch (error) {
    console.log('An error occurred while adding data to the database:', error);
  }
}

// ...


async function fetchDairies() {
  try {
    const dairies = await prisma.dairy.findMany();
    // res.send(dairies)
    console.log('Dairy records:', dairies);
    return dairies
  } catch (error) {
    console.error('Error fetching dairies:', error);
  }
}

fetchDairies()

// Call the fetchDairies function to retrieve the dairy records
// fetchDairies();

// console.log('Data saved on the DB:', DatainDB)


app.listen(port, () => {
  console.log(`Mainserver listening on port ${port}`);
});

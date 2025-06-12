const express = require('express');
const axios = require('axios');
const { generateEmail, validateEmail, getDomainFromGoogle } = require('./utils');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { company } = req.query;
    const serpapiKey = process.env.SERPAPI_KEY;
  
    try {
  
      const domain = await getDomainFromGoogle(company);
  
      const serpRes = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google',
          q: `site:linkedin.com/in/ "${company}"`,
          api_key: serpapiKey
        }
      });
  
      const rawResults = serpRes.data.organic_results || [];
  
      const results = await Promise.all(rawResults.map(async (result) => {
        const name = result.title.split(' - ')[0];
        const position = result.snippet?.split(' · ')[0] || '';
        const linkedin_url = result.link;
      
        const guessedEmail = generateEmail(name, domain);
      
        const email = await validateEmail(guessedEmail);

        return {
          name,
          position,
          linkedin_url,
          email: email || null
        };
      }));
      
  
      const filtered = results.filter(r => r !== null);
      res.json(filtered);
    } catch (err) {
      console.error('Error in /search route:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
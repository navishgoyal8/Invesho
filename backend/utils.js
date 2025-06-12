const axios = require('axios');

function generateEmail(name, domain) {
  const nameParts = name.toLowerCase().split(' ');
  const first = nameParts[0];
  const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  return `${first}.${last}@${domain}`;
}

async function validateEmail(email) {
  try {
    const res = await axios.get('http://apilayer.net/api/check', {
      params: {
        access_key: process.env.MAILBOXLAYER_API_KEY,
        email: email,
        smtp: 1
      }
    });

    return res.data.smtp_check ? email : '';
  } catch (err) {
    console.error(`Validation failed for ${email}:`, err.message);
    return '';
  }
}

async function getDomainFromGoogle(companyName) {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google',
        q: `${companyName} official website`,
        api_key: process.env.SERPAPI_KEY
      }
    });

    const siteUrl = response.data.organic_results?.[0]?.link || '';
    if (!siteUrl) return '';

    const { hostname } = new URL(siteUrl);
    return hostname.replace(/^www\./, '');
  } catch (err) {
    console.error(`Domain lookup failed:`, err.message);
    return '';
  }
}


module.exports = { generateEmail, validateEmail, getDomainFromGoogle };

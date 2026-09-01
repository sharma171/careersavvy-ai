const fs = require('fs');
const path = require('path');
const axios = require('axios');

const SITEMAP_API_URL = 'https://site-mapping-api-v2-980069659423.us-east1.run.app';
const SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap.xml');

async function fetchSitemap() {
  try {
    const response = await axios.post(
      SITEMAP_API_URL,
      { task: 'site_xml' }, // Request body
      {
        headers: {
          'postman': 'internal4scar',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // API should return the XML content
  } catch (error) {
    console.error('❌ Error fetching sitemap:', error);
    return null;
  }
}

async function generateSitemap() {
  const xmlContent = await fetchSitemap();
  
  if (!xmlContent) {
    console.error('❌ Sitemap could not be generated.');
    return;
  }

  fs.writeFileSync(SITEMAP_PATH, xmlContent, 'utf8');
  console.log('✅ Sitemap generated successfully at:', SITEMAP_PATH);
}

generateSitemap();

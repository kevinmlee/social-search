const axios = require('axios');

exports.handler = async (event, context) => {
  const clientIP = event.headers['x-forwarded-for'];
  // const apiKey = 'YOUR_API_KEY'; // Replace 'YOUR_API_KEY' with your actual API key

  try {
    // Make a request to ipapi to get geolocation data based on the IP address
    // const response = await axios.get(`https://ipapi.co/${clientIP}/json/?key=${apiKey}`);
    const response = await axios.get(`https://ipapi.co/${clientIP}/json`);

    // Extract region information from the response data
    // const region = response.data.region;

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    // Handle any errors
    console.error('Error fetching geolocation data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};


/*
// Sample Response
{
  "ip": "134.201.250.155",
  "network": "134.201.250.155/32",
  "version": "IPv4",
  "city": "Los Angeles",
  "region": "California",
  "region_code": "CA",
  "country": "US",
  "country_name": "United States",
  "country_code": "US",
  "country_code_iso3": "USA",
  "country_capital": "Washington",
  "country_tld": ".us",
  "continent_code": "NA",
  "in_eu": false,
  "postal": "90060",
  "latitude": 34.0544,
  "longitude": -118.2441,
  "timezone": "America/Los_Angeles",
  "utc_offset": "-0700",
  "country_calling_code": "+1",
  "currency": "USD",
  "currency_name": "Dollar",
  "languages": "en-US,es-US,haw,fr",
  "country_area": 9629091.0,
  "country_population": 327167434,
  "asn": "AS25876",
  "org": "LADWP-INTERNET"
}
*/
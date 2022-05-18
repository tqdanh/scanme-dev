const localConfigUrl = {
  authenticationServiceUrl: 'http://localhost:8080',
  supplyChainServiceUrl: 'http://localhost:8080',
  organizationServiceUrl: 'http://localhost:8080',
  qrcodeBaseUrl: 'http://localhost:8088', // local network
  reverseGeocodingService: 'https://us1.locationiq.com/v1/reverse.php',
  productServiceUrl: 'http://localhost:8080',
  imageURL: 'http://localhost:8080',
  itemServiceUrl: 'http://localhost:8080',
  providerServiceUrl: 'http://localhost:8080',
  geoCodingService: 'https://api.mapbox.com/geocoding/v5/mapbox.places'
};
const config = localConfigUrl;

export default config;

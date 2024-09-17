
maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
container: 'map', // container's id or the HTML element to render the map
style: "openstreetmap",
center: [77.7085, 29.4727], // starting position [lng, lat]
zoom: 14, // starting zoom
});

// in an async function, or as a 'thenable':
const deconding = async()=>{
const result = await maptilerClient.geocoding.forward("paris");
// console.log(req.body.listing.country);
}

deconding();
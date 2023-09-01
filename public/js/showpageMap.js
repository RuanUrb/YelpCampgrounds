mapboxgl.accessToken = mapToken
const myLocation = campground.geometry.coordinates
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: myLocation,
    zoom: 9
})

map.addControl(new mapboxgl.NavigationControl())


new mapboxgl.Marker().setLngLat(myLocation)
.setPopup(
    new mapboxgl.Popup({offset: 10})
    .setHTML(`<h5>${campground.title}</h5>`)
)
.addTo(map)
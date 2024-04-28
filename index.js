var map = L.map('map').setView([40.482226, -112.00628], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var gameIcons = L.Icon.extend({
    options: {
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
    }
});

var playerIcon = new gameIcons({iconUrl: 'player.png'}), 
zombieIcon = new gameIcons({iconUrl: 'zombie.png'}), 
hospitalIcon = new gameIcons({iconUrl: 'hospital.png'}), 
weaponsIcon = new gameIcons({iconUrl: 'weapons.png'});

var old_pos = L.marker([0,0]).addTo(map);
var player_pos = old_pos.getLatLng()

function get_current_pos(position) {
    player_pos = L.latLng(position.coords.latitude, position.coords.longitude)
    map.removeLayer(old_pos)
    var player = L.marker(player_pos, {icon: playerIcon}).addTo(map);
    old_pos = player;

    // check if nearby objects
    for (var i=0; i < itemMarkers.length; i++) {
        var distance = map.distance(player_pos, itemMarkers[i].getLatLng());
        if (distance < tolerance) {
            if (itemMarkers[i].getIcon() == weaponsIcon) {
                map.removeLayer(itemMarkers[i])
                itemMarkers.splice(i)
                player.bindPopup('I found weapons!').openPopup();
            } else if (itemMarkers[i].getIcon == hospitalIcon) {
                map.removeLayer(itemMarkers[i])
                itemMarkers.splice(i)
                player.bindPopup('Health Restored!').openPopup();
            } else if (itemMarkers[i].getIcon == zombieIcon) {
                map.removeLayer(itemMarkers[i])
                itemMarkers.splice(i)
                player.bindPopup('Ouch!').openPopup()
            }
            
        };
    };
};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(get_current_pos);
};

function onClick(e) {
    document.getElementById('location').innerHTML = map.distance(e.latlng, player_pos);
}

map.on('click', onClick);

var items = [[40.481528, -112.006669, zombieIcon],
[40.481024, -112.006047, zombieIcon],
[40.481469, -112.005897, hospitalIcon],
[40.483115, -112.00635, weaponsIcon],
[40.483725, -112.0055, zombieIcon],
[40.483276, -112.006071, hospitalIcon],
[40.48171, -112.009456, weaponsIcon],
];
var itemMarkers = [];
var tolerance = 10; // in meters

for (var i=0; i < items.length; i++) {
    var latitude = items[i][0];
    var longitude = items[i][1];
    var icon = items[i][2];

    var markerpos = L.latLng(latitude, longitude);
    var marker = L.marker(markerpos, {icon: icon}).addTo(map);
    itemMarkers.push(marker);
};
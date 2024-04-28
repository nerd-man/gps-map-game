var map = L.map('map').setView([40.61030475431602, -111.93936667031163], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var playerIcon = L.icon({
    iconUrl: "player.png",
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
})

let _point_A,
    _point_B,
    marker_A = null,
    marker_B = null,
    _line_a;

var old_pos = L.marker([0,0]).addTo(map)

function get_current_pos(position) {
    map.removeLayer(old_pos)
    var player = L.marker([position.coords.latitude, position.coords.longitude], {icon: playerIcon}).addTo(map)
    player.bindPopup("hello").openPopup() 
    old_pos = player
}

function onClick(e) {
    if (!_point_A) {
        _point_A = e.latlng;
        marker_A = L.marker(e.latlng).addTo(map);
    } else if (!_point_B) {
        _point_B = e.latlng
        marker_B = L.marker(e.latlng).addTo(map);
        _line_a = L.polyline([_point_A, _point_B]).addTo(map);

        dist = map.distance(_point_A, _point_B)
        document.getElementById('length').innerHTML = "Distance is " + convertToFeet(dist);
    } else {
        if (_line_a) {
            map.removeLayer(_line_a)
            _line_a = null
        }

        _point_A = e.latlng
        map.removeLayer(marker_A)
        marker_A = L.marker(e.latlng).addTo(map)

        _point_B = null
        map.removeLayer(marker_B)
        marker_B = null

        document.getElementById('length').innerHTML = "Distance is"
    }
}

function convertToFeet(meters) {
    return meters * 3.28084
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(get_current_pos)
}

map.on('click', onClick);
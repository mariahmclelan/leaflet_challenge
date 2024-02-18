// Define the map
let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 2
});

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define function to create marker style based on earthquake magnitude and depth
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "black",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

// Define function to determine the size of the marker based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 2;
}

// Define function to choose color based on earthquake depth
function markerColor(depth) {
    if (depth > 90) {
        return ' #281c65';
    } else if (depth >70) {
        return '#622097';
    } else if (depth >50) {
        return '#a0178a';
    } else if (depth >30) {
        return '#eb2c5d';
    } else if (depth >10) {
        return '#fc6840';
    } else {
        return '#f8c93c';
    }
}

// Fetch earthquake data from USGS API using D3.js
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url).then(function(data) {
    // Create GeoJSON layer with style and popup
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
            "</p><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
        }
    }).addTo(myMap);
});

//set legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"), 
    depthLevels = [0, 30, 50, 70, 90];

    div.innerHTML += "<h3>Depth (km)</h3>"

    for (var i = 0; i < depthLevels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(depthLevels[i]) + '"></i> ' +
            depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
    }
    return div;
};
// Add Legend to the Map
legend.addTo(myMap);
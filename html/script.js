var mymap = L.map('mapid').setView([51.1043471,17.0189813], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWljaGFsc3puYWpkZXIiLCJhIjoiXy04UjRRYyJ9.p9-mkCAFeXfjZ5vzOhXdPw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);


function highlightDistrict(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetDistrictHighlight(e) {
    election_results.resetStyle(e.target);
}

var selectedDistrictNumber = -1;

function onDistrictClick(e) {
    $('#district_address').text(e.target.feature.properties.address);
    $('#district_number').text("Numer obwodu: " + e.target.feature.properties.number);
    results = e.target.feature.properties.results;
    result_val = results.Razem * 100 / results.Total;
    $('#district_result').text("Wynik Razem " +  result_val.toFixed(2) + " %"); 
    selectedDistrictNumber = e.target.feature.properties.number;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

var razemColor = [135, 15, 87];



function resultsStyle(feature) {
    return {
        fillColor: rgbToHex(razemColor),
        weight: 2,
        opacity: 0.7,
        color: '#57C49F',
        dashArray: '3',
        fillOpacity: feature.properties.results.RazemOpacity
    };
}

function onEachFeatureInResults(feature, layer) {
    if (feature.properties && feature.properties.address) {
        layer.on({
            click: onDistrictClick,
            mouseover: highlightDistrict,
            mouseout: resetDistrictHighlight
        })
    }
}

var election_results

$.getJSON("election_results.json", function(json) {
    election_results = L.geoJSON(json, 
        { 
            onEachFeature : onEachFeatureInResults, 
            style : resultsStyle
        });
    election_results.addTo(mymap);
});

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

var address_points_layer = null;

$(function() {
    $("#show_address_points").click( function() {
        if (selectedDistrictNumber === -1)
        {
            return;
        }

        if (address_points_layer !== null)
        {
            address_points_layer.remove();
            address_points_layer = null;
        } 

        $.getJSON("points.json", function(json) {
            address_points_layer = L.geoJSON(json, { onEachFeature : onEachFeature }).addTo(mymap);
        });                           
    });

    $("#hide_address_points").click( function() {
        if (address_points_layer !== null)
        {
            address_points_layer.remove();
            address_points_layer = null;
        } 
    });                           

});
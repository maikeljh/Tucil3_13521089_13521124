"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var L = require("leaflet");
// Global variables
var manyNodes = 0;
var nodes = [];
var paths = [];
var matrix;
var selectedLayer;
// Create map
var map = L.map("map", { doubleClickZoom: false }).setView([-6.88792, 107.61033], 13);
// Tile Layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// Create new node when double click
map.on("dblclick", function (e) {
    // Increment amount of nodes
    manyNodes++;
    var buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "Delete";
    buttonDelete.addEventListener("click", function () {
        map.removeLayer(selectedLayer);
    });
    var name = document.createElement("p");
    name.innerHTML = manyNodes.toString();
    var content = document.createElement("div");
    content.appendChild(name);
    content.appendChild(buttonDelete);
    // Create new marker
    var marker = L.marker(e.latlng, { draggable: true })
        .bindPopup(content)
        .addTo(map)
        .openPopup();
    // Add dragend listener to marker
    marker.on("dragend", function () {
        // Remove all current paths from map and array
        for (var i = 0; i < paths.length; i++) {
            map.removeLayer(paths[i]);
        }
        paths = [];
        // Recreate all path with updated markers
        for (var i = 0; i < matrix.length; i++) {
            for (var j = i; j < matrix[0].length; j++) {
                // If edge exists
                if (matrix[i][j] != 0) {
                    // Create polyline as path
                    var polyline = L.polyline([nodes[i].getLatLng(), nodes[j].getLatLng()], {
                        color: "blue",
                    }).addTo(map);
                    // Calculate distance
                    var distance = nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) / 1000;
                    // Create popup content with distance
                    var popupContent = "Distance: " + distance.toFixed(4) + " km";
                    var buttonDelete_1 = document.createElement("button");
                    buttonDelete_1.innerHTML = "Delete";
                    buttonDelete_1.addEventListener("click", function () {
                        map.removeLayer(selectedLayer);
                    });
                    var name_1 = document.createElement("p");
                    name_1.innerHTML = popupContent;
                    var content_1 = document.createElement("div");
                    content_1.appendChild(name_1);
                    content_1.appendChild(buttonDelete_1);
                    polyline.bindPopup(content_1);
                    // Push new polyline to array
                    paths.push(polyline);
                }
            }
        }
    });
    // Add new marker to nodes
    nodes.push(marker);
});
// Restart Button
var restartButton = document.getElementById("restart");
// Restart Function
restartButton.addEventListener("click", function () {
    // Reset all markers and polylines
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    // Reset variables
    manyNodes = 0;
    nodes = [];
    paths = [];
    fileInput.value = "";
});
// File Input
var fileInput = document.getElementById("fileInput");
// Add event listener to file input
fileInput.addEventListener("change", function (event) {
    var _a;
    if (event.target instanceof HTMLInputElement) {
        // Get File
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        // If file exists
        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var _a;
                // Parse JSON File
                var data = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                var graphData = JSON.parse(data);
                // Add markers to the map
                graphData.nodes.forEach(function (markerData) {
                    // Create marker
                    var marker = L.marker([markerData.latitude, markerData.longitude], {
                        draggable: true,
                    });
                    var buttonDelete = document.createElement("button");
                    buttonDelete.innerHTML = "Delete";
                    buttonDelete.addEventListener("click", function () {
                        map.removeLayer(selectedLayer);
                    });
                    var name = document.createElement("p");
                    name.innerHTML = markerData.name;
                    var content = document.createElement("div");
                    content.appendChild(name);
                    content.appendChild(buttonDelete);
                    marker.bindPopup(content).addTo(map);
                    manyNodes++;
                    // Push new marker to nodes
                    nodes.push(marker);
                    // Add dragend listener to marker
                    marker.on("dragend", function () {
                        // Remove all current paths from map and array
                        for (var i = 0; i < paths.length; i++) {
                            map.removeLayer(paths[i]);
                        }
                        paths = [];
                        // Recreate all path with updated markers
                        for (var i = 0; i < matrix.length; i++) {
                            for (var j = i; j < matrix[0].length; j++) {
                                // If edge exists
                                if (matrix[i][j] != 0) {
                                    // Create polyline as path
                                    var polyline = L.polyline([nodes[i].getLatLng(), nodes[j].getLatLng()], {
                                        color: "blue",
                                    }).addTo(map);
                                    // Calculate distance
                                    var distance = nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) /
                                        1000;
                                    // Create popup content with distance
                                    var popupContent = "Distance: " + distance.toFixed(4) + " km";
                                    var buttonDelete_2 = document.createElement("button");
                                    buttonDelete_2.innerHTML = "Delete";
                                    buttonDelete_2.addEventListener("click", function () {
                                        map.removeLayer(selectedLayer);
                                    });
                                    var name_2 = document.createElement("p");
                                    name_2.innerHTML = popupContent;
                                    var content_2 = document.createElement("div");
                                    content_2.appendChild(name_2);
                                    content_2.appendChild(buttonDelete_2);
                                    polyline.bindPopup(content_2);
                                    // Push new polyline to array
                                    paths.push(polyline);
                                }
                            }
                        }
                    });
                });
                // Add paths to the map
                for (var i = 0; i < graphData.matrix.length; i++) {
                    for (var j = i; j < graphData.matrix[0].length; j++) {
                        // If edge exists
                        if (graphData.matrix[i][j] != 0) {
                            // Create polyline as path
                            var polyline = L.polyline([nodes[i].getLatLng(), nodes[j].getLatLng()], {
                                color: "blue",
                            }).addTo(map);
                            // Calculate distance
                            var distance = nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) / 1000;
                            // Create popup content with distance
                            var popupContent = "Distance: " + distance.toFixed(4) + " km";
                            var buttonDelete = document.createElement("button");
                            buttonDelete.innerHTML = "Delete";
                            buttonDelete.addEventListener("click", function () {
                                map.removeLayer(selectedLayer);
                            });
                            var name_3 = document.createElement("p");
                            name_3.innerHTML = popupContent;
                            var content = document.createElement("div");
                            content.appendChild(name_3);
                            content.appendChild(buttonDelete);
                            polyline.bindPopup(content);
                            // Push new polyline to array
                            paths.push(polyline);
                        }
                    }
                }
                // Set matrix from file
                matrix = graphData.matrix;
                // To improve the appearance of map
                var myGroup = L.featureGroup(nodes);
                // Set padding with 30
                var options = {
                    padding: L.point([30, 30]),
                };
                // Improve apperance of map
                map.fitBounds(myGroup.getBounds(), options);
            };
            // Finish read file
            reader.readAsText(file);
        }
    }
});
// Navigation behaviour
window.addEventListener("hashchange", function () {
    window.scrollTo(window.scrollX, window.scrollY - 300);
});
map.on("popupopen", function (e) {
    //@ts-ignore
    selectedLayer = e.popup._source;
});

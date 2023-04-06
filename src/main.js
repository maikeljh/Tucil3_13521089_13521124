// Global variables
var manyNodes = 0;
var nodes = [];
var paths = [];
var matrix;
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
    // Create new marker
    var marker = L.marker(e.latlng, { draggable: true })
        .bindPopup(manyNodes.toString())
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
            var _loop_1 = function (j) {
                // If edge exists
                if (matrix[i][j] != 0) {
                    // Create polyline as path
                    var polyline_1 = L.polyline([nodes[i].getLatLng(), nodes[j].getLatLng()], {
                        color: "blue",
                    }).addTo(map);
                    // Calculate distance
                    var distance = nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) / 1000;
                    // Create popup content with distance
                    var popupContent = "Distance: " + distance.toFixed(4) + " km";
                    polyline_1.bindPopup(popupContent);
                    // Add mouseover and mouseout listener to polyline
                    polyline_1.on("mouseover", function () {
                        polyline_1.openPopup();
                    });
                    polyline_1.on("mouseout", function () {
                        polyline_1.closePopup();
                    });
                    // Push new polyline to array
                    paths.push(polyline_1);
                }
            };
            for (var j = 0; j < matrix[0].length; j++) {
                _loop_1(j);
            }
        }
    });
    // Add new marker to nodes
    nodes.push(marker);
    // Add mouseover and mouseout listener to marker
    marker.on("mouseover", function () {
        marker.openPopup();
    });
    marker.on("mouseout", function () {
        marker.closePopup();
    });
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
                    marker.bindPopup(markerData.name).addTo(map);
                    // Push new marker to nodes
                    nodes.push(marker);
                    // Add mouseover and mouseout listener to marker
                    marker.on("mouseover", function () {
                        marker.openPopup();
                    });
                    marker.on("mouseout", function () {
                        marker.closePopup();
                    });
                    // Add dragend listener to marker
                    marker.on("dragend", function () {
                        // Remove all current paths from map and array
                        for (var i = 0; i < paths.length; i++) {
                            map.removeLayer(paths[i]);
                        }
                        paths = [];
                        // Recreate all path with updated markers
                        for (var i = 0; i < matrix.length; i++) {
                            var _loop_3 = function (j) {
                                // If edge exists
                                if (matrix[i][j] != 0) {
                                    // Create polyline as path
                                    var polyline_2 = L.polyline([nodes[i].getLatLng(), nodes[j].getLatLng()], {
                                        color: "blue",
                                    }).addTo(map);
                                    // Calculate distance
                                    var distance = nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) /
                                        1000;
                                    // Create popup content with distance
                                    var popupContent = "Distance: " + distance.toFixed(4) + " km";
                                    polyline_2.bindPopup(popupContent);
                                    // Add mouseover and mouseout listener to polyline
                                    polyline_2.on("mouseover", function () {
                                        polyline_2.openPopup();
                                    });
                                    polyline_2.on("mouseout", function () {
                                        polyline_2.closePopup();
                                    });
                                    // Push new polyline to array
                                    paths.push(polyline_2);
                                }
                            };
                            for (var j = 0; j < matrix[0].length; j++) {
                                _loop_3(j);
                            }
                        }
                    });
                });
                // Add paths to the map
                for (var i = 0; i < graphData.matrix.length; i++) {
                    var _loop_2 = function (j) {
                        // If edge exists
                        if (graphData.matrix[i][j] != 0) {
                            // Create polyline as path
                            var polyline_3 = L.polyline([nodes[i].getLatLng(), nodes[j].getLatLng()], {
                                color: "blue",
                            }).addTo(map);
                            // Calculate distance
                            var distance = nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) / 1000;
                            // Create popup content with distance
                            var popupContent = "Distance: " + distance.toFixed(4) + " km";
                            polyline_3.bindPopup(popupContent);
                            // Add mouseover and mouseout listener to polyline
                            polyline_3.on("mouseover", function () {
                                polyline_3.openPopup();
                            });
                            polyline_3.on("mouseout", function () {
                                polyline_3.closePopup();
                            });
                            // Push new polyline to array
                            paths.push(polyline_3);
                        }
                    };
                    for (var j = 0; j < graphData.matrix[0].length; j++) {
                        _loop_2(j);
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
    window.scrollTo(window.scrollX, window.scrollY - 100);
});

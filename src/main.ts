// Global variables
let manyNodes = 0;
let nodes: L.Marker[] = [];
let paths: L.Polyline[] = [];
let matrix: number[][];

// Create map
const map = L.map("map", { doubleClickZoom: false }).setView(
  [-6.88792, 107.61033],
  13
);

// Tile Layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Create new node when double click
map.on("dblclick", (e) => {
  // Increment amount of nodes
  manyNodes++;

  // Create new marker
  let marker: L.Marker = L.marker(e.latlng, { draggable: true })
    .bindPopup(manyNodes.toString())
    .addTo(map)
    .openPopup();

  // Add dragend listener to marker
  marker.on("dragend", () => {
    // Remove all current paths from map and array
    for (let i = 0; i < paths.length; i++) {
      map.removeLayer(paths[i]);
    }

    paths = [];

    // Recreate all path with updated markers
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        // If edge exists
        if (matrix[i][j] != 0) {
          // Create polyline as path
          const polyline: L.Polyline = L.polyline(
            [nodes[i].getLatLng(), nodes[j].getLatLng()],
            {
              color: "blue",
            }
          ).addTo(map);

          // Calculate distance
          let distance: number =
            nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) / 1000;

          // Create popup content with distance
          let popupContent: string = "Distance: " + distance.toFixed(4) + " km";
          polyline.bindPopup(popupContent);

          // Add mouseover and mouseout listener to polyline
          polyline.on("mouseover", () => {
            polyline.openPopup();
          });

          polyline.on("mouseout", () => {
            polyline.closePopup();
          });

          // Push new polyline to array
          paths.push(polyline);
        }
      }
    }
  });

  // Add new marker to nodes
  nodes.push(marker);

  // Add mouseover and mouseout listener to marker
  marker.on("mouseover", () => {
    marker.openPopup();
  });
  marker.on("mouseout", () => {
    marker.closePopup();
  });
});

// Restart Button
const restartButton: HTMLButtonElement = document.getElementById(
  "restart"
) as HTMLButtonElement;

// Restart Function
restartButton.addEventListener("click", () => {
  // Reset all markers and polylines
  map.eachLayer((layer) => {
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
const fileInput: HTMLInputElement = document.getElementById(
  "fileInput"
) as HTMLInputElement;

// Add event listener to file input
fileInput.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) {
    // Get File
    const file = event.target.files?.[0];

    // If file exists
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Parse JSON File
        const data = event.target?.result as string;
        const graphData = JSON.parse(data);

        // Add markers to the map
        graphData.nodes.forEach((markerData: any) => {
          // Create marker
          const marker = L.marker([markerData.latitude, markerData.longitude], {
            draggable: true,
          });
          marker.bindPopup(markerData.name).addTo(map);

          // Push new marker to nodes
          nodes.push(marker);

          // Add mouseover and mouseout listener to marker
          marker.on("mouseover", () => {
            marker.openPopup();
          });
          marker.on("mouseout", () => {
            marker.closePopup();
          });

          // Add dragend listener to marker
          marker.on("dragend", () => {
            // Remove all current paths from map and array
            for (let i = 0; i < paths.length; i++) {
              map.removeLayer(paths[i]);
            }

            paths = [];

            // Recreate all path with updated markers
            for (let i = 0; i < matrix.length; i++) {
              for (let j = 0; j < matrix[0].length; j++) {
                // If edge exists
                if (matrix[i][j] != 0) {
                  // Create polyline as path
                  const polyline: L.Polyline = L.polyline(
                    [nodes[i].getLatLng(), nodes[j].getLatLng()],
                    {
                      color: "blue",
                    }
                  ).addTo(map);

                  // Calculate distance
                  let distance: number =
                    nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) /
                    1000;

                  // Create popup content with distance
                  let popupContent: string =
                    "Distance: " + distance.toFixed(4) + " km";
                  polyline.bindPopup(popupContent);

                  // Add mouseover and mouseout listener to polyline
                  polyline.on("mouseover", () => {
                    polyline.openPopup();
                  });

                  polyline.on("mouseout", () => {
                    polyline.closePopup();
                  });

                  // Push new polyline to array
                  paths.push(polyline);
                }
              }
            }
          });
        });

        // Add paths to the map
        for (let i = 0; i < graphData.matrix.length; i++) {
          for (let j = 0; j < graphData.matrix[0].length; j++) {
            // If edge exists
            if (graphData.matrix[i][j] != 0) {
              // Create polyline as path
              const polyline: L.Polyline = L.polyline(
                [nodes[i].getLatLng(), nodes[j].getLatLng()],
                {
                  color: "blue",
                }
              ).addTo(map);

              // Calculate distance
              let distance: number =
                nodes[i].getLatLng().distanceTo(nodes[j].getLatLng()) / 1000;

              // Create popup content with distance
              let popupContent: string =
                "Distance: " + distance.toFixed(4) + " km";
              polyline.bindPopup(popupContent);

              // Add mouseover and mouseout listener to polyline
              polyline.on("mouseover", () => {
                polyline.openPopup();
              });

              polyline.on("mouseout", () => {
                polyline.closePopup();
              });

              // Push new polyline to array
              paths.push(polyline);
            }
          }
        }

        // Set matrix from file
        matrix = graphData.matrix;

        // To improve the appearance of map
        const myGroup = L.featureGroup(nodes);

        // Set padding with 30
        const options = {
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

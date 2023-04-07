import { useEffect } from "react";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import { UniformCostSearch } from "../algorithms/UniformCostSearch";
import { Simpul } from "../algorithms/Simpul";

const Map = () => {
  useEffect(() => {
    var container = L.DomUtil.get("map");
    var selectStart: HTMLSelectElement = document.getElementById(
      "start-node"
    ) as HTMLSelectElement;
    var selectGoal: HTMLSelectElement = document.getElementById(
      "goal-node"
    ) as HTMLSelectElement;

    if (container != null && container.hasChildNodes() == false) {
      // Initialize Variables
      let manyNodes = 0;
      let markers: L.Marker[] = [];
      let nodes: Simpul[] = [];
      let paths: L.Polyline[] = [];
      let matrix: number[][];
      let selectedLayer: L.Layer;
      let JSONFile: string;

      // Create Map
      const map = L.map("map", { doubleClickZoom: false }).setView(
        [-6.88792, 107.61033],
        13
      );

      // Create Tile Layer
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Create new node when double click
      map.on("dblclick", (e) => {
        // Increment amount of markers
        manyNodes++;

        // Create Delete Button
        let buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "Delete";
        buttonDelete.addEventListener("click", () => {
          map.removeLayer(selectedLayer);
        });

        // Create Marker Name
        let name = document.createElement("p");
        name.innerHTML = manyNodes.toString();

        // Create Content Popup
        let content = document.createElement("div");
        content.appendChild(name);
        content.appendChild(buttonDelete);

        // Create new option to select element
        createOption(manyNodes.toString());

        // Create new marker
        let marker: L.Marker = L.marker(e.latlng, { draggable: true })
          .bindPopup(content)
          .addTo(map)
          .openPopup();

        // Push new Simpul to list of nodes
        nodes.push(
          new Simpul(
            manyNodes,
            manyNodes.toString(),
            marker.getLatLng().lat,
            marker.getLatLng().lng
          )
        );

        // Add dragend listener to marker
        marker.on("dragend", () => {
          redrawPaths();
        });

        // Add new marker to markers
        markers.push(marker);
      });

      // UCS Button
      const UCSButton: HTMLButtonElement = document.getElementById(
        "ucs"
      ) as HTMLButtonElement;

      // Function to compare two latlng object
      const compareLatLng = (obj1: L.LatLng, obj2: L.LatLng) => {
        return obj1.lat == obj2.lat && obj1.lng == obj2.lng;
      };

      // Function to restart all markers to default icon
      const restartDefaultMarker = () => {
        markers.forEach((simpul) => {
          simpul.setIcon(
            L.icon({
              iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
              iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize: [41, 41],
            })
          );
        });
      };

      // Function to restart all polylines to blue
      const restartDefaultPolyline = () => {
        paths.forEach((path) => {
          path.setStyle({ color: "blue" });
        });
      };

      // UCS Event
      UCSButton.addEventListener("click", () => {
        // Restart all markers and paths
        restartDefaultMarker();
        restartDefaultPolyline();

        // Get Start and Goal Node
        let startNode = findNodeByName(selectStart.value);
        let goalNode = findNodeByName(selectGoal.value);

        // Create temporary node
        startNode = new Simpul(
          startNode.id,
          startNode.name,
          startNode.latitude,
          startNode.longitude
        );

        goalNode = new Simpul(
          goalNode.id,
          goalNode.name,
          goalNode.latitude,
          goalNode.longitude
        );

        // Init neighbours start and goal node
        startNode.initNeighbors(matrix, nodes);
        goalNode.initNeighbors(matrix, nodes);

        // Construct UCS
        let UCS = new UniformCostSearch(startNode, goalNode, JSONFile);

        // Search UCS
        let result = UCS.search();

        // If result exists
        if (result) {
          // Create route variable
          let route = "";

          // Create route string
          for (let i = 0; i < result.length; i++) {
            if (i != result.length - 1) {
              route += result[i].name + " - ";
            } else {
              route += result[i].name;
            }
          }

          // Set route value
          let routeHTML: HTMLParagraphElement = document.getElementById(
            "route"
          ) as HTMLParagraphElement;
          routeHTML.innerText = route;

          // Set distance value
          let distanceHTML: HTMLParagraphElement = document.getElementById(
            "distance"
          ) as HTMLParagraphElement;
          distanceHTML.innerText = UCS.getOptimalDistance(result).toString();

          // Set start node to green marker and goal node to red marker
          markers.forEach((simpul) => {
            if (
              simpul.getLatLng().lng == startNode.longitude &&
              simpul.getLatLng().lat == startNode.latitude
            ) {
              simpul.setIcon(
                L.icon({
                  iconUrl:
                    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                  shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              );
            } else if (
              simpul.getLatLng().lng == goalNode.longitude &&
              simpul.getLatLng().lat == goalNode.latitude
            ) {
              simpul.setIcon(
                L.icon({
                  iconUrl:
                    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                  shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              );
            }
          });

          // Change solution path colors
          for (let i = 0; i < result.length - 1; i++) {
            for (let j = 0; j < paths.length; j++) {
              // Get latlng object from path
              let latlong1 = paths[j].getLatLngs()[0];
              let latlong2 = paths[j].getLatLngs()[1];

              // Create latlng object from first node
              let latlongFirstNode = new L.LatLng(
                result[i].latitude,
                result[i].longitude
              );

              // Create latlng object from second node
              let latlongDestNode = new L.LatLng(
                result[i + 1].latitude,
                result[i + 1].longitude
              );

              // Compare latlng objects with nodes
              if (
                compareLatLng(latlong1, latlongFirstNode) &&
                compareLatLng(latlong2, latlongDestNode)
              ) {
                paths[j].setStyle({ color: "green" });
              } else if (
                compareLatLng(latlong2, latlongFirstNode) &&
                compareLatLng(latlong1, latlongDestNode)
              ) {
                paths[j].setStyle({ color: "green" });
              }
            }
          }
        }
      });

      // Restart Button
      const restartButton: HTMLButtonElement = document.getElementById(
        "restart"
      ) as HTMLButtonElement;

      const resetMap = () => {
        // Reset all markers and polylines
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        // Reset variables
        manyNodes = 0;
        markers = [];
        nodes = [];
        paths = [];

        fileInput.value = "";
      };

      // Restart Function
      restartButton.addEventListener("click", () => {
        resetMap();
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
              JSONFile = data;
              const graphData = JSON.parse(data);

              // Add markers to the map
              graphData.nodes.forEach((markerData: any) => {
                // Create marker
                const marker = L.marker(
                  [markerData.latitude, markerData.longitude],
                  {
                    draggable: true,
                  }
                );

                // Create Delete Button
                let buttonDelete = document.createElement("button");
                buttonDelete.innerHTML = "Delete";
                buttonDelete.addEventListener("click", () => {
                  map.removeLayer(selectedLayer);
                });

                // Create Name
                let name = document.createElement("p");
                name.innerHTML = markerData.name;

                // Create new option to select elements
                createOption(markerData.name);

                // Create popup content
                let content = document.createElement("div");
                content.appendChild(name);
                content.appendChild(buttonDelete);

                // Add marker to map
                marker.bindPopup(content).addTo(map);

                // Increment many nodes and push new Simpul to list of nodes
                manyNodes++;
                nodes.push(
                  new Simpul(
                    markerData.id,
                    markerData.name,
                    markerData.latitude,
                    markerData.longitude
                  )
                );

                // Push new marker to markers
                markers.push(marker);

                // Add dragend listener to marker
                marker.on("dragend", () => {
                  redrawPaths();
                });
              });

              // Add paths to the map
              for (let i = 0; i < graphData.matrix.length; i++) {
                for (let j = i; j < graphData.matrix[0].length; j++) {
                  // If edge exists
                  if (graphData.matrix[i][j] != 0) {
                    // Create polyline as path
                    const polyline: L.Polyline = L.polyline(
                      [markers[i].getLatLng(), markers[j].getLatLng()],
                      {
                        color: "blue",
                      }
                    ).addTo(map);

                    // Calculate distance
                    let distance: number =
                      markers[i]
                        .getLatLng()
                        .distanceTo(markers[j].getLatLng()) / 1000;

                    // Create popup content with distance
                    let popupContent: string =
                      "Distance: " + distance.toFixed(4) + " km";

                    // Create Delete Button
                    let buttonDelete = document.createElement("button");
                    buttonDelete.innerHTML = "Delete";
                    buttonDelete.addEventListener("click", () => {
                      map.removeLayer(selectedLayer);
                    });

                    // Create name
                    let name = document.createElement("p");
                    name.innerHTML = popupContent;

                    // Create Content Element
                    let content = document.createElement("div");
                    content.appendChild(name);
                    content.appendChild(buttonDelete);

                    // Bind content with popup polyline
                    polyline.bindPopup(content);

                    // Push new polyline to array
                    paths.push(polyline);
                  }
                }
              }

              // Set matrix from file
              matrix = graphData.matrix;

              // To improve the appearance of map
              const myGroup = L.featureGroup(markers);

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

      // Navigation behaviour
      window.addEventListener("hashchange", function () {
        window.scrollTo(window.scrollX, window.scrollY - 100);
      });

      // Set selected layer by onclick
      map.on("popupopen", (e) => {
        //@ts-ignore
        selectedLayer = e.popup._source;
      });

      // Function to create new option element
      const createOption = (name: string) => {
        let option = document.createElement("option");
        option.value = name;
        option.innerHTML = name;
        selectStart?.appendChild(option);

        let option2 = document.createElement("option");
        option2.value = name;
        option2.innerHTML = name;
        selectGoal?.appendChild(option2);
      };

      // Function to search node by name
      const findNodeByName = (name: string) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].name == name) {
            return nodes[i];
          }
        }
        return new Simpul(-1, "-1", 0, 0);
      };

      // Function to redraw all paths
      const redrawPaths = () => {
        // Remove all current paths from map and array
        for (let i = 0; i < paths.length; i++) {
          map.removeLayer(paths[i]);
        }

        // Empty list
        paths = [];

        // Recreate all path with updated markers
        for (let i = 0; i < matrix.length; i++) {
          for (let j = i; j < matrix[0].length; j++) {
            // If edge exists
            if (matrix[i][j] != 0) {
              // Create polyline as path
              const polyline: L.Polyline = L.polyline(
                [markers[i].getLatLng(), markers[j].getLatLng()],
                {
                  color: "blue",
                }
              ).addTo(map);

              // Calculate distance
              let distance: number =
                markers[i].getLatLng().distanceTo(markers[j].getLatLng()) /
                1000;

              // Create popup content with distance
              let popupContent: string =
                "Distance: " + distance.toFixed(4) + " km";

              // Create Delete Button
              let buttonDelete = document.createElement("button");
              buttonDelete.innerHTML = "Delete";
              buttonDelete.addEventListener("click", () => {
                map.removeLayer(selectedLayer);
              });

              // Create Name
              let name = document.createElement("p");
              name.innerHTML = popupContent;

              // Create Content
              let content = document.createElement("div");
              content.appendChild(name);
              content.appendChild(buttonDelete);

              // Bind content with popup polyline
              polyline.bindPopup(content);

              // Push new polyline to array
              paths.push(polyline);
            }
          }
        }
      };
    }
  }, []);

  return (
    <div className="bg-white p-4 w-2/3 mx-auto shadow-xl rounded-xl">
      <div id="map" className="h-[400px] w-full !z-1 rounded-xl"></div>
    </div>
  );
};

export default Map;

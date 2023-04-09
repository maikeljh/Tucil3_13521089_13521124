import { useEffect } from "react";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import { UniformCostSearch } from "../algorithms/UniformCostSearch";
import { Simpul } from "../algorithms/Simpul";
import { AStar } from "@/algorithms/AStar";
import "react-toastify/dist/ReactToastify.min.css";
import { toast } from "react-toastify";

const Map = () => {
  useEffect(() => {
    /* HTML Elements */
    // Start Select Element
    let selectStart: HTMLSelectElement = document.getElementById(
      "start-node"
    ) as HTMLSelectElement;

    // Goal Select Element
    let selectGoal: HTMLSelectElement = document.getElementById(
      "goal-node"
    ) as HTMLSelectElement;

    // Start Select Element
    let selectFirst: HTMLSelectElement = document.getElementById(
      "first-node"
    ) as HTMLSelectElement;

    // Goal Select Element
    let selectSecond: HTMLSelectElement = document.getElementById(
      "second-node"
    ) as HTMLSelectElement;

    // UCS Button
    let UCSButton: HTMLButtonElement = document.getElementById(
      "ucs"
    ) as HTMLButtonElement;

    // A* Button
    let AStarButton: HTMLButtonElement = document.getElementById(
      "a*"
    ) as HTMLButtonElement;

    // Restart Button
    let restartButton: HTMLButtonElement = document.getElementById(
      "restart"
    ) as HTMLButtonElement;

    // Add Path Button
    let addPathButton: HTMLButtonElement = document.getElementById(
      "add-path"
    ) as HTMLButtonElement;

    // Route Display
    let routeHTML: HTMLParagraphElement = document.getElementById(
      "route"
    ) as HTMLParagraphElement;

    // Distance Display
    let distanceHTML: HTMLParagraphElement = document.getElementById(
      "distance"
    ) as HTMLParagraphElement;

    // File Input
    let fileInput: HTMLInputElement = document.getElementById(
      "fileInput"
    ) as HTMLInputElement;

    // Scroll window to top
    window.scrollTo(0, 0);

    // Get Map Container
    var container = L.DomUtil.get("map");

    // Construct Map
    if (container != null && container.hasChildNodes() == false) {
      /* Variables */
      let manyNodes = 0;
      let markers: L.Marker[] = [];
      let nodes: Simpul[] = [];
      let paths: L.Polyline[] = [];
      let matrix: number[][] = [];
      let selectedLayer: L.Layer;
      let active: boolean = false;
      let currentAlgorithm: string;

      /* Construct Map */
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

      /* Functions */
      // Function to update matrix after add simpul
      const updateMatrixAddSimpul = () => {
        let newRow = [];
        for (let i = 0; i < matrix.length; i++) {
          matrix[i].push(0);
          newRow.push(0);
        }
        newRow.push(0);
        matrix.push(newRow);
      };

      // Function to update matrix after delete simpul
      const updateMatrixDeleteSimpul = (simpul: Simpul) => {
        for (let i = 0; i < matrix.length; i++) {
          matrix[i][simpul.id - 1] = 0;
          matrix[simpul.id - 1][i] = 0;
        }
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id == simpul.id) {
            toast.success(`Berhasil menghapus simpul ${simpul.name}`);
            nodes[i] = new Simpul(simpul.id, "deleted", 0, 0);
          }
        }
      };

      // Function update matrix after add path
      const updateMatrixAddPath = (i: number, j: number) => {
        matrix[i][j] = 1;
        matrix[j][i] = 1;
      };

      // Function update matrix after delete path
      const updateMatrixDeletePath = (i: number, j: number) => {
        matrix[i][j] = 0;
        matrix[j][i] = 0;
      };

      // Function to update simpul
      const updateSimpul = (name: String, lat: number, lng: number) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].name === name) {
            nodes[i].setLatitude(lat);
            nodes[i].setLongitude(lng);
            break;
          }
        }
      };

      // Function to handle delete simpul
      const deleteSimpul = (simpul: Simpul) => {
        updateMatrixDeleteSimpul(simpul);
        redrawPaths();
        if (active) {
          restartDefaultMarker();
          if (
            selectStart.value === simpul.name ||
            selectGoal.value === simpul.name
          ) {
            routeHTML.innerHTML = "";
            distanceHTML.innerHTML = "";
            active = false;
            currentAlgorithm = "";
          } else {
            if (currentAlgorithm == "UCS") {
              triggerUCS();
            } else {
              triggerAStar();
            }
          }
        }

        // Get option elements
        let select1 = selectStart.querySelector(
          `option[value="${simpul.name.toString()}"]`
        );

        let select2 = selectGoal.querySelector(
          `option[value="${simpul.name.toString()}"]`
        );

        let select3 = selectFirst.querySelector(
          `option[value="${simpul.name.toString()}"]`
        );

        let select4 = selectSecond.querySelector(
          `option[value="${simpul.name.toString()}"]`
        );

        // Remove option elements
        select1?.remove();
        select2?.remove();
        select3?.remove();
        select4?.remove();
      };

      // Function to handle add path
      const addPath = () => {
        let firstName = selectFirst.value;
        let secondName = selectSecond.value;

        let firstSimpul = findNodeByName(firstName);
        let secondSimpul = findNodeByName(secondName);

        updateMatrixAddPath(firstSimpul.id - 1, secondSimpul.id - 1);
        redrawPaths();

        if (firstName === secondName) {
          toast.error("Tidak bisa menambahkan rute ke simpul yang sama!", {
            autoClose: 3000,
          });
        } else {
          toast.success(
            `Berhasil menambahkan rute dari ${firstName} ke ${secondName}`,
            {
              autoClose: 3000,
            }
          );
        }

        if (active) {
          restartDefaultMarker();
          if (currentAlgorithm == "UCS") {
            triggerUCS();
          } else {
            triggerAStar();
          }
        }
      };

      // Function to handle delete path
      const deletePath = (i: number, j: number) => {
        updateMatrixDeletePath(i, j);
        redrawPaths();
        toast.success(
          `Berhasil menghapus rute dari ${nodes[i].name} ke ${nodes[j].name}`,
          { autoClose: 3000 }
        );
        if (active) {
          restartDefaultMarker();
          if (currentAlgorithm == "UCS") {
            triggerUCS();
          } else {
            triggerAStar();
          }
        }
      };

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

      // Function to trigger UCS
      const triggerUCS = () => {
        // Restart all markers and paths
        restartDefaultMarker();
        restartDefaultPolyline();

        // Activate algorithm
        active = true;
        currentAlgorithm = "UCS";

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
        let UCS = new UniformCostSearch(startNode, goalNode, nodes, matrix);

        // Search UCS
        let result = UCS.search();

        // If result exists
        if (result.length > 0) {
          toast.success("Rute berhasil ditemukan dengan UCS", {
            autoClose: 3000,
          });

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
          routeHTML.innerText = route;

          // Set distance value
          distanceHTML.innerText =
            UCS.getOptimalDistance(result).toFixed(5).toString() + " km";

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
                //@ts-ignore
                compareLatLng(latlong1, latlongFirstNode) && //@ts-ignore
                compareLatLng(latlong2, latlongDestNode)
              ) {
                paths[j].setStyle({ color: "green" });
              } else if (
                //@ts-ignore
                compareLatLng(latlong2, latlongFirstNode) && //@ts-ignore
                compareLatLng(latlong1, latlongDestNode)
              ) {
                paths[j].setStyle({ color: "green" });
              }
            }
          }
        } else {
          toast.error("Rute tidak ditemukan", {
            autoClose: 3000,
          });
          routeHTML.innerText = "No route";
          distanceHTML.innerText = "-";
        }
      };

      // Function to trigger UCS
      const triggerAStar = () => {
        // Restart all markers and paths
        restartDefaultMarker();
        restartDefaultPolyline();

        // Activate algorithm
        active = true;
        currentAlgorithm = "A*";

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

        // Construct A*
        let Astar = new AStar(startNode, goalNode, nodes, matrix);

        // Search UCS
        let result = Astar.search();

        // If result exists
        if (result.length > 0) {
          toast.success("Rute berhasil ditemukan dengan A*", {
            autoClose: 3000,
          });

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
          routeHTML.innerText = route;

          // Set distance value
          distanceHTML.innerText =
            Astar.getOptimalDistance(result).toFixed(5).toString() + " km";

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
                //@ts-ignore
                compareLatLng(latlong1, latlongFirstNode) && //@ts-ignore
                compareLatLng(latlong2, latlongDestNode)
              ) {
                paths[j].setStyle({ color: "green" });
              } else if (
                //@ts-ignore
                compareLatLng(latlong2, latlongFirstNode) && //@ts-ignore
                compareLatLng(latlong1, latlongDestNode)
              ) {
                paths[j].setStyle({ color: "green" });
              }
            }
          }
        } else {
          toast.error("Rute tidak ditemukan", {
            autoClose: 3000,
          });
          routeHTML.innerText = "No route";
          distanceHTML.innerText = "-";
        }
      };

      // Function to reset all elements in map
      const resetMap = (condition: String) => {
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

        selectStart.innerHTML = "";
        selectGoal.innerHTML = "";
        selectFirst.innerHTML = "";
        selectSecond.innerHTML = "";
        routeHTML.innerHTML = "";
        distanceHTML.innerHTML = "";

        if (condition !== "readFile") {
          fileInput.value = "";
        }
      };

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

        let option3 = document.createElement("option");
        option3.value = name;
        option3.innerHTML = name;
        selectFirst?.appendChild(option3);

        let option4 = document.createElement("option");
        option4.value = name;
        option4.innerHTML = name;
        selectSecond?.appendChild(option4);
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
              buttonDelete.className =
                "mx-auto text-center bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px]";
              buttonDelete.addEventListener("click", () => {
                map.removeLayer(selectedLayer);
                deletePath(i, j);
              });

              // Create Name
              let name = document.createElement("span");
              name.innerHTML = popupContent;
              name.className = "text-center my-2";

              // Create Content
              let content = document.createElement("div");
              content.className = "flex flex-col";
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

      // Function to validate file
      // @ts-ignore
      const validateFile = (graphData) => {
        if (graphData.nodes == undefined || graphData.matrix == undefined) {
          toast.error("File tidak valid!");
          return false;
        } else {
          if (Array.isArray(graphData.nodes) && graphData.nodes.length > 0) {
            for (let i = 0; i < graphData.nodes.length; i++) {
              if (
                graphData.nodes[i].id == undefined ||
                graphData.nodes[i].name == undefined ||
                graphData.nodes[i].latitude == undefined ||
                graphData.nodes[i].longitude == undefined
              ) {
                toast.error("Atribut simpul tidak valid!");
                return false;
              } else {
                if (graphData.nodes[i].name.length > 18) {
                  toast.error("Nama simpul terlalu panjang!");
                  return false;
                } else if (graphData.nodes[i].id != i + 1) {
                  toast.error("ID simpul tidak valid!");
                  return false;
                } else if (
                  graphData.nodes[i].latitude < -90 ||
                  graphData.nodes[i].latitude > 90 ||
                  graphData.nodes[i].longitude < -180 ||
                  graphData.nodes[i].longitude > 180
                ) {
                  toast.error("Latitude/Longitude simpul tidak valid!");
                  return false;
                }
              }
            }

            if (
              Array.isArray(graphData.matrix) &&
              graphData.matrix.length > 0
            ) {
              for (let i = 0; i < graphData.matrix.length; i++) {
                if (
                  !Array.isArray(graphData.matrix[i]) ||
                  graphData.matrix[i].length != graphData.matrix.length
                ) {
                  toast.error("Matrix Adjacency tidak valid!");
                  return false;
                } else {
                  for (let j = 0; j < graphData.matrix[i].length; j++) {
                    if (isNaN(graphData.matrix[i][j])) {
                      toast.error("Matrix Adjacency tidak valid!");
                      return false;
                    }
                  }
                }
              }
              return true;
            } else {
              toast.error("Matrix Adjacency tidak valid!");
              return false;
            }
          } else {
            toast.error("Simpul tidak valid!");
            return false;
          }
        }
      };

      /* Events */
      // Create new node when double click
      map.on("dblclick", (e) => {
        // Increment amount of markers
        manyNodes++;

        // Create Delete Button
        let buttonDelete = document.createElement("button");
        buttonDelete.className =
          "mx-auto text-center bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px]";
        buttonDelete.innerHTML = "Delete";

        // Create Marker Name
        let name = document.createElement("span");
        name.className = "text-center my-2";
        name.innerHTML = manyNodes.toString();

        // Create Content Popup
        let content = document.createElement("div");
        content.className = "flex flex-col";
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
        let newSimpul = new Simpul(
          manyNodes,
          manyNodes.toString(),
          marker.getLatLng().lat,
          marker.getLatLng().lng
        );

        nodes.push(newSimpul);

        // Add click listener to delete button
        buttonDelete.addEventListener("click", () => {
          map.removeLayer(selectedLayer);
          deleteSimpul(newSimpul);
        });

        // Add dragend listener to marker
        marker.on("dragend", () => {
          restartDefaultMarker();
          redrawPaths();
          let name = marker
            .getPopup()
            ?.getContent() // @ts-ignore
            ?.querySelector("p").innerHTML;
          updateSimpul(name, marker.getLatLng().lat, marker.getLatLng().lng);
          if (active) {
            if (currentAlgorithm === "UCS") {
              triggerUCS();
            } else {
              triggerAStar();
            }
          }
        });

        // Add new marker to markers
        markers.push(marker);

        // Update Adjacency Matrix
        updateMatrixAddSimpul();
      });

      // UCS Event
      UCSButton.addEventListener("click", () => {
        if (selectStart.value === "" || selectGoal.value === "") {
          toast.error("Tidak dapat melakukan pencarian rute!");
        } else {
          triggerUCS();
        }
      });

      // A* Event
      AStarButton.addEventListener("click", () => {
        if (selectStart.value === "" || selectGoal.value === "") {
          toast.error("Tidak dapat melakukan pencarian rute!");
        } else {
          triggerAStar();
        }
      });

      // Restart Event
      restartButton.addEventListener("click", () => {
        resetMap("");
        toast.success("Berhasil reset map!");
      });

      // Add Path Event
      addPathButton.addEventListener("click", () => {
        if (selectFirst.value === "" || selectSecond.value === "") {
          toast.error("Tidak dapat menambahkan path!");
        } else {
          addPath();
        }
      });

      // File Input Event
      fileInput.addEventListener("change", (event) => {
        if (event.target instanceof HTMLInputElement) {
          // Get File
          const file = event.target.files?.[0];

          // If file exists
          if (file) {
            resetMap("readFile");
            const reader = new FileReader();
            reader.onload = (event) => {
              // Parse JSON File
              const data = event.target?.result as string;
              const graphData = JSON.parse(data);
              if (validateFile(graphData)) {
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
                  buttonDelete.className =
                    "mx-auto text-center bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px]";
                  buttonDelete.innerHTML = "Delete";

                  // Create Name
                  let name = document.createElement("span");
                  name.className = "text-center my-2";
                  name.innerHTML = markerData.name;

                  // Create new option to select elements
                  createOption(markerData.name);

                  // Create popup content
                  let content = document.createElement("div");
                  content.className = "flex flex-col";
                  content.appendChild(name);
                  content.appendChild(buttonDelete);

                  // Add marker to map
                  marker.bindPopup(content).addTo(map);

                  // Increment many nodes and push new Simpul to list of nodes
                  manyNodes++;

                  let newSimpul = new Simpul(
                    markerData.id,
                    markerData.name,
                    markerData.latitude,
                    markerData.longitude
                  );

                  nodes.push(newSimpul);

                  buttonDelete.addEventListener("click", () => {
                    map.removeLayer(selectedLayer);
                    deleteSimpul(newSimpul);
                  });

                  // Push new marker to markers
                  markers.push(marker);

                  // Add dragend listener to marker
                  marker.on("dragend", () => {
                    restartDefaultMarker();
                    redrawPaths();
                    let name = marker
                      .getPopup()
                      ?.getContent() // @ts-ignore
                      ?.querySelector("p").innerHTML;
                    updateSimpul(
                      name,
                      marker.getLatLng().lat,
                      marker.getLatLng().lng
                    );
                    if (active) {
                      if (currentAlgorithm === "UCS") {
                        triggerUCS();
                      } else {
                        triggerAStar();
                      }
                    }
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
                      buttonDelete.className =
                        "mx-auto text-center bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px]";
                      buttonDelete.addEventListener("click", () => {
                        map.removeLayer(selectedLayer);
                        deletePath(i, j);
                      });

                      // Create name
                      let name = document.createElement("span");
                      name.className = "text-center my-2";
                      name.innerHTML = popupContent;

                      // Create Content Element
                      let content = document.createElement("div");
                      content.className = "flex flex-col";
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
              }
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
    }
  }, []);

  return (
    <div className="bg-white p-4 w-2/3 mx-auto shadow-xl rounded-xl">
      <div id="map" className="h-[400px] w-full !z-1 rounded-xl"></div>
    </div>
  );
};

export default Map;

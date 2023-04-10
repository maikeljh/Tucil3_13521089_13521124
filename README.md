# Tucil3_13521089_13521124

## Table of Contents
- [Tucil3\_13521089\_13521124](#tucil3_13521089_13521124)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Problem Description](#problem-description)
  - [Program Features](#program-features)
  - [Algorithm Description](#algorithm-description)
  - [Program Structure](#program-structure)
  - [Running The Program](#running-the-program)
  - [Libraries Used](#libraries-used)


## Project Description

A Web application that gets the shortest route from point A to point B, using real-world map, Made for the Algorithms and Design Course, Bandung Insitute Of Technology. By Kenneth Ezekiel (13521089) and Michael Jonathan Halim (13521124). Solved using the Uniform-Cost Search and A* Search.

## Problem Description

The shortest path problem is a problem that: given a list of nodes with its neighbors/edges, finds the shortest path possible from point A to point B, with each edge containing a weight.

This project solves the problem with a web application, that uses a map API to input the nodes and edges, or a .json file containing the graph and nodes.

## Program Features

The program features are listed below:
1. Double clicking on the map will create a new node
2. Ability to add path between nodes
3. Translating nodes to graph automatically, with real latitudes and longitudes
4. Import .json files for testing purposes
5. A* Search for the shortest path between nodes
6. UCS for the shortest path between nodes
7. Distance for each route

## Algorithm Description

The A* Search is an informed search algorithm that uses a heuristic function to optimize its decision making. with the function as follows:

g(n) = distance from the root node to node n
h(n) = approximate distance from node n to goal node
f(n) = g(n) + h(n)

As long as the approximation distance is less than the real distance, h(n) < real distance from n to goal node, then the decision made by following f(n) is optimal.

The UCS follows the same pattern, but without the information of h(n), it does not know the approximate distance from n to goal node. Thus, making the decision function f(n) = g(n). This function will determine the decision of the algorithm, with the algorithm only expanding the lowest cost so far.

## Program Structure

## Running The Program

To run the program:

1. run npm install in directory ./src/log-pose
2. run npm install @types/leaflet and npm install leaflet
3. run npm run dev

**Here are some examples of displays:**

![Screenshot_2956](https://user-images.githubusercontent.com/87570374/230984920-6bf27b49-036b-4fa4-a8c4-3bb92b29af1e.png)

![Screenshot_2957](https://user-images.githubusercontent.com/87570374/230984937-b1a66223-888b-4e3d-b058-78cc76e2744b.png)

![Screenshot_2958](https://user-images.githubusercontent.com/87570374/230984954-d5174bdd-2118-4bfd-8b68-4c21e6fe1ccd.png)

![Screenshot_2959](https://user-images.githubusercontent.com/87570374/230984963-6432b222-81a4-43c2-af37-47dee9f046ef.png)

## Libraries Used


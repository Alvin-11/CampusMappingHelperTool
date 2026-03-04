const fs = require("fs");
const path = require("path");
const EDGE = 1; // change the counter depending on how many edges you currently have in your database
// 🔹 Get file name from command line
const inputFile = process.argv[2];

if (!inputFile) {
  console.log("Please provide a GeoJSON file.");
  console.log("Example: node generate-tuples.js graph.geojson");
  process.exit(1);
}

// 🔹 Read GeoJSON file
const geojson = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// 🔹 Config
const building = "VL";
const floor = "1";
const wheelchairAccessible = true;

// =========================
// Generate Node Tuples
// =========================
const nodeTuples = geojson.features
  .filter(f => f.properties.type === "node")
  .map(f => {
    const id = f.properties.name;
    const [lon, lat] = f.geometry.coordinates;

    return `('${id}', '${id}', ${wheelchairAccessible}, '${floor}', '${building}', ${lon}, ${lat})`;
  });

// =========================
// Generate Edge Tuples
// =========================
let edgeCounter = EDGE; 

const edgeTuples = geojson.features
  .filter(f => f.properties.type === "edge")
  .map(f => {
    const id2 = `E${edgeCounter}`;
    const id = `VL1-E${edgeCounter++}`;
    
    const start = f.properties.from;
    const end = f.properties.to;
    const distance = f.properties.distance_m;
    let accessibility = wheelchairAccessible; // default to true
    if(end.includes("stair")){
      accessibility = false; 
    }

    return `('${id}', '${id2}', ${accessibility}, '${start}', '${end}', '${building}', ${distance})`;
  });

// =========================
// Create output file name
// =========================
const baseName = path.basename(inputFile, ".geojson");
const outputFile = `${baseName}.txt`;

// =========================
// Write TXT file
// =========================
const output =
  "NODES:\n" +
  nodeTuples.join(",\n") +
  "\n\nEDGES:\n" +
  edgeTuples.join(",\n");

fs.writeFileSync(outputFile, output);

console.log(`✅ ${outputFile} generated successfully.`);
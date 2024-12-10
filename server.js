const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3000;
const dataFile = "trips.json";

// Load environment variables from a .env file
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow CORS for development purposes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Handle preflight (OPTIONS) request
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.sendStatus(200); // Respond with 200 status for preflight
});

// Fetch API key
app.get("/weather", async (req, res) => {
  const weatherLocation = "Sarajevo";
  const weatherApiKey = process.env.WEATHER_API_KEY;
  const weatherApiUrl = `https://api.tomorrow.io/v4/timelines?location=${weatherLocation}&fields=temperature&fields=weatherCode&timesteps=1d&units=metric&apikey=${weatherApiKey}`;

  try {
    const response = await axios.get(weatherApiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Load trips
app.get("/load-trips", (req, res) => {
  fs.readFile(dataFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load trips" });
    }
    res.json(JSON.parse(data));
  });
});

// Save trip
app.post("/save-trip", (req, res) => {
  const trip = req.body;
  fs.readFile(dataFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save trip" });
    }
    let trips = [];
    try {
      trips = JSON.parse(data); // Parse the existing data
    } catch (parseError) {
      return res
        .status(500)
        .json({ error: "Error parsing existing trip data" });
    }
    trips.push(trip);
    fs.writeFile(dataFile, JSON.stringify(trips, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save trip" });
      }
      res.json({ success: true });
    });
  });
});

// Delete trip
app.delete("/delete-trip", (req, res) => {
  const tripName = req.body.tripName;
  fs.readFile(dataFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete trip" });
    }
    let trips = [];
    try {
      trips = JSON.parse(data);
    } catch (parseError) {
      return res
        .status(500)
        .json({ error: "Error parsing existing trip data" });
    }
    trips = trips.filter((trip) => trip.tripName !== tripName);
    fs.writeFile(dataFile, JSON.stringify(trips, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete trip" });
      }
      res.json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

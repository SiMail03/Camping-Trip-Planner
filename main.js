// JavaScript for fetching weather data and updating the weather section
const updateWeather = () => {
  fetch("http://localhost:3000/weather")
    .then((response) => response.json())
    .then((data) => {
      const weatherInfo = document.getElementById("weather-info");
      weatherInfo.innerHTML = ""; // Clear existing content

      // Loop through the next 5 days
      for (let i = 0; i < 5; i++) {
        const day = data.data.timelines[0].intervals[i];
        const date = new Date(day.startTime).toDateString();
        const temp = day.values.temperature;
        const weatherCode = day.values.weatherCode;

        // Map weather codes to descriptions (expand as needed)
        const weatherDescriptions = {
          1000: "Clear",
          1100: "Mostly Clear",
          1101: "Partly Cloudy",
          1102: "Mostly Cloudy",
          1001: "Cloudy",
          2000: "Fog",
          4000: "Drizzle",
          4001: "Rain",
          4200: "Light Rain",
          4201: "Heavy Rain",
          5000: "Snow",
          5001: "Flurries",
          5100: "Light Snow",
          5101: "Heavy Snow",
          6000: "Freezing Drizzle",
          6001: "Freezing Rain",
          6200: "Light Freezing Rain",
          6201: "Heavy Freezing Rain",
          7000: "Ice Pellets",
          7101: "Heavy Ice Pellets",
          7102: "Light Ice Pellets",
          8000: "Thunderstorm",
        };

        const description = weatherDescriptions[weatherCode] || "Unknown";

        weatherInfo.innerHTML += `
          <div class="weather-day">
            <p><strong>${date}</strong></p>
            <p>${temp}°C, ${description}</p>
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      const weatherInfo = document.getElementById("weather-info");
      weatherInfo.innerHTML =
        "<p>Failed to load weather data. Please try again later.</p>";
    });
};

// Call the updateWeather function to fetch and display the weather data
updateWeather();

//image slider
let slideIndex = 0;

const showSlides = () => {
  const slides = document.querySelectorAll(".slide");

  slides.forEach((slide, index) => {
    slide.classList.remove("active");
    if (index === slideIndex) {
      slide.classList.add("active");
    }
  });
};

const plusSlides = (n) => {
  slideIndex += n;
  const slides = document.querySelectorAll(".slide");
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  }
  if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  showSlides();
};

// Initial display
showSlides();

// Automatic slide transition
setInterval(() => {
  plusSlides(1);
}, 5000); // Change slide every 5 seconds

document
  .getElementById("trip-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form data
    const tripName = document.getElementById("trip-name").value;
    const tripDate = document.getElementById("trip-date").value;
    const tripLocation = document.getElementById("trip-location").value;
    const tripPeople = document.getElementById("trip-people").value;
    const tripNotes = document.getElementById("trip-notes").value;

    // Get selected equipment
    const equipment = [];
    document
      .querySelectorAll('input[name="equipment"]:checked')
      .forEach((checkbox) => {
        equipment.push(checkbox.value);
      });

    // Create trip data object
    const tripData = {
      tripName,
      tripDate,
      tripLocation,
      tripPeople,
      equipment,
      tripNotes,
    };

    // Send data to server using AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/save-trip", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Alert the user

          // Add the new trip data to the table
          addTripToTable(tripData);

          // Clear the form
          document.getElementById("trip-form").reset();
        } else {
          console.error("Error saving trip:", xhr.responseText);
        }
      }
    };
    xhr.send(JSON.stringify(tripData));
  });

window.onload = function () {
  // Load trip data from server
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/load-trips", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const trips = JSON.parse(xhr.responseText);
      trips.forEach((trip) => addTripToTable(trip));
    }
  };
  xhr.send();
};

function addTripToTable(trip) {
  const tripDataContainer = document.getElementById("trip-data");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${trip.tripName}</td>
    <td>${trip.tripDate}</td>
    <td>${trip.tripLocation}</td>
    <td>${trip.tripPeople}</td>
    <td>${trip.equipment.join(", ")}</td>
    <td>${trip.tripNotes}</td>
    <td><button class="delete-btn" onclick="deleteTrip('${
      trip.tripName
    }', this)">Delete</button></td>
  `;

  tripDataContainer.appendChild(newRow);
}

function deleteTrip(tripName, button) {
  // Send delete request to server
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:3000/delete-trip", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Remove the row from the table
      const row = button.closest("tr");
      row.remove();
    } else {
      console.error("Error deleting trip:", xhr.responseText);
    }
  };
  xhr.send(JSON.stringify({ tripName }));
}

// Select the dark mode toggle checkbox
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Add an event listener to the toggle
darkModeToggle.addEventListener("change", () => {
  // Toggle the 'dark' class on the <html> element
  document.documentElement.classList.toggle("dark", darkModeToggle.checked);
});

// Optional: Persist dark mode state using localStorage
document.addEventListener("DOMContentLoaded", () => {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  darkModeToggle.checked = isDarkMode;
  document.documentElement.classList.toggle("dark", isDarkMode);
});

darkModeToggle.addEventListener("change", () => {
  localStorage.setItem("darkMode", darkModeToggle.checked);
});

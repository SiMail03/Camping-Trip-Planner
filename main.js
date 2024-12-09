// JavaScript for fetching weather data and updating the weather section
const weatherApiKey = "CDYseQDMxdaMAoWYkyoiQq42Uf7IqpQN";
const weatherLocation = "Sarajevo";

const weatherApiUrl = `https://api.tomorrow.io/v4/timelines?location=${weatherLocation}&fields=temperature&fields=weatherCode&timesteps=1d&units=metric&apikey=${weatherApiKey}`;

const updateWeather = () => {
  fetch(weatherApiUrl)
    .then((response) => {
      console.log("Response:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Data:", data);
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
    // Ensure at least one checkbox is selected
    const equipmentChecked = document.querySelectorAll(
      'input[name="equipment"]:checked'
    );
    if (equipmentChecked.length === 0) {
      alert("Please select at least one camping equipment.");
      event.preventDefault();
      return;
    }

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

    // Create a new row for the table
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
    <td>${tripName}</td>
    <td>${tripDate}</td>
    <td>${tripLocation}</td>
    <td>${tripPeople}</td>
    <td>${equipment.join(", ")}</td>
    <td>${tripNotes}</td>
  `;

    // Append the new row to the table body
    document.getElementById("trip-data").appendChild(newRow);

    // Clear the form
    document.getElementById("trip-form").reset();
  });

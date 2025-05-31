// Weather Card Variables
const weatherCard = document.querySelector(".weatherCard");
const weatherIcon = document.querySelector(".weatherIcon");
const weatherName = document.querySelector(".weatherName");
const locationCard = document.querySelector(".location-card");
const temperature = document.querySelector("#temperature");
const temperatureMax = document.querySelector("#temperatureMax");
const temperatureMin = document.querySelector("#temperatureMin");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");

const apikey = "5bc7fcf06595f85679f4829d33184ed5";

// Fetch Weather Data
async function fetchWeatherData(location, callback1, callback2) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}`
    );
    if (!response.ok) {
      throw new Error("Location not found");
    }
    const data = await response.json();
    console.log(data);
    updateWeatherCard(data);
    callback1();
    callback2();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector('h1').textContent = error;
    locationList.pop();
  } finally {
    console.log("Weather data fetch attempt completed.");
  }
}

// Update Weather Card with fetched data
function updateWeatherCard(data) {
  // Get Main datas
  const weather = data.weather[0];
  const main = data.main;
  console.log(main);
  const wind = data.wind;

  // Get Secondary data
  const id = weather.id;
  const weatherNameText = weather.description.toUpperCase();
  const temperatureEL = Math.round(main.temp - 273.15);
  const temperatureMaxEL = Math.round(main.temp_max - 273.15);
  const temperatureMinEL = Math.round(main.temp_min - 273.15);
  const humidityEL = main.humidity;
  const windSpeedEL = wind.speed;
  const icon = getWeatherIcon(id);

  // Update Weather Card Elements
  weatherIcon.textContent = icon;
  weatherIcon.alt = weatherName;
  weatherName.textContent = weatherNameText;
  temperature.textContent = `${temperatureEL}°C`;
  temperatureMax.textContent = `${temperatureMaxEL}°C`;
  temperatureMin.textContent = `${temperatureMinEL}°C`;
  humidity.textContent = `${humidityEL}%`;
  windSpeed.textContent = `${windSpeedEL} m/s`;
}

// Get Weather Icon based on ID
function getWeatherIcon(id) {
  if (id >= 200 && id < 300) {
    return "⛈️";
  }
  if (id >= 300 && id < 400) {
    return "🌧️";
  }
  if (id >= 500 && id < 600) {
    return "🌧️";
  }
  if (id >= 600 && id < 700) {
    return "❄️";
  }
  if (id >= 700 && id < 800) {
    return "🌫️";
  }
  if (id === 800) {
    return "☀️";
  }
  if (id > 800 && id < 900) {
    return "☁️";
  }
  return "❓"; // Default icon for unknown weather
}

// Show Weather Card
function showWeatherCard() {
  weatherCard.style.display = "flex";
  const theBigText = document.querySelector("h1");
  theBigText.style.display = "none";
}

// Location Drop Down
const locationContainer = document.querySelector(".location");
const chooseLocationElem = document.querySelector(".chooseLocation");
let locationList = [];
let currentLocation = null;
let isDroppedDown = false;

chooseLocationElem.addEventListener("click", () => {
  chooseLocation(addLocation);
});

function chooseLocation(callback) {
  if (!isDroppedDown) {
    const addLocation = document.createElement("span");
    addLocation.classList.add("elem");
    addLocation.classList.add("cardBackground");
    addLocation.classList.add("hoverColor");
    applyThemeChange(addLocation);
    addLocation.id = "addLocation";
    addLocation.textContent = "+ Add Location";
    locationContainer.appendChild(addLocation);
    locationContainer.style.boxShadow = "inset 2px 3px 5px rgba(0, 0, 0, 0.4)";
    isDroppedDown = true;
    callback();
    if (locationList.length > 0) {
      locationList.forEach((location) => {
        const locationElem = document.createElement("span");
        locationElem.classList.add("elem");
        locationElem.classList.add("cardBackground");
        locationElem.classList.add("hoverColor");
        applyThemeChange(locationElem);
        locationElem.textContent = location;
        locationElem.addEventListener("click", () => {
          currentLocation = location;
          showWeatherCard();
          updateLocation();
          closeDropDown();
        });
        locationContainer.insertBefore(locationElem, addLocation);
      });
    }
  } else {
    closeDropDown();
  }
}

function closeDropDown() {
  const childs = locationContainer.querySelectorAll(".elem");
  childs.forEach((child) => {
    if (child.classList.contains("elem")) {
      child.remove();
    }
  });
  locationContainer.style.boxShadow = "2px 3px 5px rgba(0, 0, 0, 0.4)";
  isDroppedDown = false;
}

// Add Location Functionality
function addLocation() {
  const addLocation = document.getElementById("addLocation");
  if (addLocation) {
    addLocation.addEventListener("click", () => {
      const textField = document.createElement("input");
      textField.type = "text";
      textField.classList.add("locationTextField");
      textField.classList.add("borderColor");
      textField.classList.add("cardBackground");
      applyThemeChange(textField);
      textField.placeholder = "Enter Location";
      const saveButton = document.createElement("div");
      saveButton.textContent = "+ Save";
      saveButton.classList.add("saveButton");
      locationContainer.removeChild(addLocation);
      locationContainer.appendChild(textField);
      locationContainer.appendChild(saveButton);

      // Save Button Functionality
      saveButton.addEventListener("click", () => {
        const locationName = textField.value.trim();
        if (locationName) {
          locationList.push(locationName);
          currentLocation = locationName;
          if (currentLocation) {
            fetchWeatherData(currentLocation, showWeatherCard, updateLocation);
          }
          closeDropDown();
          textField.remove();
          saveButton.remove();
          isDroppedDown = false;
        } else {
          alert("Please enter a valid location name.");
        }
      });
    });
  }
}

// Update Location Display
function updateLocation() {
  chooseLocationElem.textContent = currentLocation
    ? currentLocation
    : "Choose Location";
  const locationCard = document.querySelector(".location-card");
  locationCard.textContent = currentLocation
    ? `in ${currentLocation}`
    : "No Location Selected";
}

// Time Updation Script
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  if(hours > 12){
    hours %= 12;
  }
  hours = String(hours).padStart(2,"0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById(
    "time"
  ).textContent = `${hours}:${minutes}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);

// Change Theme

let isLightTheme = true;

const switchTheme = document.querySelector(".switchTheme");

switchTheme.addEventListener("click", () => {
  if (isLightTheme) {
    isLightTheme = false;

    document.documentElement.style.setProperty("--text-color", "#9CA3AF");

    document.querySelector("body").style.backgroundColor = "#111827";

    const borderColor = document.querySelectorAll(".borderColor");
    borderColor.forEach((element) => {
      element.style.border = "3px solid #374151";
    });

    const cardBackground = document.querySelectorAll(".cardBackground");
    cardBackground.forEach((element) => {
      element.style.backgroundColor = "#1F2937";
    });

    const hoverColor = document.querySelectorAll(".hoverColor");
    hoverColor.forEach((element) => {
      element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "#4B5563";
      });
      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "#1F2937";
      });
    });

    const primaryText = document.querySelectorAll(".primaryText");
    primaryText.forEach((element) => {
      element.style.color = "#F9FAFB";
    });

  }
  else {
    isLightTheme = true;

    document.documentElement.style.setProperty("--text-color", "#4b5563");

    document.querySelector("body").style.backgroundColor = "white";

    const borderColor = document.querySelectorAll(".borderColor");
    borderColor.forEach((element) => {
      element.style.border = "3px solid #e5e7eb";
    });

    const cardBackground = document.querySelectorAll(".cardBackground");
    cardBackground.forEach((element) => {
      element.style.backgroundColor = "white";
    });

    const hoverColor = document.querySelectorAll(".hoverColor");
    hoverColor.forEach((element) => {
      element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "#e4e6e9";
      });
      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "white";
      });
    });

    const primaryText = document.querySelectorAll(".primaryText");
    primaryText.forEach((element) => {
      element.style.color = "#1f2937";
    });
  }
});

function applyThemeChange(elem) {
  if (!isLightTheme) {
    elem.style.backgroundColor = "#1F2937";
    elem.addEventListener("mouseover", () => {
      elem.style.backgroundColor = "#4B5563";
    });
    elem.addEventListener("mouseout", () => {
      elem.style.backgroundColor = "#1F2937";
    });
  } else {
    elem.style.backgroundColor = "white";
    elem.addEventListener("mouseover", () => {
      elem.style.backgroundColor = "#e4e6e9";
    });
    elem.addEventListener("mouseout", () => {
      elem.style.backgroundColor = "white";
    });
  }
}

// Login Function

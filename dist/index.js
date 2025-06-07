"use strict";
// Check for return of the NULL
function getEL(query) {
    const el = document.querySelector(query);
    if (!el)
        throw new Error(`Element ${query} not foud`);
    return el;
}
function getAllEL(query) {
    const el = document.querySelectorAll(query);
    if (!el)
        throw new Error(`Element ${query} not foud`);
    return el;
}
// Weather Card Variables
const weatherCardEl = getEL(".weatherCard");
const weatherIconEl = getEL(".weatherIcon");
const weatherNameEl = getEL(".weatherName");
const locationCardEl = getEL(".location-card");
const temperatureEl = getEL("#temperature");
const temperatureMaxEl = getEL("#temperatureMax");
const temperatureMinEl = getEL("#temperatureMin");
const humidityEl = getEL("#humidity");
const windSpeedEl = getEL("#windSpeed");
const theBigText = getEL(".theBigText");
const apikey = "5bc7fcf06595f85679f4829d33184ed5";
// Fetch Weather Datqa
async function fetchWeatherData(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}`);
        if (!response.ok) {
            throw new Error("Location not found");
        }
        const data = await response.json();
        console.log(data); // For checking what's been returned to us
        updateWeatherData(data);
        updateLocation();
        showWeatherCard();
    }
    catch (error) {
        console.error("Error Fetching Weather Data:", error);
        theBigText.textContent = error;
        locationList.pop();
    }
    finally {
        console.log("Weather data fetch attempt completed successfully");
    }
}
// Capitalizing each word's first letter
function firstLetterCapitalize(target) {
    let splitTarget = target.split(" "); // Storing each word seprataely
    let result = []; // Initializing the result array
    splitTarget.forEach((element) => {
        result.push(element[0].toUpperCase() + element.slice(1)); // Pushing each word's first letter capitalized
    });
    return result.join(" "); // Returning a joined string with a space
}
// Update Weather Card
function updateWeatherData(data) {
    // Getting arrays and object [First layer of data]
    const weatherData = data.weather[0];
    const mainTemperatureInfo = data.main;
    const windInfo = data.wind;
    // Getting main values [Second layer of data]
    const weatherId = weatherData.id;
    const weatherName = firstLetterCapitalize(weatherData.description);
    const temperatureValue = Math.round(mainTemperatureInfo.temp - 273.15);
    const maxTemperatureValue = Math.round(mainTemperatureInfo.temp_max - 273.15);
    const minTemperatureValue = Math.round(mainTemperatureInfo.temp_min - 273.15);
    const humidityValue = mainTemperatureInfo.humidity;
    const windSpeedValue = windInfo.speed;
    // Update Weather Card Elements
    weatherIconEl.textContent = getWeatherIcon(weatherId);
    weatherNameEl.textContent = weatherName;
    temperatureEl.textContent = `${temperatureValue}°C`;
    temperatureMaxEl.textContent = `${maxTemperatureValue}°C`;
    temperatureMinEl.textContent = `${minTemperatureValue}°C`;
    humidityEl.textContent = `${humidityValue}%`;
    windSpeedEl.textContent = `${windSpeedValue}m/s`;
}
// Weather Icon Function
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
// Show Weather Card Function
function showWeatherCard() {
    weatherCardEl.style.display = "flex"; // Show the Weather Card
    theBigText.style.display = "none"; // Hiding the heading
}
// Location Drop Down Variables
const locationContainerEl = getEL(".location");
// lc = Location Container
const lcHeadText = getEL(".chooseLocation"); // For avoiding closing of dropdown when clicking anywhere on it.
const locationOnCard = getEL(".location-card");
let locationList = [];
let currentLocation;
let isDroppedDown = false; // To check the drop down condition
function updateLocation() {
    lcHeadText.textContent = currentLocation ?? "Choose Location ▼";
    locationOnCard.textContent = currentLocation
        ? `in ${currentLocation}`
        : "No Location Selected";
}
lcHeadText.addEventListener("click", () => {
    dropDownLocation();
});
function dropDownLocation() {
    if (!isDroppedDown) {
        locationContainerEl.style.boxShadow =
            "inset 2px 3px 5px rgba(0, 0, 0, 0.4)";
        const addLocationButton = addThisElemToLC("+ Add Location");
        addLocationButton.id = "addLocationButton";
        locationContainerEl.appendChild(addLocationButton);
        isDroppedDown = true;
        addLocationFunction();
        if (locationList.length > 0) {
            locationList.forEach((location) => {
                const locationEl = addThisElemToLC(location);
                locationEl.addEventListener("click", () => {
                    currentLocation = location;
                    fetchWeatherData(location);
                    showWeatherCard();
                    updateLocation();
                    closeDropDown();
                });
                locationContainerEl.insertBefore(locationEl, addLocationButton);
            });
        }
    }
    else {
        closeDropDown();
    }
}
function closeDropDown() {
    const children = locationContainerEl.querySelectorAll(".elem");
    children.forEach((child) => {
        child.remove();
    });
    locationContainerEl.style.boxShadow = "2px 3px 5px rgba(0, 0, 0, 0.4)";
    isDroppedDown = false;
}
// Function for adding elements to the LC = Location Container
function addThisElemToLC(text) {
    const el = document.createElement("span");
    el.classList.add("elem");
    el.classList.add("cardBackground");
    el.classList.add("hoverColor");
    applyThemeChange(el);
    el.textContent = text;
    return el;
}
// Function for adding location when clicking on Add Location
function addLocationFunction() {
    const addLocationButton = getEL("#addLocationButton");
    addLocationButton.addEventListener("click", () => {
        const lcTextField = document.createElement("input"); // lc = Location Container, Text field to accept location from user
        lcTextField.type = "text";
        lcTextField.placeholder = "Enter Location";
        lcTextField.classList.add("locationTextField");
        lcTextField.classList.add("borderColor");
        lcTextField.classList.add("cardBackground");
        applyThemeChange(lcTextField);
        const saveButton = document.createElement("div");
        saveButton.textContent = "+ Save";
        saveButton.classList.add("saveButton");
        locationContainerEl.removeChild(addLocationButton);
        locationContainerEl.appendChild(lcTextField);
        locationContainerEl.appendChild(saveButton);
        // Adding functionality to save Button
        saveButton.addEventListener("click", () => {
            const location = lcTextField.value.trim();
            if (location) {
                locationList.push(location);
                currentLocation = location;
                fetchWeatherData(location);
                closeDropDown();
                lcTextField.remove();
                saveButton.remove();
                isDroppedDown = false;
            }
            else {
                alert("Please enter a valid location name");
            }
        });
    });
}
// Update the time
function updateTime() {
    const now = new Date();
    let hourNum = now.getHours();
    if (hourNum > 12)
        hourNum %= 12;
    const hours = String(hourNum).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    getEL("#time").textContent = `${hours}:${minutes}:${seconds}`;
}
updateTime();
setInterval(updateTime, 1000);
// Theme Changes
let isLightTheme = true;
const switchTheme = getEL(".switchTheme");
switchTheme.addEventListener("click", () => {
    if (isLightTheme) {
        isLightTheme = false;
        document.documentElement.style.setProperty("--text-color", "#9CA3AF");
        getEL("body").style.backgroundColor = "#111827";
        getAllEL(".borderColor").forEach((element) => {
            element.style.border = "3px solid #374151";
        });
        getAllEL(".cardBackground").forEach((element) => {
            element.style.backgroundColor = "#1F2937";
        });
        getAllEL(".hoverColor").forEach((element) => {
            element.addEventListener("mouseover", () => {
                element.style.backgroundColor = "#4B5563";
            });
            element.addEventListener("mouseout", () => {
                element.style.backgroundColor = "#1F2937";
            });
        });
        getAllEL(".primaryText").forEach((element) => {
            element.style.color = "#F9FAFB";
        });
    }
    else {
        isLightTheme = true;
        document.documentElement.style.setProperty("--text-color", "#4b5563");
        getEL("body").style.backgroundColor = "white";
        getAllEL(".borderColor").forEach((element) => {
            element.style.border = "3px solid #e5e7eb";
        });
        getAllEL(".cardBackground").forEach((element) => {
            element.style.backgroundColor = "white";
        });
        getAllEL(".hoverColor").forEach((element) => {
            element.addEventListener("mouseover", () => {
                element.style.backgroundColor = "#e4e6e9";
            });
            element.addEventListener("mouseout", () => {
                element.style.backgroundColor = "white";
            });
        });
        getAllEL(".primaryText").forEach((element) => {
            element.style.color = "#1f2937";
        });
    }
});
function applyThemeChange(el) {
    if (!isLightTheme) {
        el.style.backgroundColor = "#1F2937";
        el.addEventListener("mouseover", () => {
            el.style.backgroundColor = "#4B5563";
        });
        el.addEventListener("mouseout", () => {
            el.style.backgroundColor = "#1F2937";
        });
    }
    else {
        el.style.backgroundColor = "white";
        el.addEventListener("mouseover", () => {
            el.style.backgroundColor = "#e4e6e9";
        });
        el.addEventListener("mouseout", () => {
            el.style.backgroundColor = "white";
        });
    }
}

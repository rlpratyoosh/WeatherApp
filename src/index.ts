// Check for return of the NULL
function getEL<T extends HTMLElement>(query: string): T {
  const el = document.querySelector(query);
  if (!el) throw new Error(`Element ${query} not foud`);
  return el as T;
}

function getAllEL<T extends HTMLElement>(query: string): NodeListOf<T> {
  const el = document.querySelectorAll(query);
  if (!el) throw new Error(`Element ${query} not foud`);
  return el as NodeListOf<T>;
}

// Weather Card Variables
const weatherCardEl = getEL<HTMLElement>(".weatherCard");
const weatherIconEl = getEL<HTMLElement>(".weatherIcon");
const weatherNameEl = getEL<HTMLElement>(".weatherName");
const locationCardEl = getEL<HTMLElement>(".location-card");
const temperatureEl = getEL<HTMLElement>("#temperature");
const temperatureMaxEl = getEL<HTMLElement>("#temperatureMax");
const temperatureMinEl = getEL<HTMLElement>("#temperatureMin");
const humidityEl = getEL<HTMLElement>("#humidity");
const windSpeedEl = getEL<HTMLElement>("#windSpeed");
const theBigText = getEL<HTMLElement>(".theBigText");

const apikey = "5bc7fcf06595f85679f4829d33184ed5";

// Defining Weather Interfacaes
interface Weather {
  description: String;
  id: number;
}

interface Main {
  temp: number;
  temp_max: number;
  temp_min: number;
  humidity: number;
}

interface Wind {
  speed: number;
}

interface WeatherAPIResponse {
  weather: Weather[];
  main: Main;
  wind: Wind;
}

// Fetch Weather Datqa
async function fetchWeatherData(location: string): Promise<void> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}`
    );
    if (!response.ok) {
      throw new Error("Location not found");
    }
    const data: WeatherAPIResponse = await response.json();
    console.log(data); // For checking what's been returned to us
    updateWeatherData(data);
    updateLocation();
    showWeatherCard();
  } catch (error) {
    console.error("Error Fetching Weather Data:", error as string);
    theBigText.textContent = error as string;
    locationList.pop();
  } finally {
    console.log("Weather data fetch attempt completed successfully");
  }
}

// Capitalizing each word's first letter
function firstLetterCapitalize(target: String): String {
  let splitTarget: String[] = target.split(" "); // Storing each word seprataely
  let result: String[] = []; // Initializing the result array
  splitTarget.forEach((element) => {
    result.push(element[0].toUpperCase() + element.slice(1)); // Pushing each word's first letter capitalized
  });
  return result.join(" "); // Returning a joined string with a space
}

// Update Weather Card
function updateWeatherData(data: WeatherAPIResponse): void {
  // Getting arrays and object [First layer of data]
  const weatherData: Weather = data.weather[0];
  const mainTemperatureInfo: Main = data.main;
  const windInfo: Wind = data.wind;

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
  weatherNameEl.textContent = weatherName as string;
  temperatureEl.textContent = `${temperatureValue}°C`;
  temperatureMaxEl.textContent = `${maxTemperatureValue}°C`;
  temperatureMinEl.textContent = `${minTemperatureValue}°C`;
  humidityEl.textContent = `${humidityValue}%`;
  windSpeedEl.textContent = `${windSpeedValue}m/s`;
}

// Weather Icon Function
function getWeatherIcon(id: number): string {
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
function showWeatherCard(): void {
  weatherCardEl.style.display = "flex"; // Show the Weather Card
  theBigText.style.display = "none"; // Hiding the heading
}

// Location Drop Down Variables
const locationContainerEl = getEL<HTMLElement>(".location");
// lc = Location Container
const lcHeadText = getEL<HTMLElement>(".chooseLocation"); // For avoiding closing of dropdown when clicking anywhere on it.
const locationOnCard = getEL<HTMLElement>(".location-card");

let locationList: string[] = [];
let currentLocation: string;
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

function dropDownLocation(): void {
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
  } else {
    closeDropDown();
  }
}

function closeDropDown(): void {
  const children = locationContainerEl.querySelectorAll(".elem");
  children.forEach((child) => {
    child.remove();
  });
  locationContainerEl.style.boxShadow = "2px 3px 5px rgba(0, 0, 0, 0.4)";
  isDroppedDown = false;
}

// Function for adding elements to the LC = Location Container
function addThisElemToLC(text: string): HTMLElement {
  const el = document.createElement("span") as HTMLElement;
  el.classList.add("elem");
  el.classList.add("cardBackground");
  el.classList.add("hoverColor");
  applyThemeChange(el);
  el.textContent = text;
  return el;
}

// Function for adding location when clicking on Add Location
function addLocationFunction(): void {
  const addLocationButton = getEL<HTMLElement>("#addLocationButton");
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
      } else {
        alert("Please enter a valid location name");
      }
    });
  });
}

// Update the time
function updateTime() {
  const now = new Date();
  let hourNum = now.getHours();
  if (hourNum > 12) hourNum %= 12;
  const hours = String(hourNum).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  getEL<HTMLElement>("#time").textContent = `${hours}:${minutes}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);

// Theme Changes

let isLightTheme = true;

const switchTheme = getEL<HTMLElement>(".switchTheme");

switchTheme.addEventListener("click", () => {
  if (isLightTheme) {
    isLightTheme = false;
    document.documentElement.style.setProperty("--text-color", "#9CA3AF");
    getEL<HTMLElement>("body").style.backgroundColor = "#111827";

    getAllEL<HTMLElement>(".borderColor").forEach((element) => {
      element.style.border = "3px solid #374151";
    });

    getAllEL<HTMLElement>(".cardBackground").forEach((element) => {
      element.style.backgroundColor = "#1F2937";
    });

    getAllEL<HTMLElement>(".hoverColor").forEach((element) => {
      element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "#4B5563";
      });
      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "#1F2937";
      });
    });

    getAllEL<HTMLElement>(".primaryText").forEach((element) => {
      element.style.color = "#F9FAFB";
    });
  } else {
    isLightTheme = true;

    document.documentElement.style.setProperty("--text-color", "#4b5563");
    getEL<HTMLElement>("body").style.backgroundColor = "white";

    getAllEL<HTMLElement>(".borderColor").forEach((element) => {
      element.style.border = "3px solid #e5e7eb";
    });

    getAllEL<HTMLElement>(".cardBackground").forEach((element) => {
      element.style.backgroundColor = "white";
    });

    getAllEL<HTMLElement>(".hoverColor").forEach((element) => {
      element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "#e4e6e9";
      });
      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "white";
      });
    });

    getAllEL<HTMLElement>(".primaryText").forEach((element) => {
      element.style.color = "#1f2937";
    });
  }
});

function applyThemeChange(el: HTMLElement): void {
  if (!isLightTheme) {
    el.style.backgroundColor = "#1F2937";
    el.addEventListener("mouseover", () => {
      el.style.backgroundColor = "#4B5563";
    });
    el.addEventListener("mouseout", () => {
      el.style.backgroundColor = "#1F2937";
    });
  } else {
    el.style.backgroundColor = "white";
    el.addEventListener("mouseover", () => {
      el.style.backgroundColor = "#e4e6e9";
    });
    el.addEventListener("mouseout", () => {
      el.style.backgroundColor = "white";
    });
  }
}

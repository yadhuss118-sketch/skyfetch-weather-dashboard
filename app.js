// ===============================
// Weather App Constructor
// ===============================

function WeatherApp() {
  this.apiKey = "a00f1e258c7a991156723fcaf9cff187";

  this.searchInput = document.getElementById("city-input");
  this.searchBtn = document.getElementById("search-btn");
  this.weatherContainer = document.getElementById("weather-container");
  this.forecastContainer = document.getElementById("forecast-container");

  this.recentContainer = document.getElementById("recent-container");
  this.clearBtn = document.getElementById("clear-history");

  this.recentSearches = [];

  this.init();
}

// ===============================
// INIT METHOD
// ===============================

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", () => {
    const city = this.searchInput.value.trim();
    if (city !== "") {
      this.getWeather(city);
    }
  });

  this.loadRecentSearches();
  this.loadLastCity();

  this.clearBtn.addEventListener("click", () => {
    this.clearHistory();
  });
};

// ===============================
// FETCH WEATHER
// ===============================

WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.weatherContainer.innerHTML = "<p>Loading...</p>";
    this.forecastContainer.innerHTML = "";

    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL)
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    this.displayWeather(weatherData);
    this.displayForecast(forecastData);

    // Save search only if successful
    this.saveRecentSearch(city);

  } catch (error) {
    this.weatherContainer.innerHTML =
      "<p style='color:red;'>City not found</p>";
  }
};

// ===============================
// DISPLAY CURRENT WEATHER
// ===============================

WeatherApp.prototype.displayWeather = function (data) {
  const html = `
    <h2>${data.name}</h2>
    <p>${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;

  this.weatherContainer.innerHTML = html;
};

// ===============================
// DISPLAY FORECAST (5 DAYS)
// ===============================

WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach(day => {
    const div = document.createElement("div");
    div.classList.add("forecast-card");

    div.innerHTML = `
      <p>${new Date(day.dt_txt).toDateString()}</p>
      <p>${day.main.temp} °C</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
      <p>${day.weather[0].description}</p>
    `;

    this.forecastContainer.appendChild(div);
  });
};

// ===============================
// LOAD RECENT SEARCHES
// ===============================

WeatherApp.prototype.loadRecentSearches = function () {
  const stored = localStorage.getItem("recentSearches");

  if (stored) {
    this.recentSearches = JSON.parse(stored);
    this.displayRecentSearches();
  }
};

// ===============================
// SAVE RECENT SEARCH
// ===============================

WeatherApp.prototype.saveRecentSearch = function (city) {

  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  // Remove duplicates
  this.recentSearches = this.recentSearches.filter(
    item => item !== city
  );

  // Add to front
  this.recentSearches.unshift(city);

  // Keep only 5
  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(this.recentSearches)
  );

  localStorage.setItem("lastCity", city);

  this.displayRecentSearches();
};

// ===============================
// DISPLAY RECENT SEARCH BUTTONS
// ===============================

WeatherApp.prototype.displayRecentSearches = function () {

  this.recentContainer.innerHTML = "";

  this.recentSearches.forEach(function (city) {

    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentContainer.appendChild(btn);

  }.bind(this));
};

// ===============================
// AUTO LOAD LAST CITY
// ===============================

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    this.getWeather(lastCity);
  }
};

// ===============================
// CLEAR HISTORY
// ===============================

WeatherApp.prototype.clearHistory = function () {

  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");

  this.recentSearches = [];
  this.displayRecentSearches();
};

// ===============================
// START APP
// ===============================

new WeatherApp();
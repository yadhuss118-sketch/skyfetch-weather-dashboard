// ===============================
// WeatherApp Constructor
// ===============================
function WeatherApp() {
  this.apiKey = "YOUR_API_KEY"; // 🔁 Replace with your API key

  // Store DOM references
  this.searchInput = document.getElementById("searchInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.weatherContainer = document.getElementById("weatherContainer");
}

// ===============================
// Initialize App
// ===============================
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.showWelcome();
};

// ===============================
// Show Welcome Message
// ===============================
WeatherApp.prototype.showWelcome = function () {
  this.weatherContainer.innerHTML = `
    <h2>Welcome to SkyFetch 🌤</h2>
    <p>Search for a city to see the weather forecast.</p>
  `;
};

// ===============================
// Handle Search
// ===============================
WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();

  if (city === "") {
    this.showError("Please enter a city name.");
    return;
  }

  this.getWeather(city);
};

// ===============================
// Fetch Weather + Forecast
// ===============================
WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

  try {
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

    const processedForecast = this.processForecastData(forecastData);
    this.displayForecast(processedForecast);

  } catch (error) {
    this.showError("City not found. Please try again.");
  }
};

// ===============================
// Display Current Weather
// ===============================
WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <div class="current-weather">
      <h2>${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
      <h3>${data.main.temp}°C</h3>
      <p>${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    </div>
  `;
};

// ===============================
// Process Forecast (40 → 5)
// ===============================
WeatherApp.prototype.processForecastData = function (data) {
  const daily = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  return daily.slice(0, 5);
};

// ===============================
// Display Forecast Cards
// ===============================
WeatherApp.prototype.displayForecast = function (forecast) {
  let html = `<div class="forecast-container">`;

  forecast.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long"
    });

    html += `
      <div class="forecast-card">
        <h3>${dayName}</h3>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
        <h4>${day.main.temp}°C</h4>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });

  html += `</div>`;

  this.weatherContainer.innerHTML += html;
};

// ===============================
// Show Loading
// ===============================
WeatherApp.prototype.showLoading = function () {
  this.weatherContainer.innerHTML = `<p>Loading weather data...</p>`;
};

// ===============================
// Show Error
// ===============================
WeatherApp.prototype.showError = function (message) {
  this.weatherContainer.innerHTML = `<p style="color:red;">${message}</p>`;
};

// ===============================
// Create App Instance
// ===============================
const app = new WeatherApp();
app.init();
const apiKey = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weather-container");

// Async function
async function getWeather(city) {

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    showLoading();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        displayWeather(data);
    } 
    catch (error) {
        showError("City not found. Please try again.");
    }
}

// Display weather
function displayWeather(data) {
    weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Condition: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    `;
}

// Show error
function showError(message) {
    weatherContainer.innerHTML = `
        <p class="error">${message}</p>
    `;
}

// Show loading
function showLoading() {
    weatherContainer.innerHTML = `
        <p class="loading">Loading...</p>
    `;
}

// Button click event
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();
    getWeather(city);
    cityInput.value = "";
});

// Enter key support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Default city on load
getWeather("London");
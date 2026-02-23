const apiKey = "a00f1e258c7a991156723fcaf9cff187";

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(url)
    .then(function (response) {
      const data = response.data;
      displayWeather(data);
      console.log(data);
    })
    .catch(function (error) {
      console.error("Error fetching weather:", error);
    });
}

function displayWeather(data) {
  document.getElementById("city").textContent = data.name;

  document.getElementById("temperature").textContent =
    `Temperature: ${data.main.temp} °C`;

  document.getElementById("description").textContent =
    `Condition: ${data.weather[0].description}`;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  document.getElementById("icon").src = iconUrl;
}

// Hardcoded city for Part 1
getWeather("Paris");
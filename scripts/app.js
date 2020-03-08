// Key for OpenWeatherMap API.
const key = "394b32491bca57d90bee2340d117b3df";

// Weather object to store attributes.
let weather = {};
weather.temperature = { units: "fahrenheit" };

// Elements.
const notificationEl = document.querySelector(".notification");
const iconEl = document.querySelector(".icon");
const tempValEl = document.querySelector(".temperature-val");
const descriptionEl = document.querySelector(".description");
const locationEl = document.querySelector(".location");

// Set position--latitude and longitude.
const setPosition = position => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeather(lat, lon);
};

// Attain current weather using geographic coordinates.
const getWeather = (latitude, longitude) => {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  console.log(`API=${api}`);
  fetch(api)
    .then(
      // Get weather JSON-formatted data from the API.
      res => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          console.log(`${api}`);
          throw Error(res.statusText);
        }
      }
    )
    .then(data => {
      weather.temperature.value = Math.floor(
        ((data.main.temp - 273.15) * 9) / 5 + 32
      );
      weather.description = data.weather[0].description;
      weather.icon = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(() => {
      displayWeather();
    })
    .catch(error => alert(error.message));
};

// Function used to display the weather by updating DOM.
const displayWeather = () => {
  iconEl.innerHTML = `<img src="weatherIcons/black/${weather.icon}.png"/>`;
  tempValEl.innerHTML = `<p>${weather.temperature.value} °F</p>`;
  descriptionEl.innerHTML = `<p>${weather.description}</p>`;
  locationEl.innerHTML = `<p>${weather.city}, ${weather.country}</p>`;
};

// Error Handler used when geolocation cannot be retrieved.
const errorHandler = error => {
  notificationEl.innerHTML = `<p>${error.message}</p>`;
  console.log(`${error.message}`);
};

// Use geolocation API to setup location.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setPosition, errorHandler);
} else {
  notificationEl.innerHTML = `<p>Geolocation not supported by browser.</p>`;
}

// Add event listener to change temperature unit.
tempValEl.addEventListener("click", () => {
  if (weather.temperature.value === "undefined") return;

  if (weather.temperature.units === "fahrenheit") {
    let celsiusVal = Math.floor(((weather.temperature.value - 32) * 5) / 9);
    weather.temperature.units = "celsius";

    tempValEl.innerHTML = `<p>${celsiusVal} °C</p>`;
  } else {
    weather.temperature.units = "fahrenheit";
    tempValEl.innerHTML = `<p>${weather.temperature.value} °F</p>`;
  }
});

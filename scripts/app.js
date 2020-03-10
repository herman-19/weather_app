// Key for OpenWeatherMap API.
const key = "394b32491bca57d90bee2340d117b3df";

// Weather object to store attributes.
let weather = {};
weather.temperature = { units: "fahrenheit" };

// Elements.
const backdropEl = document.getElementById("backdrop");
const notificationEl = document.querySelector(".notification");
const iconEl = document.querySelector(".icon");
const tempValEl = document.querySelector(".temperature-val");
const descriptionEl = document.querySelector(".description");
const locationEl = document.querySelector(".location");
const changeLocationModalEl = document.getElementById("change-location-modal");
const changeLocationButtonEl = document.getElementById("location-button");
const userInput = changeLocationModalEl.querySelectorAll("input");
const cancelBtnEl = document.getElementById("btn-passive");
const submitBtnEl = document.getElementById("btn-success");

// Set position--latitude and longitude.
const setPosition = position => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeather(lat, lon);
};

// Function used to handle response.
const handleResponse = res => {
  if (res.status >= 200 && res.status <= 299) {
    return res.json();
  } else {
    console.log(`${api}`);
    throw Error(res.statusText);
  }
};

// Function used to set weather object properties.
const setWeatherAttributes = data => {
  weather.temperature.value = Math.floor(
    ((data.main.temp - 273.15) * 9) / 5 + 32
  );
  weather.description = data.weather[0].description;
  weather.icon = data.weather[0].icon;
  weather.city = data.name;
  weather.country = data.sys.country;
};

// Function used to display the weather by updating DOM.
const displayWeather = () => {
  iconEl.innerHTML = `<img src="weatherIcons/black/${weather.icon}.png"/>`;
  tempValEl.innerHTML = `<p>${weather.temperature.value} °F</p>`;
  descriptionEl.innerHTML = `<p>${weather.description}</p>`;
  locationEl.innerHTML = `<p>${weather.city}, ${weather.country}</p>`;
};

const clearUserInputs = () => {
  for (const input of userInput) {
    input.value = "";
  }
};

// Attain current weather using geographic coordinates.
const getWeather = (latitude, longitude) => {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  console.log(`API=${api}`);
  fetch(api)
    .then(
      // Get weather JSON-formatted data from the API.
      handleResponse
    )
    .then(
      // Parse data to set weather attributes.
      setWeatherAttributes
    )
    .then(() => {
      displayWeather();
    })
    .catch(error => alert(error.message));
};

// Error Handler used when geolocation cannot be retrieved.
const errorHandler = error => {
  notificationEl.innerHTML = `<p>${error.message}</p>`;
  console.log(`${error.message}`);
};

// Make backdrop visible.
const showBackdrop = () => {
  backdropEl.classList.add("visible");
};

// Make backdrop invisible.
const hideBackdrop = () => {
  backdropEl.classList.remove("visible");
};

// Event listeners.
// Event listener to change temperature unit.
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

// When this button is clicked, show the modal for location input.
changeLocationButtonEl.addEventListener("click", () => {
  showBackdrop();
  changeLocationModalEl.classList.add("visible");
});

// When visible backdrop is clicked, remove it, and close the modal.
backdropEl.addEventListener("click", () => {
  hideBackdrop();
  changeLocationModalEl.classList.remove("visible");
});

// When cancel button is clicked, close modal and hide backdrop.
cancelBtnEl.addEventListener("click", () => {
  hideBackdrop();
  changeLocationModalEl.classList.remove("visible");
  clearUserInputs();
});

// Consume the location value entered and update weather displayed.
submitBtnEl.addEventListener("click", () => {
  const locationValue = userInput[0].value;
  if (locationValue.trim() === "") {
    alert("Please enter the name of a city.");
    return;
  } else {
    // Fetch new data.
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${locationValue}&appid=${key}`;
    console.log(`API [Weather by City Name]=${api}`);

    fetch(api)
      .then(
        // Get weather JSON-formatted data from the API.
        handleResponse
      )
      .then(
        // Parse data to set weather attributes.
        setWeatherAttributes
      )
      .then(() => {
        displayWeather();
      })
      .catch(() => {
        alert("City name provided is invalid.");
      });

    hideBackdrop();
    changeLocationModalEl.classList.remove("visible");
    clearUserInputs();
  }
});

/// This is where it all starts.
// Use geolocation API to setup location.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setPosition, errorHandler);
} else {
  notificationEl.innerHTML = `<p>Geolocation not supported by browser.</p>`;
}

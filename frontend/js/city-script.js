const API_URL = "https://nwpe0mn5a6.execute-api.us-east-1.amazonaws.com/prod/weather";

// DOM elements
const cityHeading = document.getElementById('cityHeading');
const avgTempEl = document.getElementById('avg-temp');
const avgHumEl = document.getElementById('avg-humidity');
const avgPressureEl = document.getElementById('avg-pressure');
const lastUpdateEl = document.getElementById('last-update');
const photoEl = document.getElementById('photo');
const datePicker = document.getElementById('datePicker');
const timeSlider = document.getElementById('timeSlider');
const sliderValue = document.getElementById('sliderValue');

// Get city from URL
const params = new URLSearchParams(window.location.search);
const cityName = params.get('city') || 'Vienna';
cityHeading.textContent = cityName;

/**
 * Fetch weather data for city + filters
 */
async function fetchWeather(city, date = '', hour = '') {
  try {
    let url = `${API_URL}?city=${encodeURIComponent(city)}`;
    if (date) url += `&date=${date}`;
    if (hour !== '') url += `&hour=${hour}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Display averages
    avgTempEl.textContent = data.avg_temp !== null ? `${data.avg_temp}°C` : "--";
    avgHumEl.textContent = data.avg_hum !== null ? `${data.avg_hum}%` : "--";
    avgPressureEl.textContent = data.avg_pressure !== null ? `${data.avg_pressure} hPa` : "--";
    lastUpdateEl.textContent = data.last_update ? `Last DB Entry: ${new Date(data.last_update).toLocaleString()}` : "No records found";

    // Display photo
    if (data.image_url) {
      photoEl.src = data.image_url;
      photoEl.alt = `${city} at ${date} ${hour}:00`;
    } else {
      photoEl.src = '';
      photoEl.alt = "No photo available";
    }

  } catch (err) {
    console.error("Fetch error:", err);
    avgTempEl.textContent = avgHumEl.textContent = avgPressureEl.textContent = "--";
    lastUpdateEl.textContent = "Error fetching data";
    photoEl.src = '';
    photoEl.alt = "No photo";
  }
}

// Handle date & time changes
function updateUIAndFetch() {
  const selectedDate = datePicker.value;
  const selectedHour = timeSlider.value;
  sliderValue.textContent = `${String(selectedHour).padStart(2,'0')}:00`;

  fetchWeather(cityName, selectedDate, selectedHour);
}

// Event listeners
datePicker.addEventListener('change', updateUIAndFetch);
timeSlider.addEventListener('input', () => {
  sliderValue.textContent = `${String(timeSlider.value).padStart(2,'0')}:00`;
});
timeSlider.addEventListener('change', updateUIAndFetch);

// Initialization
(function init() {
  const today = new Date().toISOString().split('T')[0];
  datePicker.value = today;
  timeSlider.value = 12;
  sliderValue.textContent = "12:00";

  // Initial fetch
  updateUIAndFetch();
})();

// Optional: auto-refresh every 10s
setInterval(updateUIAndFetch, 10000);

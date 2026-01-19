// 1. Configuration
const API_URL = "https://nwpe0mn5a6.execute-api.us-east-1.amazonaws.com/prod/weather";

// 2. Get city from URL
const params = new URLSearchParams(window.location.search);
const cityName = params.get('city') || 'Vienna';

// 3. DOM Elements
const cityHeading = document.getElementById('cityHeading');
const pageTitle = document.getElementById('pageTitle');
const datePicker = document.getElementById('datePicker');
const timeSlider = document.getElementById('timeSlider');
const sliderValue = document.getElementById('sliderValue');

// Update page headers immediately
cityHeading.textContent = cityName;
if (pageTitle) pageTitle.textContent = `${cityName} - The Weather Archive`;

/**
 * Enhanced Fetch: Now handles filters for Date and Hour
 */
async function fetchWeatherData(city, date = '', hour = '') {
  try {
    console.log(`Fetching data for: ${city} | Date: ${date} | Hour: ${hour}`);

    // Build URL with query parameters
    let url = `${API_URL}?city=${encodeURIComponent(city)}`;
    if (date) url += `&date=${date}`;
    if (hour !== '') url += `&hour=${hour}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log("Data received from AWS:", data);

    const tempEl = document.getElementById('avg-temp');
    const humEl = document.getElementById('avg-humidity');
    const updateEl = document.getElementById('last-update');

    // Update UI if data exists, otherwise show fallback
    if (data.avg_temp !== undefined && data.avg_temp !== null) {
      if (tempEl) tempEl.textContent = `${data.avg_temp}°C`;
      if (humEl) humEl.textContent = `${data.avg_hum}%`;
      if (updateEl) {
        const dateObj = new Date(data.last_update).toLocaleString();
        updateEl.textContent = `Last DB Entry: ${dateObj}`;

        // Visual feedback: briefly highlight the timestamp on update
        updateEl.style.transition = "color 0.3s ease";
        updateEl.style.color = "#007bff";
        setTimeout(() => { updateEl.style.color = "#666"; }, 1000);
      }
    } else {
      // No data found for this specific filter
      if (tempEl) tempEl.textContent = "--";
      if (humEl) humEl.textContent = "--";
      if (updateEl) updateEl.textContent = "No records found for this selection.";
    }

  } catch (error) {
    console.error("Error fetching from API:", error);
  }
}

/**
 * UI Controls Logic
 */
function updateUIAndFetch() {
  const selectedDate = datePicker.value;
  const selectedHour = timeSlider.value;

  // Update the text next to the slider (e.g., "14:00")
  sliderValue.textContent = `${String(selectedHour).padStart(2, '0')}:00`;

  // Trigger fetch with filters
  fetchWeatherData(cityName, selectedDate, selectedHour);
}

// Event Listeners for filters
datePicker.addEventListener('change', updateUIAndFetch);
timeSlider.addEventListener('input', function () {
  // Just update the label while sliding for smoothness
  sliderValue.textContent = `${String(this.value).padStart(2, '0')}:00`;
});
timeSlider.addEventListener('change', updateUIAndFetch); // Fetch when user releases slider

/**
 * Initialization
 */
(function init() {
  // Set default date to today's date (formatted for the input)
  if (datePicker) {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
  }

  // Set default slider value
  timeSlider.value = 12;
  sliderValue.textContent = "12:00";

  // Initial fetch for today at 12:00
  updateUIAndFetch();
})();

// Auto-refresh data every 10 seconds to match the Python script
setInterval(() => {
  console.log("Auto-refreshing live data...");
  updateUIAndFetch();
}, 10000);
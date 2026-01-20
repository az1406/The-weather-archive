const API_URL = "https://h2rhyvpaj1.execute-api.us-east-1.amazonaws.com/prod/weather";

let weatherChart = null;

function renderPlot(hourlyData) {
  const canvas = document.getElementById('weatherChart');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  // Format labels to HH:00 and ensure temperature values are numbers
  const labels = hourlyData.map(d => `${String(d.hour).padStart(2, '0')}:00`);
  const temps = hourlyData.map(d => parseFloat(d.avg_temp));

  if (weatherChart) {
    weatherChart.destroy();
    weatherChart = null;
  }

  try {
    weatherChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Avg Temperature (°C)',
          data: temps,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#2980b9',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Temperature (°C)' }
          },
          x: {
            title: { display: true, text: 'Time (Hour)' }
          }
        }
      }
    });
    console.log('Chart rendered successfully');
  } catch (error) {
    console.error('Error creating chart:', error);
  }
}

async function fetchWeather(city, date, hour) {
  if (!city) return;
  console.log(`[${new Date().toLocaleTimeString()}] Fetching:`, city, date, hour);

  try {
    const res = await fetch(`${API_URL}?city=${city}&date=${date}&hour=${hour}`);
    const data = await res.json();

    const errorEl = document.getElementById("error-msg");

    if (data.error) {
      if (errorEl) {
        errorEl.textContent = data.error;
        errorEl.style.display = "block";
      }
      document.getElementById('cityHeading').textContent = "--";
      document.getElementById('avg-temp').textContent = "--";
      document.getElementById('avg-humidity').textContent = "--";
      document.getElementById('avg-pressure').textContent = "--";
      document.getElementById('photo').style.display = "none";
      document.getElementById('no-photo-msg').style.display = "block";
      if (weatherChart) weatherChart.destroy();
      return;
    } else if (errorEl) {
      errorEl.style.display = "none";
    }

    // 1. Update Stats
    document.getElementById('cityHeading').textContent = data.city || city;
    document.getElementById('avg-temp').textContent = data.avg_temp ? `${parseFloat(data.avg_temp).toFixed(1)}°C` : "--";
    document.getElementById('avg-humidity').textContent = data.avg_hum ? `${parseFloat(data.avg_hum).toFixed(1)}%` : "--";
    document.getElementById('avg-pressure').textContent = data.avg_pressure ? `${parseFloat(data.avg_pressure).toFixed(1)} hPa` : "--";

    // 2. Update Plot
    if (data.hourly_data && data.hourly_data.length > 0) {
      renderPlot(data.hourly_data);
    }

    // 3. Update Image
    const photoEl = document.getElementById('photo');
    const photoMsgEl = document.getElementById('no-photo-msg');

    if (data.image_url && data.image_url !== "") {
      // Clear previous image first to avoid caching issues
      photoEl.src = '';
      photoEl.style.display = 'none';

      // Add load and error handlers
      photoEl.onload = function () {
        console.log('Image loaded successfully:', data.image_url);
        photoEl.style.display = 'block';
        photoMsgEl.style.display = 'none';
      };

      photoEl.onerror = function () {
        console.error('Failed to load image:', data.image_url);
        photoEl.style.display = 'none';
        photoMsgEl.style.display = 'block';
        photoMsgEl.textContent = 'Failed to load snapshot for this hour.';
      };

      // Set crossorigin attribute if needed for CORS
      photoEl.crossOrigin = 'anonymous';

      // Add cache-busting timestamp to force reload
      const cacheBuster = `?t=${new Date().getTime()}`;
      photoEl.src = data.image_url + cacheBuster;
    } else {
      photoEl.src = '';
      photoEl.style.display = 'none';
      photoMsgEl.style.display = 'block';
      photoMsgEl.textContent = 'No snapshot available for this hour.';
    }

    // 4. Update Video
    const videoEl = document.getElementById('weather-video');
    const videoMsgEl = document.getElementById('no-video-msg');
    if (data.video_url && data.video_url !== "") {
      videoEl.onloadeddata = function () {
        console.log('Video loaded successfully:', data.video_url);
        videoEl.style.display = 'block';
        videoMsgEl.style.display = 'none';
      };

      videoEl.onerror = function () {
        console.error('Failed to load video:', data.video_url);
        videoEl.style.display = 'none';
        videoMsgEl.style.display = 'block';
        videoMsgEl.textContent = 'Failed to load timelapse for this date.';
      };

      const source = videoEl.querySelector('source');
      source.src = data.video_url;
      videoEl.load();
      videoEl.style.display = 'block';
      videoMsgEl.style.display = 'none';
    } else {
      videoEl.style.display = 'none';
      videoMsgEl.style.display = 'block';
      videoMsgEl.textContent = 'No timelapse available for this date.';
    }

  } catch (e) {
    console.error("Script Error:", e);
  }
}

const datePicker = document.getElementById('datePicker');
const timeSlider = document.getElementById('timeSlider');
const sliderValue = document.getElementById('sliderValue');

const params = new URLSearchParams(window.location.search);
const currentCity = params.get('city');

function update() {
  if (!currentCity) return;
  const hour = String(timeSlider.value).padStart(2, '0');
  sliderValue.textContent = `${hour}:00`;
  fetchWeather(currentCity, datePicker.value, timeSlider.value);
}

datePicker.addEventListener('change', update);
timeSlider.addEventListener('input', () => {
  sliderValue.textContent = `${String(timeSlider.value).padStart(2, '0')}:00`;
});
timeSlider.addEventListener('change', update);

window.onload = () => {
  if (!currentCity) {
    window.location.href = 'index.html';
    return;
  }

  const now = new Date();
  datePicker.value = now.toISOString().split('T')[0];
  timeSlider.value = now.getHours();
  update();
};
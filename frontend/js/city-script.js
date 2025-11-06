// Get city from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const cityName = urlParams.get('city') || 'Vienna';

// Set city heading and page title
document.getElementById('cityHeading').textContent = cityName;
document.getElementById('pageTitle').textContent = `${cityName} - The Weather Archive`;

// Date picker configuration
const datePicker = document.getElementById('datePicker');
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

// Set available date range (last 30 days)
datePicker.min = thirtyDaysAgo.toISOString().split('T')[0];
datePicker.max = today.toISOString().split('T')[0];
datePicker.value = today.toISOString().split('T')[0];

// Time slider configuration
const timeSlider = document.getElementById('timeSlider');
const sliderValue = document.getElementById('sliderValue');

// Update slider value display
timeSlider.addEventListener('input', function() {
    const hour = parseInt(this.value);
    sliderValue.textContent = `${hour.toString().padStart(2, '0')}:00`;
});

// Date picker change event
datePicker.addEventListener('change', function() {
    console.log(`Date changed to: ${this.value}`);
});

// Initialize slider value
sliderValue.textContent = '12:00';

console.log(`Loaded ${cityName}`);
console.log(`Date range: ${datePicker.min} to ${datePicker.max}`);




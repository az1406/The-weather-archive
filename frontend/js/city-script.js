
const params = new URLSearchParams(window.location.search);
const cityName = params.get('city') || 'Vienna';


const cityHeading = document.getElementById('cityHeading');
const pageTitle = document.getElementById('pageTitle');
const datePicker = document.getElementById('datePicker');
const timeSlider = document.getElementById('timeSlider');
const sliderValue = document.getElementById('sliderValue');


cityHeading.textContent = cityName;
pageTitle.textContent = `${cityName} - The Weather Archive`;


function setSlider(hour) {
  const h = Number.isFinite(hour) ? hour : 12;
  timeSlider.value = h;
  sliderValue.textContent = `${String(h).padStart(2, '0')}:00`;
}


datePicker.addEventListener('change', function() {

});

timeSlider.addEventListener('input', function() {
  setSlider(parseInt(this.value, 10));
});

// Init
(function init() {
  // Default date to today
  datePicker.value = new Date().toISOString().split('T')[0];
  setSlider(12);
})();

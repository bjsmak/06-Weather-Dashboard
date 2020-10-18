// Declare variables for buttons and inputting forecast information
var searchCity = $('#search-city');
var searchBtn = $('#search');
var clrBtn = $('#clear');
var currentCity = $('#current-city');
var currentTemp = $('#temp');
var currentHumidity = $('#humidity');
var currentWindSpeed = $('#windSpeed');
var currentUV = $('#uv-index');

console.log(currentCity);


//API function and AJAX call
$('#search').on('click',currentWeather);

//Empty string for search bar input
var city = '';
var currentDate = moment().format('L');
function currentWeather(city){
    city.preventDefault();
    city = searchCity.val().trim()

    var APIKey = 'd9d782c1cd9e6998f350625fd483e047';
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + '&APPID=' + APIKey;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){

        console.log(response);
        var weatherImg = response.weather[0].icon;
        $(currentCity).html(response.name + " " + currentDate);
        $(currentTemp).html(" " + response.main.temp + '\u00B0 F');
        $(currentHumidity).html(" " + response.main.humidity + '%');
        $(currentWindSpeed).html(" " + response.wind.speed + ' MPH');
})
}
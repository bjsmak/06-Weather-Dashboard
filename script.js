// Declare variables for buttons and inputting forecast information
var searchCity = $('#search-city');
var searchBtn = $('#search');
var clrBtn = $('#clear');
var currentCity = $('#current-city');
var currentTemp = $('#temp');
var currentHumidity = $('#humidity');
var currentWindSpeed = $('#windSpeed');
var currentUV = $('#uv-index');

//console.log(currentCity);
console.log(city);

reloadWeather();
//API function and AJAX call
$('#search').on('click', searchFunc);

//Empty string for search bar input
var city;
var cityList = [];


//Saves cities to local storage
function saveCities(){
    localStorage.setItem("currentCity", JSON.stringify(city));
    localStorage.setItem("citiesList", JSON.stringify(cityList));
}

//Reloads forecast from local storage
function reloadWeather(){
    var storedWeather = localStorage.getItem("currentCity");
    if (storedWeather !==  null){
        city = JSON.parse(storedWeather);
        currentWeather();
    }
}

//Adding previous searches as list elements
function cityListShow() {
    var listEl = $("<li>" + city + "</li>");
    $(listEl).attr('class','cityNames');
    $(listEl).attr('data-value',)
    $('.city-list').append(listEl);
}


//On initial button click stores city name into array
function searchFunc(event) {
    event.preventDefault();
    city = searchCity.val().trim()
    if (city === ""){
        alert("Please enter a city name");
    }
    else if (cityList.length >= 5){
        cityList.shift();
        cityList.push(city);
        saveCities();
        currentWeather();
        cityListShow();
    } else {
        cityList.push(city);
        saveCities();
        currentWeather();
        cityListShow();
    }
}



var currentDate = moment().format('L');
function currentWeather(){

    var APIKey = 'd9d782c1cd9e6998f350625fd483e047';
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + '&APPID=' + APIKey;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        //Displays current forecast info in the main card
        console.log(response);
        var weatherImg = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + weatherImg + ".png";
        $(currentCity).html(response.name + " " + currentDate + "<img src=" + iconURL + ">");
        $(currentTemp).html(" " + response.main.temp + '\u00B0 F');
        $(currentHumidity).html(" " + response.main.humidity + '%');
        $(currentWindSpeed).html(" " + response.wind.speed + ' MPH');

        //UV index values
        var ln = response.coord.lon;
        var lt = response.coord.lat;
        var uvIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
        $.ajax({
            url:uvIndex,
            method: 'GET'
        }).then(function(response){
            $(currentUV).html(response.value);
        })

        var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial' + '&appid=' + APIKey;
        $.ajax({
            url: forecastURL,
            method: 'GET'
        }).then(function(response){
            console.log(response);
            for (i = 0; i < 5; i++){
                //Forecast data goes by increments of 3 hours for 5 days, loop needs to calculate to end up on 24 hours
                var weatherImg = response.list[i*8].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + weatherImg + ".png";
                var futureTemp = response.list[i*8].main.temp;
                var futureHumidity = response.list[i*8].main.humidity;
                var futureDate = moment().add(i+1, 'days').calendar();
    
                $('#date'+ i).html(futureDate);
                $('#img'+ i).html("<img src=" + iconURL + ">");
                $('#temp'+ i).html(' ' + futureTemp + '\u00B0 F')
                $('#humidity'+ i).html(' ' + futureHumidity + '%');
    
            }
        })
})
}

//Clear search history
$(clrBtn).on('click', function(event){
    event.preventDefault();
    $("ul").empty();
})

//Allowing past searches to be clicked and used as searches
$("li.cityNames").click(function(){
    city = $(this).html();
    currentWeather();
    console.log(city);
    })
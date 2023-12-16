// HTML variables
let citySearch = document.querySelector('#location-search')
let searchBtn = document.querySelector('#search-btn')
let cityHeading = document.querySelector('#city-heading')
let currentSearch = document.querySelector('#current-search')
let searchHistory = document.querySelector('#search-history')

// Global variables
const apiKey = '1284e3141b908b2ddb6ae4a7e4193178'
let city = ''
let searchResults = []
let searchStorage = JSON.parse(localStorage.getItem("search-storage")) || [];

// Initializing function
function init(){
    if(searchStorage!=''){
        updateSearchHistory()
    }
}
init()

// Event listener for the search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if(citySearch.value!=''){
        city = citySearch.value
        getWeather()
    }
})

// Grab weather data from Open Weather API
async function getWeather(){
    // Clear searchResults
    searchResults = []

    // Get the current weather conditions and assign them to searchResults
    let current = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
    let currentWeather = await current.json()
    searchResults.push(currentWeather)

    // Get the future weather conditions and assign them to searchResults
    let future = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
    let futureWeather = await future.json()
    searchResults.push(futureWeather)

    // Trigger follow-on functions
    updateDisplay()
    if(searchStorage.includes(searchResults[0].name)){
        console.log('City already in search history')
    }else{
        updateSearchHistory()
    }
}

// Update display with weather data
function updateDisplay(){
    // Function variables
    let futureList = searchResults[1].list
    
    // Update city name to match the search
    cityHeading.innerHTML = searchResults[0].name
    // Reset the current search field
    currentSearch.innerHTML = ''

    // Add current weather conditions to the display
    // Create HTML elements
    let card = document.createElement('div')
    card.setAttribute('class', 'card bg-primary text-light')
    card.setAttribute('style','width: 13rem')
    let cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body text-center')
    let cardDate = document.createElement('h5')
    cardDate.innerHTML = dayjs().format('YYYY-MM-DD')
    let weatherIcon = document.createElement('img')
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${searchResults[0].weather[0].icon}@2x.png`)
    weatherIcon.setAttribute('alt', 'Weather icon')
    let temp = document.createElement('p')
    temp.innerHTML = `Temperature: ${searchResults[0].main.temp}°F`
    let humidity = document.createElement('p')
    humidity.innerHTML = `Humidity: ${searchResults[0].main.humidity}`
    let windSpeed = document.createElement('p')
    windSpeed.innerHTML = `Wind Speed: ${searchResults[0].wind.speed}`
    // Append HTML elements
    cardBody.append(cardDate, weatherIcon, temp, humidity, windSpeed)
    card.append(cardBody)
    currentSearch.append(card)

    // Add future weather conditions to the display
    for(i=0;i<futureList.length;i++){
        if(futureList[i].dt_txt.includes('12:00:00')){
            // Create HTML elements
            let card = document.createElement('div')
            card.setAttribute('class', 'card bg-secondary text-light')
            card.setAttribute('style','width: 13rem')
            let cardBody = document.createElement('div')
            cardBody.setAttribute('class', 'card-body text-center')
            let cardDate = document.createElement('h5')
            cardDate.innerHTML = futureList[i].dt_txt.slice(0,-9)
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${futureList[i].weather[0].icon}@2x.png`)
            weatherIcon.setAttribute('alt', 'Weather icon')
            let temp = document.createElement('p')
            temp.innerHTML = `Temperature: ${futureList[i].main.temp}°F`
            let humidity = document.createElement('p')
            humidity.innerHTML = `Humidity: ${futureList[i].main.humidity}`
            let windSpeed = document.createElement('p')
            windSpeed.innerHTML = `Wind Speed: ${futureList[i].wind.speed}`
            // Append HTML elements
            cardBody.append(cardDate, weatherIcon, temp, humidity, windSpeed)
            card.append(cardBody)
            currentSearch.append(card)
        }
    }
}

// Update search history display and local storage
function updateSearchHistory(){
    // Add new search to the storage array and local storage
    if(searchResults!=''){
        searchStorage.unshift(searchResults[0].name)
        searchStorage.splice(5)
        localStorage.setItem('search-storage', JSON.stringify(searchStorage))
    }

    // Clear the search history field before repopulating
    searchHistory.innerHTML = ''

    // Add search history to the display
    for(i=0;i<searchStorage.length;i++){
        // Create HTML elements
        let historyBtn = document.createElement('button')
        historyBtn.setAttribute('type','button')
        historyBtn.setAttribute('class','btn btn-secondary m-1')
        historyBtn.addEventListener('click', (e) => {
            e.preventDefault()
            city = e.target.innerHTML
            getWeather()
        })
        historyBtn.innerHTML = searchStorage[i]
        // Append HTML elements
        searchHistory.append(historyBtn)
    }
}
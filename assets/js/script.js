// HTML variables
let locationSearch = document.querySelector('#location-search')
let searchBtn = document.querySelector('#search-btn')
let cityHeading = document.querySelector('#city-heading')
let currentSearch = document.querySelector('#current-search')

const apiKey = '1284e3141b908b2ddb6ae4a7e4193178'
let city = ''
let searchResults = {}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('addEventListener ran')
    if(locationSearch.value!=''){
        city = locationSearch.value
        getWeather()
    }
})

async function getWeather(){
    let result = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    let text = await result.json()
    searchResults = text
    console.log(text)
    console.log(searchResults)
    cityHeading.innerHTML = text.city.name
    createWeatherBlocks()
}

async function createWeatherBlocks(){
    let card = document.createElement('div')
    card.setAttribute('class', 'card flex-fill bg-secondary text-light')
    let cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body text-center')
    let cardDate = document.createElement('h5')
    cardDate.innerHTML = searchResults.list[0].dt_txt
    let cardDay = document.createElement('h6')
    let weatherIcon = document.createElement('img')
    weatherIcon.setAttribute('src', '')
    weatherIcon.setAttribute('alt', 'Weather icon')
    let tempHigh = document.createElement('p')
    let tempLow = document.createElement('p')
    let humidity = document.createElement('p')
    let windSpeed = document.createElement('p')

    cardBody.append(cardDate, cardDay, weatherIcon, tempHigh, tempLow, humidity, windSpeed)
    card.append(cardBody)
    currentSearch.append(card)
}
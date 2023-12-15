// HTML variables
let locationSearch = document.querySelector('#location-search')
let searchBtn = document.querySelector('#search-btn')
let cityHeading = document.querySelector('#city-heading')
let currentSearch = document.querySelector('#current-search')

const apiKey = '1284e3141b908b2ddb6ae4a7e4193178'
let city = ''
let searchResults = {}
let today = dayjs().format('YYYY-MM-DD')

console.log(today)

searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if(locationSearch.value!=''){
        city = locationSearch.value
        getWeather()
    }
})

async function getWeather(){
    let result = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
    let text = await result.json()
    searchResults = text
    console.log(searchResults)
    cityHeading.innerHTML = searchResults.city.name
    createWeatherBlocks()
}

async function createWeatherBlocks(){
    for(i=0;i<searchResults.list.length;i++){
        if(searchResults.list[i].dt_txt.includes('12:00:00')){
            console.log(`Date: ${searchResults.list[i].dt_txt} High: ${searchResults.list[i].main.temp_max}`)
            let card = document.createElement('div')
            card.setAttribute('class', 'card flex-fill bg-secondary text-light')
            let cardBody = document.createElement('div')
            cardBody.setAttribute('class', 'card-body text-center')
            let cardDate = document.createElement('h5')
            cardDate.innerHTML = searchResults.list[i].dt_txt.slice(0,-9)
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${searchResults.list[i].weather[0].icon}@2x.png`)
            weatherIcon.setAttribute('alt', 'Weather icon')
            let tempHigh = document.createElement('p')
            tempHigh.innerHTML = `High: ${searchResults.list[i].main.temp_max}`
            let tempLow = document.createElement('p')
            tempLow.innerHTML = `Low: ${searchResults.list[i].main.temp_min}`
            let humidity = document.createElement('p')
            humidity.innerHTML = `Humidity: ${searchResults.list[i].main.humidity}`
            let windSpeed = document.createElement('p')
            windSpeed.innerHTML = `Wind Speed: ${searchResults.list[i].wind.speed}`

            cardBody.append(cardDate, weatherIcon, tempHigh, tempLow, humidity, windSpeed)
            card.append(cardBody)
            currentSearch.append(card)
        }
    }
}


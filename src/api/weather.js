
const apiKey = 'cb54f7b2d8414f72afa103436241804'
import axios from "axios"

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`

const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`

const apiCall = async endpoint => {
    const options = {
        method: 'GET',
        url: endpoint,
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('error', error);
        return null;
    }
}

export const fetchWeatherForecast = params => {
    return apiCall(forecastEndpoint(params))
}

export const fetchLocations = params => {
    return apiCall(locationsEndpoint(params))
}


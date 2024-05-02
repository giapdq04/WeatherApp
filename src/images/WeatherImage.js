

export const weatherImages = (weather) => {
    switch (weather) {
        case 'partly cloudy':
            return require('./partlycloudy.png');
        case 'moderate rain':
            return require('./moderaterain.png');
        case 'patchy rain possible':
        case 'patchy rain nearby':
        case 'patchy light rain':
            return require('./patchyrainposible.png');
        case 'patchy light rain in area with thunder':
        case 'moderate or heavy rain shower':
        case 'moderate or heavy rain with thunder':
            return require('./heavyrain.png');
        case 'sunny':
            return require('./sunny.png');
        case 'clear':
            return require('./clear.png');
        case 'overcast':
            return require('./overcast.png');
        case 'cloudy':
            return require('./cloud.png');
        case 'light rain':
        case 'light drizzle':
        case 'light rain shower':
            return require('./lightrain.png');
        case 'heavy rain':
        case 'heavy rain at times':
        case 'moderate or heavy freezing rain':
            return require('./heavyrain.png');
        case 'mist':
        case 'fog':
            return require('./mist.png');
        case 'thundery outbreaks in nearby':
            return require('./thunderyoutbreaksinnearby.png');
        default:
            return { uri: 'https://cdn-icons-png.flaticon.com/512/252/252035.png' };
    }
}
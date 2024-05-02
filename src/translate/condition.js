
export const WeatherTranslate = (condition) => {
    switch (condition) {
        case 'partly cloudy':
            return 'Có mây một phần';
        case 'moderate rain':
            return 'Mưa vừa';
        case 'patchy rain possible':
            return 'Có thể mưa nhỏ';
        case 'patchy rain nearby':
        case 'patchy light rain':
            return 'Mưa nhỏ xung quanh';
        case 'patchy light rain in area with thunder':
            return 'Mưa nhỏ có sấm sét';
        case 'patchy light drizzle':
            return 'Mưa phùn nhỏ';
        case 'sunny':
            return 'Nắng';
        case 'clear':
            return 'Trời quang';
        case 'overcast':
            return 'U ám';
        case 'cloudy':
            return 'Nhiều mây';
        case 'light rain':
            return 'Mưa nhỏ';
        case 'moderate rain at times':
            return 'Mưa vừa phải đôi khi';
        case 'heavy rain':
            return 'Mưa lớn';
        case 'heavy rain at times':
            return 'Mưa lớn đôi khi';
        case 'moderate or heavy freezing rain':
            return 'Mưa lớn hoặc mưa lạnh vừa';
        case 'moderate or heavy rain shower':
            return 'Mưa lớn hoặc mưa vừa';
        case 'moderate or heavy rain with thunder':
            return 'Mưa lớn hoặc mưa vừa có sấm sét';
        case 'mist':
            return 'Sương mù nhẹ';
        case 'light drizzle':
            return 'Mưa phùn nhẹ';
        case 'thundery outbreaks in nearby':
            return 'Sấm sét xung quanh';
        case 'light rain shower':
            return 'Mưa rào nhẹ';
        case 'fog':
            return 'Sương mù';
        default:
            return condition; // Trả về điều kiện không xác định
    }
}
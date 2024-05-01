import { Image, ImageBackground, Keyboard, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { fetchLocations, fetchWeatherForecast } from './src/api/weather';
import { weatherImages } from './src/images/WeatherImage';
import * as Progress from 'react-native-progress';
import { getData, storeData } from './src/cityStorage';
import { ConditionTranslate } from './src/translate/condition';
import { debounce } from 'lodash';

const App = () => {

  const [showSearch, setShowSearch] = useState(false)
  const [locations, setLocation] = useState([])
  const [weather, setWeather] = useState({})
  const [loading, setLoading] = useState(true)


  const { current, location } = weather

  // trang thai ban phim
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


  // sự kiện bàn phím bật lên
  useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  //lấy dữ liệu thời tiết khi mở ứng dụng
  useEffect(() => {
    fetchWeatherForecastData()
  }, [])


  //lấy dữ liệu thời tiết
  const fetchWeatherForecastData = useCallback(
    async () => {
      try {
        setLoading(true)
        let myCity = await getData('city')
        let cityName = myCity || 'Hanoi'
        const data = await fetchWeatherForecast({ cityName, days: '7' })
        setWeather(data)
        setLoading(false)
        // console.log('Loading thành công');

      } catch (error) {
        console.error('Failed to fetch weather forecast:', error)
      }
    },
    [],
  )


  //xử lý chọn địa điểm
  const handleLocation = (loc) => {
    // console.log('Location', loc);
    setLocation([])
    setShowSearch(false)
    setLoading(true)
    fetchWeatherForecast({ cityName: loc.name, days: '7' })
      .then(data => {
        setWeather(data)
        setLoading(false)
        storeData('city', loc.name)
      })
  }

  //xử lý tìm kiếm
  const handleSearch = debounce((value) => {
    if (value.trim().length !== 0) {
      fetchLocations({ cityName: value })
        .then(data => {
          setLocation(data)
        })
        .catch(err => {
          console.log('Error', err);
        })
    }
  }, 250);

  const convertToDayOfWeek = (day) => {
    let date = new Date(day)
    let options = { weekday: 'long' }
    let dayName = date.toLocaleDateString('vi-VN', options)
    return dayName
  }

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content"
        backgroundColor="rgb(0, 50, 56)" />
      <ImageBackground
        blurRadius={50}
        style={{
          flex: 1,
        }}
        source={require('./src/images/bg.png')}>
        {
          loading ? (

            // hiệu ứng loading
            <View style={st.loading}>
              <Progress.CircleSnail thickness={10} size={100} color={'#0bb3b2'} />
            </View>
          ) : (
            <View
              style={{
                flex: 1
              }}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchWeatherForecastData}
                  />
                }
              >

                {/* Phần dự báo thời tiết */}
                {!isKeyboardVisible && (
                  <View
                    style={st.loading}>
                    <View style={st.title}>
                      <Text style={st.city}>
                        {location?.name}
                        <Text style={st.country}>, {location?.country}</Text>
                      </Text>
                    </View>

                    {/* Ảnh thời tiết */}
                    <View style={{
                      height: 200,
                    }}>

                      <Image
                        source={weatherImages[current?.condition?.text.trim().toLowerCase()] || weatherImages['other']}

                        style={st.currentWeatherImage}
                      />
                    </View>

                    {/* Nhiệt độ */}
                    <View style={st.heat}>
                      <Text style={st.currentHeat}>
                        {current?.temp_c}&#176;
                      </Text>

                      <Text style={st.secondaryHeat}>
                        {weather?.forecast?.forecastday[0]?.day?.maxtemp_c}&#176; / {weather?.forecast?.forecastday[0]?.day?.mintemp_c}&#176;
                        Cảm giác {current?.feelslike_c}&#176;
                      </Text>

                      <Text style={st.condition}>
                        {ConditionTranslate[current?.condition?.text.trim().toLowerCase()] || current?.condition?.text}
                      </Text>

                      <Text style={st.secondaryHeat}>
                        {convertToDayOfWeek(location?.localtime)} {location?.localtime.slice(11, 16)}

                      </Text>
                    </View>

                    {/* Các chỉ số khác */}
                    <View style={st.otherIndicators}>

                      {/* Tốc độ gió */}
                      <View style={st.indicators}>
                        <Image
                          source={require('./src/images/wind.png')}
                          style={st.indicatorImage}
                        />
                        <Text style={st.indicatorNumber}>
                          {current?.wind_kph} km/h
                        </Text>
                      </View>

                      {/* Độ ẩm */}
                      <View style={st.indicators}>
                        <Image
                          source={require('./src/images/drop.png')}
                          style={st.indicatorImage}
                        />
                        <Text style={st.indicatorNumber}>
                          {current?.humidity}%
                        </Text>
                      </View>

                      {/* Chỉ số UV */}
                      <View style={st.indicators}>
                        <Image
                          source={require('./src/images/sunny.png')}
                          style={st.indicatorImage}
                        />
                        <Text style={[st.indicatorNumber, { width: 94 }]}>
                          {current?.uv} UV: {current?.uv >= 11 ? 'Gắt' : (current?.uv >= 8 ? 'Rất Cao' : (current?.uv >= 6 ? 'Cao' : (current?.uv >= 3 ? 'Trung Bình' : 'Thấp')))}
                        </Text>
                      </View>
                    </View>

                    {/* Các chỉ số mặt trời lặn và mọc */}
                    <View style={st.indicatorSun}>

                      {/* Bình minh */}
                      <View style={st.indicators}>
                        <Image
                          source={require('./src/icons/sun.png')}
                          style={st.indicatorImage}
                        />
                        <Text style={st.indicatorNumber}>
                          {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                        </Text>
                      </View>

                      {/* Hoàng hôn */}
                      <View style={st.indicators}>
                        <Image
                          source={require('./src/icons/sunset.png')}
                          style={
                            st.sunsetImage
                          }
                        />
                        <Text style={st.indicatorNumber}>
                          {weather?.forecast?.forecastday[0]?.astro?.sunset}
                        </Text>
                      </View>
                    </View>

                  </View>
                )}

                {/* Dự báo những giờ tiếp theo */}
                {!isKeyboardVisible && (
                  <View style={st.forecastNextHours}>

                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <FontAwesome6 name='clock' size={20} color='white' />
                      <Text style={st.forecastNextHoursTitle}>
                        Những giờ tiếp theo
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      contentContainerStyle={st.forecastNextHoursBar}
                      showsHorizontalScrollIndicator={false}
                    >

                      {
                        weather?.forecast?.forecastday[0]?.hour.map((item, index) => {

                          let time = parseInt(item?.time.slice(11, 13))
                          let currentHour = current.last_updated.slice(11, 13)

                          if (time < currentHour) {
                            return null
                          }

                          return (
                            <View
                              key={index}
                              style={st.forecastHourCard}>
                              <Image
                                source={weatherImages[item?.condition?.text.trim().toLowerCase()] || weatherImages['other']}
                                style={st.cardImage}
                              />
                              <Text style={st.forecastHour}>
                                {time}:00
                              </Text>
                              <Text style={st.hourHeat}>
                                {item?.temp_c}&#176;
                              </Text>
                              <View style={{
                                flexDirection: 'row',
                              }}>

                                <Image
                                  source={require('./src/icons/drop.png')}
                                  style={st.humidityImage}
                                />

                                <Text style={st.humidityPercent}>
                                  {item?.humidity}%
                                </Text>
                              </View>

                            </View>
                          )
                        })
                      }

                      {
                        weather?.forecast?.forecastday[1].hour?.map((item, index) => {
                          let time = item?.time.slice(11, 13)
                          let currentHour = current.last_updated.slice(11, 13)
                          if (time >= currentHour) {
                            return null
                          }

                          return (
                            <View
                              key={index}
                              style={st.forecastHourCard}>
                              <Image
                                source={weatherImages[item?.condition?.text.trim().toLowerCase()] || weatherImages['other']}
                                style={st.cardImage}
                              />
                              <Text style={st.forecastHour}>
                                {time}:00
                              </Text>
                              <Text style={st.hourHeat}>
                                {item?.temp_c}&#176;
                              </Text>
                              <View style={{
                                flexDirection: 'row',
                              }}>

                                <Image
                                  source={require('./src/icons/drop.png')}
                                  style={st.humidityImage}
                                />

                                <Text style={st.humidityPercent}>
                                  {item?.humidity}%
                                </Text>
                              </View>

                            </View>
                          )
                        })
                      }


                    </ScrollView>
                  </View>
                )}


                {/* Dự báo những ngày tiếp theo */}
                {!isKeyboardVisible && (
                  <View style={st.forecastNextDays}>

                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <FontAwesome6 name='calendar-days' size={20} color='white' />
                      <Text style={st.forecastNextDaysTitle}>
                        Những ngày tiếp theo
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      contentContainerStyle={st.forecastNextDaysBar}
                      showsHorizontalScrollIndicator={false}
                    >

                      {
                        weather?.forecast?.forecastday?.map((item, index) => {
                          return (
                            <View
                              key={index}
                              style={st.forecastHourCard}>
                              <Image
                                source={weatherImages[item?.day?.condition?.text.trim().toLowerCase()] || weatherImages['other']}
                                style={st.cardImage}
                              />
                              <Text style={st.forecastDay}>
                                {convertToDayOfWeek(item?.date)}
                              </Text>
                              <Text style={st.dayHeat}>
                                {item?.day?.maxtemp_c}&#176;/{item?.day?.mintemp_c}&#176;
                              </Text>
                              <View style={{
                                flexDirection: 'row',
                              }}>

                                <Image
                                  source={require('./src/icons/drop.png')}
                                  style={st.humidityImage}
                                />

                                <Text style={st.humidityPercent}>
                                  {item?.day?.avghumidity}%
                                </Text>
                              </View>

                            </View>
                          )
                        })
                      }


                    </ScrollView>
                  </View>
                )}

                {/* Quay lại màn hình xem thời tiết */}
                {isKeyboardVisible && (
                  <TouchableOpacity onPress={() => setShowSearch(false)} style={{ flex: 1 }}></TouchableOpacity>
                )}

              </ScrollView>



              {/* Phần tìm kiếm */}
              <View style={st.search}>
                {/* search bar */}
                <View style={[st.searchbar, {
                  backgroundColor: showSearch ? 'rgba(110, 131, 133,0.3)' : 'transparent',
                }]}>

                  {
                    showSearch ? (
                      <TextInput
                        onChangeText={handleSearch}
                        placeholder='Search city'
                        placeholderTextColor={'white'}
                        style={st.searchInput}
                      />
                    ) : null
                  }

                  <TouchableOpacity
                    onPress={() => setShowSearch(!showSearch)}
                    style={st.searchBtn}>
                    <FontAwesome6 name='magnifying-glass' size={20} color='white' />
                  </TouchableOpacity>


                </View>

                {
                  locations.length > 0 && showSearch ? (
                    <View style={st.location}>
                      {
                        locations.map((loc, index) => (
                          <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            style={st.locationBtn}
                          >
                            <FontAwesome6 name='location-dot' size={20} color='rgba(110, 131, 133,0.5)' />
                            <Text style={st.cityName}>{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                        ))
                      }
                    </View>
                  ) : null
                }
              </View>

            </View>

          )
        }

      </ImageBackground >


    </View >
  )
}

export default App

const st = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,

  },
  searchInput: {
    paddingHorizontal: 20,
    width: 320,
    fontSize: 20,
    color: 'white',

  },
  searchBtn: {
    backgroundColor: 'rgba(110, 131, 133,0.5)',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    right: 0
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: '90%',
  },
  city: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },

  country: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
  },

  currentWeatherImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },

  heat: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },

  currentHeat: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
  },

  secondaryHeat: {
    color: 'white',
    fontSize: 20
  },

  condition: {
    color: 'white',
    fontSize: 30,
  },

  otherIndicators: {
    flexDirection: 'row',
    height: 80,
    width: '90%',
  },

  indicators: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  indicatorImage: {
    width: 30,
    height: 30,
  },

  indicatorNumber: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 10
  },
  indicatorSun: {
    height: 80,
    flexDirection: 'row',
  },

  sunsetImage: {
    width: 40,
    height: 40,
  },

  forecastNextHours: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20
  },

  forecastNextHoursTitle: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 10
  },
  forecastNextHoursBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  forecastHourCard: {
    backgroundColor: 'rgba(110, 131, 133,0.5)',
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 150,
    width: 120
  },

  cardImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },

  forecastHour: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },

  hourHeat: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },

  humidityImage: {
    width: 20,
    height: 20,
  },

  humidityPercent: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },

  forecastNextDays: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20
  },

  forecastNextDaysTitle: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 10
  },

  forecastNextDaysBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  forecastDayCard: {
    backgroundColor: 'rgba(110, 131, 133,0.5)',
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 150,
    width: 120
  },

  forecastDay: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },

  dayHeat: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },

  search: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  location: {
    backgroundColor: 'rgb(238, 243, 250)',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginTop: 10
  },

  locationBtn: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
  },

  cityName: {
    fontSize: 20,
    paddingLeft: 10,
  }







})
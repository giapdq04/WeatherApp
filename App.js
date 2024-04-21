import { Image, ImageBackground, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { fetchLocations, fetchWeatherForecast } from './src/api/weather';
import { weatherImages } from './src/images/WeatherImage';
import * as Progress from 'react-native-progress';
import { getData, storeData } from './src/cityStorage';
import { ConditionTranslate } from './src/translate/condition';

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
  const fetchWeatherForecastData = async () => {
    let myCity = await getData('city')
    let cityName = myCity || 'Hanoi'
    fetchWeatherForecast({ cityName, days: '7' })
      .then(data => {
        setWeather(data)
        setLoading(false)
        // console.log('Data', data);
      })
  }

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
  const handleSearch = (value) => {
    if (value.length > 2) {

      fetchLocations({ cityName: value })
        .then(data => {
          setLocation(data)
        })
        .catch(err => {
          console.log('Error', err);
        })

    }
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
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Progress.CircleSnail thickness={10} size={100} color={'#0bb3b2'} />
            </View>
          ) : (
            <View
              style={{
                flex: 1
              }}>

              {!isKeyboardVisible && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}>
                      {location?.name}
                      <Text style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: 20,
                      }}>, {location?.country}</Text>
                    </Text>
                  </View>

                  {/* Ảnh thời tiết */}
                  <View style={{
                    flex: 1
                  }}>

                    <Image
                      source={weatherImages[current?.condition?.text.trim().toLowerCase()] || weatherImages['other']}
                      // source={{ uri: 'https:' + current?.condition?.icon }}

                      style={{
                        width: 200,
                        height: 200,
                        resizeMode: 'contain'
                      }}
                    />
                  </View>

                  {/* Nhiệt độ */}
                  <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 60,
                      fontWeight: 'bold',
                    }}>
                      {current?.temp_c}&#176;
                    </Text>

                    <Text style={{
                      color: 'white',
                      fontSize: 30,
                    }}>
                      {ConditionTranslate[current?.condition?.text.trim().toLowerCase()] || current?.condition?.text}
                    </Text>
                  </View>

                  {/* Các chỉ số khác */}
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image
                        source={require('./src/images/wind.png')}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <Text style={{
                        color: 'white',
                        fontSize: 18,
                        paddingLeft: 10
                      }}>
                        {current?.wind_kph} km/h
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image
                        source={require('./src/images/drop.png')}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <Text style={{
                        color: 'white',
                        fontSize: 18,
                        paddingLeft: 10
                      }}>
                        {current?.humidity}%
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image
                        source={require('./src/icons/sun.png')}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <Text style={{
                        color: 'white',
                        fontSize: 18,
                        paddingLeft: 10
                      }}>
                        {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                      </Text>
                    </View>
                  </View>



                </View>
              )}
              {/* Phần dự báo thời tiết */}


              {/* Dự báo những ngày tiếp theo */}
              {!isKeyboardVisible && (
                <View style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginBottom: 20
                }}>

                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <FontAwesome6 name='calendar-days' size={20} color='white' />
                    <Text style={{
                      color: 'white',
                      fontSize: 18,
                      paddingLeft: 10

                    }}>
                      Những ngày tiếp theo
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                    }}
                    showsHorizontalScrollIndicator={false}
                  >

                    {
                      weather?.forecast?.forecastday?.map((item, index) => {
                        let date = new Date(item?.date)
                        let options = { weekday: 'long' }
                        let dayName = date.toLocaleDateString('vi-VN', options)
                        return (
                          <View
                            key={index}
                            style={{
                              backgroundColor: 'rgba(110, 131, 133,0.5)',
                              padding: 20,
                              borderRadius: 30,
                              marginRight: 10,
                              alignItems: 'center'
                            }}>
                            <Image
                              source={weatherImages[item?.day?.condition?.text.trim().toLowerCase()] || weatherImages['other']}
                              style={{
                                width: 50,
                                height: 50
                              }}
                            />
                            <Text style={{
                              color: 'white',
                              fontSize: 18,
                              textAlign: 'center'
                            }}>
                              {dayName}
                            </Text>
                            <Text style={{
                              color: 'white',
                              fontSize: 18,
                              textAlign: 'center'
                            }}>
                              {item?.day?.avgtemp_c}&#176;
                            </Text>
                          </View>
                        )
                      })
                    }


                  </ScrollView>
                </View>
              )}


              {/* Phần tìm kiếm */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}>
                {/* search bar */}
                <View style={[st.searchbar, {
                  backgroundColor: showSearch ? 'rgba(110, 131, 133,0.3)' : 'transparent',
                }]}>

                  {
                    showSearch && (
                      <TextInput
                        onChangeText={handleSearch}
                        placeholder='Search city'
                        placeholderTextColor={'white'}
                        style={st.searchInput}
                      />
                    )
                  }

                  <TouchableOpacity
                    onPress={() => setShowSearch(!showSearch)}
                    style={st.searchBtn}>
                    <FontAwesome6 name='magnifying-glass' size={20} color='white' />
                  </TouchableOpacity>


                </View>

                {
                  locations.length > 0 && showSearch ? (
                    <View style={{
                      backgroundColor: 'rgb(238, 243, 250)',
                      width: '90%',
                      alignSelf: 'center',
                      borderRadius: 20,
                      paddingHorizontal: 20,
                      marginTop: 10
                    }}>
                      {
                        locations.map((loc, index) => (
                          <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            style={{
                              paddingVertical: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: 'rgba(0,0,0,0.1)',
                              flexDirection: 'row',
                            }}
                          >
                            <FontAwesome6 name='location-dot' size={20} color='rgba(110, 131, 133,0.5)' />
                            <Text style={{
                              fontSize: 20,
                              paddingLeft: 10,
                            }}>{loc?.name}, {loc?.country}</Text>
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
  }
})
import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import {
  SafeAreaView, ScrollView, StatusBar,
  useColorScheme, View, Image, TouchableOpacity,
} from 'react-native'
import type { NativeSyntheticEvent } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { YaMap, Marker } from 'react-native-yamap'
import type { CameraPosition } from 'react-native-yamap'
import Geolocation from '@react-native-community/geolocation'
// import axios from 'axios'
import { io } from 'socket.io-client'

import { styles } from './App.styles'
import type { I_Coords } from './types'

YaMap.init('448316e2-a305-4292-a570-5f3b029b55ba')

const ZOOM_MAX = 21
const ZOOM_MIN = 3
const ZOOM_STEP = 0.3

// const axiosInstance = axios.create({ baseURL: 'http://194.67.118.215' })
// const axiosInstance = axios.create({ baseURL: 'https://d713-5-59-15-224.ngrok-free.app' })

const socket = io('https://16d7-5-59-15-224.ngrok-free.app')


const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const [lat, setLat] = useState<number>(0)
  const [lon, setLon] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(10)

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      locationProvider: 'playServices', // | 'android' | 'auto';
    })

    Geolocation.getCurrentPosition((info) => {
      mapRef.current!.setCenter({
        lat: info.coords.latitude,
        lon: info.coords.longitude,
        zoom,
      })

      setLat(info.coords.latitude)
      setLon(info.coords.longitude)
    })
  }, [])

  const mapRef = useRef<YaMap>()

  const handleLocatorClick = () => {
    if (!mapRef.current) return

    Geolocation.getCurrentPosition((info) => {
      mapRef.current!.setCenter({
        lat: info.coords.latitude,
        lon: info.coords.longitude,
        zoom,
      })

      setLat(info.coords.latitude)
      setLon(info.coords.longitude)
    })
  }

  const handlePlusClick = () => {
    if (!mapRef.current) return
    const newZoom = zoom + ZOOM_STEP
    setZoom(zoom > ZOOM_MAX ? ZOOM_MAX : newZoom)
    mapRef.current!.setCenter({ lat, lon, zoom: newZoom })
  }

  const handleMinusClick = () => {
    if (!mapRef.current) return
    const newZoom = zoom - ZOOM_STEP
    setZoom(zoom < ZOOM_MIN ? ZOOM_MIN : newZoom)
    mapRef.current!.setCenter({ lat, lon, zoom: newZoom })
  }

  const handleCameraPositionChange = (e: NativeSyntheticEvent<CameraPosition>) => {
    setLat(e.nativeEvent.point.lat)
    setLat(e.nativeEvent.point.lon)
    setZoom(e.nativeEvent.zoom)
  }

  const [ taxiCoords, setTaxiCoords ] = useState<I_Coords>({ lat: 30, lon: 30 })

  useEffect(() => {
    socket.on('newCoords', (newCoords: I_Coords) => {
      setTaxiCoords(newCoords)
    })
  }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     axiosInstance.get(`/taxi-coords?prev-lat=${taxiCoords?.lat}&prev-lon=${taxiCoords?.lon}`)
  //       .then((res: any) => {
  //         setTaxiCoords(() => ({
  //           lat: res?.data?.lat,
  //           lon: res?.data?.lon,
  //         }))
  //       })
  //   }, 4000)
  // }, [taxiCoords])


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />

      <ScrollView contentInsetAdjustmentBehavior='automatic' style={backgroundStyle}>
        <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
          <YaMap
            ref={mapRef}
            onCameraPositionChange={handleCameraPositionChange}
            userLocationIcon={require('./images/man.png')}
            followUser
            rotateGesturesEnabled={false}
            style={styles.map}
          >
            {taxiCoords && <Marker point={taxiCoords} />}
          </YaMap>

          <View style={styles.locatorWrapper}>
            <TouchableOpacity
              style={styles.btnBg}
              activeOpacity={0.5}
              onPress={handleLocatorClick}
            >
              <Image
                source={require('./images/locator.png')}
                resizeMode='stretch'
                style={styles.btnImage}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnBg}
              activeOpacity={0.5}
              onPress={handlePlusClick}
            >
              <Image
                source={require('./images/plus.png')}
                resizeMode='stretch'
                style={styles.btnImage}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnBg}
              activeOpacity={0.5}
              onPress={handleMinusClick}
            >
              <Image
                source={require('./images/minus.png')}
                resizeMode='stretch'
                style={styles.btnImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App

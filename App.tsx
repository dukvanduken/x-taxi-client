import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import {
  SafeAreaView, ScrollView, StatusBar,
  useColorScheme, View,
} from 'react-native'
import type { NativeSyntheticEvent } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { YaMap, Marker } from 'react-native-yamap'
import type { CameraPosition } from 'react-native-yamap'
import Geolocation from '@react-native-community/geolocation'
import { io } from 'socket.io-client'
import Toast from 'react-native-toast-message'

import { NavButtons } from './components/nav-buttons'
import { styles } from './App.styles'
import type { I_Coords } from './types'


YaMap.init('448316e2-a305-4292-a570-5f3b029b55ba')


const socket = io('wss://x-taxi.site', {
  transports: [ 'websocket' ],
})

socket.on('connect', () => {
  Toast.show({ type: 'success', text1: 'Connected' })
})
socket.on('disconnect', () => {
  Toast.show({ type: 'error', text1: 'Disconnected' })
})
socket.on('connect_error', (err) => {
  Toast.show({ type: 'error', text1: 'Connect Error: ' + JSON.stringify(err) })
})


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



  const handleCameraPositionChange = (e: NativeSyntheticEvent<CameraPosition>) => {
    setLat(e.nativeEvent.point.lat)
    setLat(e.nativeEvent.point.lon)
    setZoom(e.nativeEvent.zoom)
  }

  const [ taxiCoords, setTaxiCoords ] = useState<I_Coords>({ lat: 30, lon: 30 })

  useEffect(() => {
    socket.on('newCoords', (newCoords: I_Coords) => {
      Toast.show({
        type: 'success',
        text1: 'New coords got',
        text2: JSON.stringify(newCoords),
      })

      setTaxiCoords(newCoords)
    })
  }, [])


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

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

          <NavButtons
            lat={lat} setLat={setLat}
            lon={lon} setLon={setLon}
            zoom={zoom} setZoom={setZoom}
            mapRef={mapRef}
          />
        </View>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  )
}

export default App

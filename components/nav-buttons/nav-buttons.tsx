import {
  View, Image, TouchableOpacity,
} from 'react-native'
import type { FC, MutableRefObject, SetStateAction, Dispatch } from 'react'
import Geolocation from '@react-native-community/geolocation'
import type { YaMap } from 'react-native-yamap'

import { styles } from './styles'


const ZOOM_MAX = 21
const ZOOM_MIN = 3
const ZOOM_STEP = 0.3


interface I_NavButtonsProps {
  lat: number
  setLat: Dispatch<SetStateAction<number>>
  lon: number
  setLon: Dispatch<SetStateAction<number>>
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
  mapRef: MutableRefObject<YaMap | undefined>
}

export const NavButtons: FC<I_NavButtonsProps> = ({
  lat, setLat,
  lon, setLon,
  zoom, setZoom,
  mapRef,
}) => {
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


  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.btnBg}
        activeOpacity={0.5}
        onPress={handleLocatorClick}
      >
        <Image
          source={require('../../images/locator.png')}
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
          source={require('../../images/plus.png')}
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
          source={require('../../images/minus.png')}
          resizeMode='stretch'
          style={styles.btnImage}
        />
      </TouchableOpacity>
    </View>
  )
}

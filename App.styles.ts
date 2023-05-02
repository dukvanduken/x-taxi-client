import { Dimensions, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  locatorWrapper: {
    position: 'absolute',
    bottom: '40%',
    right: 20,
  },

  btnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#ccc',
    height: 60,
    width: 60,
    borderRadius: 100,
  },

  btnImage: {
    width: 40,
    height: 40,
  }
})

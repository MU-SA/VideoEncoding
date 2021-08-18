import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    margin: 16,
  },
  selectButton: {
    backgroundColor: '#e91e63',
    padding: 16,
    flex: 1,
    marginEnd: 0.5,
  },
  buttonText: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  captureButton: {
    backgroundColor: '#e91e63',
    padding: 16,
    flex: 1,
    marginStart: 0.5,
  },
});

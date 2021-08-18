import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  absoluteView: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.2)',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    flex: 1,
    height: 260,
    borderRadius: 16,
  },
  video: {
    flex: 1,
    height: 260,
    borderRadius: 16,
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  icon: {
    width: 24,
    height: 24,
  },
  progressBarContainer: {
    width: '50%',
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,.3)',
  },
  closebutton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,.3)',
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    margin: 8,
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: 'black',
  },
  videoContainer: {
    flex: 1,
    margin: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadButton: {
    position: 'absolute',
    margin: 8,
    right: 0,
    zIndex: 100,
  },
});
export function modalBackground(isDarkMode) {
  return {
    backgroundColor: isDarkMode ? '#121212' : '#fff',
    flex: 1,
    flexGrow: 1,
  };
}
export function progressStyle(progress) {
  return {
    width: `${progress}%`,
    backgroundColor: '#e91e63',
    height: 3,
  };
}
export function uploadIcon(uploading) {
  return {width: 24, height: 24, tintColor: uploading ? '#e91e63' : 'black'};
}

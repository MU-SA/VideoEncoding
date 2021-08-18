import React, {useState} from 'react';

import {Image, Pressable, View} from 'react-native';
import Video from 'react-native-video';
import styles from './styles';
const play_button = require('../../../Assets/play.png');

export default ({video, thumbnail}) => {
  const [paused, setPaused] = useState(true);
  if (paused)
    return (
      <View style={styles.thumbnailWrapper}>
        <Image source={{uri: thumbnail}} style={styles.thumbnail} />
        <View style={styles.absoluteView}>
          <Pressable style={styles.playButton} onPress={() => setPaused(!paused)}>
            <Image source={play_button} style={styles.playIcon} />
          </Pressable>
        </View>
      </View>
    );
  return <Video paused controls source={{uri: video}} style={styles.video} resizeMode={'cover'} />;
};

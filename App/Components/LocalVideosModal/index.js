import React from 'react';
import {SafeAreaView, Modal, FlatList, Pressable, Image, View, useColorScheme} from 'react-native';
import styles, {modalBackground} from './styles';
import VideoItem from './VideoItem';
const close_button = require('../../Assets/close.png');

export default ({videos, open, onCloseRequested}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Modal visible={open} animationType={'slide'}>
      <SafeAreaView style={modalBackground(isDarkMode)}>
        <FlatList
          ListHeaderComponent={
            <Pressable onPress={onCloseRequested} style={styles.closebutton}>
              <Image source={close_button} style={styles.closeIcon} />
            </Pressable>
          }
          data={videos}
          numColumns={2}
          contentContainerStyle={{paddingHorizontal: 8}}
          renderItem={({item, index}) => <VideoItem key={index} videoData={item.node} />}
        />
      </SafeAreaView>
    </Modal>
  );
};

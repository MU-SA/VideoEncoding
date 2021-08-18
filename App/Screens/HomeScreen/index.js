import React, {useCallback, useEffect, useState} from 'react';
import {View, SafeAreaView, Text, Pressable, FlatList, Image} from 'react-native';
import CameraRoll, {ge} from '@react-native-community/cameraroll';
import CaptureModal from '../../Components/CaptureModal';
import LocalVideosModal from '../../Components/LocalVideosModal';
import firestore from '@react-native-firebase/firestore';
import RemoteVideo from './RemoteVideo';
import styles from './styles';

const config = {first: 100, assetType: 'Videos', groupTypes: 'All'};
export default ({}) => {
  const [videos, setVideos] = useState([]);
  const [remoteVideos, setRemoteVideos] = useState([]);
  const [openModal, toggleModal] = useState(false);
  const [captureVideo, toggleCaptureModal] = useState(false);

  const loadLocalVideos = useCallback(async () => {
    const result = await CameraRoll.getPhotos(config);
    setVideos(result.edges);
  }, [openModal]);

  const loadRemoteVideos = useCallback(async () => {
    const videos = await firestore().collection('Videos').get();
    setRemoteVideos(videos.docs);
  }, []);

  const onCapturePressed = useCallback(() => {
    toggleCaptureModal(!captureVideo);
  }, [captureVideo]);

  function onResult() {
    loadRemoteVideos();
  }

  function onError(error) {
    console.log(error);
  }

  useEffect(() => {
    loadLocalVideos();
    loadRemoteVideos();
    firestore().collection('Videos').onSnapshot(onResult, onError);
  }, []);
  return (
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => toggleModal(!openModal)} style={styles.selectButton}>
              <Text style={styles.buttonText}>Select</Text>
            </Pressable>
            <Pressable onPress={onCapturePressed} style={styles.captureButton}>
              <Text style={styles.buttonText}>Capture</Text>
            </Pressable>
          </View>
        }
        data={remoteVideos}
        contentContainerStyle={{paddingHorizontal: 8}}
        renderItem={({item}) => <RemoteVideo video={item.get('video')} thumbnail={item.get('thumbnail')} />}
      />
      <LocalVideosModal videos={videos} onCloseRequested={() => toggleModal(!openModal)} open={openModal} />
      <CaptureModal open={captureVideo} onCloseRequested={() => toggleCaptureModal(!captureVideo)} />
    </SafeAreaView>
  );
};

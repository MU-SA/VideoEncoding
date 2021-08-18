import React, {useCallback, useState, useRef, useEffect} from 'react';
import {SafeAreaView, Modal, Pressable, Image, View, Text, useColorScheme, ActivityIndicator} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Video from 'react-native-video';
import UploadMedia from '../../Services/UploadMedia';
import firestore from '@react-native-firebase/firestore';
import {RNFFmpeg} from 'react-native-ffmpeg';
import {CachesDirectoryPath} from 'react-native-fs';
const record_button = require('../../Assets/record.png');
const stop_recording_button = require('../../Assets/recording.png');
const close_button = require('../../Assets/close.png');

export default ({open, onCloseRequested}) => {
  const cameraRef = useRef();
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  const onRecordPressed = useCallback(async () => {
    if (recording) {
      await cameraRef.current.stopRecording();
      return;
    }
    cameraRef.current.recordAsync();
  }, [recording]);

  const onRecordingStart = useCallback(
    e => {
      setVideoUri(e.nativeEvent.uri);
      setRecording(true);
    },
    [recording],
  );

  const onCancelPressed = () => {
    setVideoUri('');
  };
  return (
    <Modal transparent={recording && !videoUri} visible={open} animationType={'slide'}>
      {videoUri && !recording ? (
        <RecordedVideoPreview {...{videoUri}} {...{onCancelPressed}} />
      ) : (
        <View style={{flex: 1}}>
          <RNCamera
            ref={cameraRef}
            type={RNCamera.Constants.Type.back}
            onRecordingEnd={() => {
              setTimeout(() => {
                setRecording(false);
              }, 3000);
            }}
            onRecordingStart={onRecordingStart}
            style={{flex: 1, height: '100%'}}
            captureAudio={false}
          />

          <SafeAreaView style={{position: 'absolute', alignSelf: 'center', bottom: 0}}>
            <Pressable onPress={onRecordPressed} style={{alignSelf: 'center'}}>
              <Image
                source={recording ? stop_recording_button : record_button}
                style={{width: 48, height: 48, tintColor: 'red'}}
              />
            </Pressable>
          </SafeAreaView>
          <SafeAreaView style={{position: 'absolute', alignSelf: 'center', top: 0, right: 0}}>
            <Pressable
              onPress={onCloseRequested}
              style={{
                alignSelf: 'center',
                padding: 8,
                backgroundColor: 'rgba(255,255,255,.3)',
                borderRadius: 16,
                overflow: 'hidden',
                margin: 16,
              }}>
              <Image source={close_button} style={{width: 16, height: 16, tintColor: 'black'}} />
            </Pressable>
          </SafeAreaView>
        </View>
      )}
    </Modal>
  );
};

const RecordedVideoPreview = ({videoUri, onCancelPressed}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [uploading, setUploading] = useState(false);
  const uploadVideo = async () => {
    let outputVideoPath = `${CachesDirectoryPath}/sample_preview.jpg`;
    await RNFFmpeg.execute(
      `-y -i ${videoUri} -frames 1 -q:v 1 -vf thumbnail=5,scale=-1:120,tile=5x1 ${outputVideoPath}`,
    );
    setUploading(true);
    const ext = videoUri.split('.')[1];
    const ref = `Videos/${new Date().toString()}.${ext}`;
    const thumbnailRef = `Thumbnails/${new Date().toString()}.jpg`;
    const url = await UploadMedia({ref, uri: videoUri, onProgress: console.log});
    const thumbnailURL = await UploadMedia({ref: thumbnailRef, uri: outputVideoPath, onProgress: console.log});
    setUploading(false);
    await firestore().collection('Videos').add({
      video: url,
      thumbnail: thumbnailURL,
    });
    onCancelPressed();
  };

  useEffect(() => {}, []);
  return (
    <View style={{flex: 1, height: '100%', width: '100%', backgroundColor: isDarkMode ? '#121212' : '#fff'}}>
      <Image style={{height: 250, width: '100%', backgroundColor: 'red'}} source={{uri: videoUri}} />
      <Video source={{uri: videoUri}} paused={false} controls style={{flex: 1, width: '100%'}} />

      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            alignItems: 'center',
            paddingVertical: 16,
          }}>
          <Pressable
            disabled={uploading}
            style={{
              alignSelf: 'center',
              padding: 16,
              borderRadius: 16,
              backgroundColor: '#e91e63',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={uploadVideo}>
            {uploading ? (
              <ActivityIndicator size={'small'} color={isDarkMode ? '#121212' : '#fff'} style={{marginEnd: 4}} />
            ) : null}
            <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Upload Video</Text>
          </Pressable>
          <Pressable style={{alignSelf: 'center', padding: 16, borderRadius: 16}} onPress={onCancelPressed}>
            <Text style={{fontWeight: 'bold', alignSelf: 'center', color: isDarkMode ? '#fff' : '#121212'}}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

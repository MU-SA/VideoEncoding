import React, {useEffect, useState} from 'react';
import Video from 'react-native-video';
import {View, Image, Pressable, ActivityIndicator} from 'react-native';

const play_button = require('../../Assets/play.png');
const pause_button = require('../../Assets/pause.png');
const upload_button = require('../../Assets/upload.png');

import firestore from '@react-native-firebase/firestore';
import UploadMedia from '../../Services/UploadMedia';
import RNFS from 'react-native-fs';
import styles, {progressStyle, uploadIcon} from './styles';

const getAssetFileAbsolutePath = async assetPath => {
  const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.jpg`;

  try {
    let absolutePath = await RNFS.copyAssetsFileIOS(assetPath, dest, 0, 0);
    return absolutePath;
  } catch (err) {
    return null;
  }
};

export default ({videoData}) => {
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [thumbnail, setThumbnail] = useState('videoThumbnail');
  const [videoExtension, setVideoExtension] = useState('');
  const [videoAssetLibraryPath, setVideoAssetLibraryPath] = useState('videoThumbnail');
  const [writing, setWriting] = useState(-1);
  const [uploading, setUploading] = useState(false);

  if (!videoData.image) return <View />;
  const {uri, fileSize} = videoData.image;

  const uploadVideo = async () => {
    setUploading(true);
    const ref = `Videos/${new Date().toString()}.${videoExtension}`;
    const url = await UploadMedia({ref, uri, onProgress});
    setWriting(0);
    const thumbnailRef = ref.replace(videoExtension, 'JPG').replace('Videos', 'Thumbnails');
    const thumbnailURI = await getAssetFileAbsolutePath(thumbnail);
    const thumbnailURL = await UploadMedia({ref: thumbnailRef, uri: thumbnailURI, onProgress: console.log});
    setWriting(0);
    await firestore().collection('Videos').add({
      video: url,
      thumbnail: thumbnailURL,
    });
    setProgress(0);
    setWriting(1);
  };
  const onProgress = state => {
    setProgress((state.bytesTransferred / fileSize) * 100);
  };

  useEffect(async () => {
    var regex = /:\/\/(.{36})\//i;
    var result = videoData.image.uri.match(regex);
    const appleId = videoData.image.uri.substring(5, 41);
    const ext = videoData.image.filename.split('.')[1];
    const uri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
    const image = 'assets-library://asset/asset.JPG?id=' + result[1] + '&ext=JPG';
    setThumbnail(image);
    setVideoAssetLibraryPath(uri);
    setVideoExtension(ext);
  }, []);
  return (
    <View style={styles.videoContainer}>
      {paused ? (
        <View style={{flex: 1}}>
          <Image source={{uri: thumbnail}} style={styles.thumbnail} />
          <View style={styles.absoluteView}>
            <Pressable style={styles.playButton} onPress={() => setPaused(!paused)}>
              <Image source={play_button} style={styles.icon} />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Video source={{uri: videoAssetLibraryPath}} resizeMode={'contain'} style={styles.video} />

          <View style={styles.absoluteView}>
            <Pressable style={styles.playButton} onPress={() => setPaused(!paused)}>
              <Image source={pause_button} style={styles.icon} />
            </Pressable>
          </View>
        </View>
      )}
      <Pressable onPress={uploadVideo} style={styles.uploadButton}>
        <Image source={upload_button} style={uploadIcon(uploading)} />
      </Pressable>
      {progress > 0 ? (
        <View style={styles.progressBarContainer}>
          {writing === 0 ? (
            <ActivityIndicator size={'small'} color={'#e91e63'} style={{alignSelf: 'flex-end'}} />
          ) : null}
          <View style={progressStyle(progress)} />
        </View>
      ) : null}
    </View>
  );
};

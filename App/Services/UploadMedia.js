import storage from '@react-native-firebase/storage';

export default async ({ref, uri, onProgress}) =>
  new Promise((resolve, reject) => {
    const reference = storage().ref(ref);
    const task = reference.putFile(uri);
    task.on('state_changed', onProgress);
    task.then(async data => {
      const url = await storage().ref(ref).getDownloadURL();
      resolve(url);
    });
  });

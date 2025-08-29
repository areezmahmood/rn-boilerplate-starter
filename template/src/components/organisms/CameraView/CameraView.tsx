import { View, StyleSheet, Image, ScrollView, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useCameraPermission, useImagePickerPermission } from '@/hooks';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { toast } from '@backpackapp-io/react-native-toast';
import RNBounceable from '@freakycoder/react-native-bounceable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image as ImageCompressor } from 'react-native-compressor';
// import { fontFamily } from '@/assets';

type props = {
  setCameraVisible: (visible: boolean) => void;
  setQRCode?: (qr: string) => void;
  setPhoto?: (image: PhotoFile) => void;
  multiple?: boolean;
  setPhotos?: (image: PhotoFile[]) => void;
};
export default function CameraView({
  setCameraVisible,
  setQRCode,
  setPhoto,
  multiple,
  setPhotos,
}: props) {
  const { status, requestPermission } = useCameraPermission();
  const [isCodeScanner, setIsCodeScanner] = useState(false);
  const [isFlash, setIsFlash] = useState<boolean>(false);
  const [preview, setPreview] = useState<PhotoFile | null>(null);
  const [multiplePhotos, setMultiplePhotos] = useState<PhotoFile[]>([]);
  const {
    status: imagePickerStatus,
    requestPermission: requestImagePickerPermission,
  } = useImagePickerPermission();

  useEffect(() => {
    if (status === 'not-determined') {
      requestPermission();
    }
  }, [status, requestPermission]);
  useEffect(() => {
    if (imagePickerStatus !== 'granted') {
      requestImagePickerPermission();
    }
  }, [imagePickerStatus, requestImagePickerPermission]);

  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null!);
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: multiple ? 0 : 1,
    });

    console.log(result);

    if (!result.didCancel) {
      if (setPhoto && result.assets && result.assets.length > 0) {
        const compressedURI = await ImageCompressor.compress(
          result.assets[0].uri!!,
          {
            progressDivider: 10,
            downloadProgress: progress => {
              console.log('Compression progress:', progress);
            },
          },
        );
        const photoFile: PhotoFile = {
          uri: compressedURI,
          name: result.assets[0].fileName || 'photo.jpg',
          type: result.assets[0].type || 'image/jpeg',
        };
        setPhoto(photoFile);
        setCameraVisible(false);
      }
      if (setPhotos) {
        if (result.assets && result.assets.length > 0) {
          const newUris = result.assets.map(a => ({
            uri: a.uri!!,
            name: a.fileName || 'photo.jpg',
            type: a.type || 'image/jpeg',
          }));
          setMultiplePhotos(newUris);
          //   setCameraVisible(false);
        }
      }
    }
  };
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      toast.success('QR code scanned!');
      setIsCodeScanner(false);
      if (setQRCode && codes[0]?.value) {
        setQRCode(codes[0].value);
      }
      setCameraVisible(false);
    },
  });

  const snapPhoto = async () => {
    if (camera.current == null) return;
    if (setPhoto || setPhotos) {
    } else {
      return;
    }
    try {
      const photoFile = await camera.current.takePhoto({
        flash: 'off',
      });

      const uri = `file://${photoFile.path}`;
      const compressedURI = await ImageCompressor.compress(uri, {
        progressDivider: 10,
        downloadProgress: progress => {
          console.log('Compression progress:', progress);
        },
      });
      const photo: PhotoFile = {
        uri: compressedURI,
        name: 'photo.jpg',
        type: 'image/jpeg',
      };
      setPreview(photo);
      // setPhoto(photoFile);
      // setCameraVisible(false)
    } catch (e) {
      console.error('Failed to take photo:', e);
    }
  };
  if (device == null || status !== 'granted') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}
      >
        <RNBounceable
          style={{ position: 'absolute', top: 100, left: 20 }}
          onPress={() => setCameraVisible(false)}
        >
          <MaterialIcons name={'cancel'} size={35} color="white" />
        </RNBounceable>
        <MaterialCommunityIcons name="camera" size={100} color={'#fff'} />
        <Text
          style={{
            // fontFamily: fontFamily.SegoeBold,
            color: 'white',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          We need camera access to take photos
        </Text>
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            width: '90%',
            gap: 30,
          }}
        >
          {multiplePhotos && (
            <View style={{ width: '100%', marginBottom: 10 }}>
              <ScrollView
                horizontal
                contentContainerStyle={{ gap: 20 }}
                showsHorizontalScrollIndicator={false}
              >
                {multiplePhotos.map((a, index) => {
                  return (
                    <View key={index} style={{}}>
                      <Image
                        source={{
                          uri: a.uri,
                        }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                        resizeMode="cover"
                      />
                      <RNBounceable
                        onPress={() => {
                          setMultiplePhotos(
                            multiplePhotos.filter((_, i) => i !== index),
                          );
                        }}
                        style={{ position: 'absolute', right: 0 }}
                      >
                        <MaterialIcons
                          color={'white'}
                          name="cancel"
                          size={20}
                        />
                      </RNBounceable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <View
            style={[
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}
          >
            {(setPhoto || setPhotos) && (
              <RNBounceable onPress={pickImage} style={{}}>
                <MaterialCommunityIcons
                  name={'image-plus'}
                  size={50}
                  color="white"
                />
              </RNBounceable>
            )}

            <View style={{ minWidth: 50 }}>
              {multiplePhotos.length > 0 && (
                <RNBounceable
                  onPress={() => {
                    if (setPhotos) {
                      setPhotos(multiplePhotos);
                    }
                    setCameraVisible(false);
                  }}
                  style={{
                    borderRadius: 100,
                    width: 50,
                    height: 50,
                    backgroundColor: 'rgba(245, 82, 39, 1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={40}
                    color="white"
                  />
                </RNBounceable>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
  if (preview) {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: preview.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <RNBounceable
          onPress={async () => {
            if (setPhoto) {
              setPhoto(preview);

              setCameraVisible(false);
            } else if (setPhotos) {
              multiplePhotos.push(preview);
              setPreview(null);
            }
          }}
          style={{
            position: 'absolute',
            zIndex: 10,
            bottom: 50,
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            backgroundColor: 'rgba(245, 82, 39, 1)',
            height: 100,
            borderRadius: 10000,
            alignSelf: 'center',
          }}
        >
          <MaterialCommunityIcons name="check" size={50} color="white" />
        </RNBounceable>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        ref={camera}
        torch={isFlash ? 'on' : 'off'}
        photo={true}
        resizeMode="cover"
        preview
        onPreviewStarted={() => console.log('Preview started!')}
        onPreviewStopped={() => {
          console.log('PREVIEW ENEDED:', preview);
          console.log('Preview stopped!');
        }}
        codeScanner={setQRCode && isCodeScanner ? codeScanner : undefined}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 50,
          width: '90%',
          alignSelf: 'center',
        }}
      >
        <RNBounceable onPress={() => setCameraVisible(false)}>
          <MaterialIcons name={'cancel'} size={35} color="white" />
        </RNBounceable>
        {(setPhoto || setPhotos) && (
          <RNBounceable onPress={() => setIsFlash(!isFlash)}>
            <MaterialCommunityIcons
              name={isFlash ? 'flash' : 'flash-off'}
              size={35}
              color="white"
            />
          </RNBounceable>
        )}
      </View>
      <View
        style={{
          bottom: 50,
          position: 'absolute',
          width: '90%',
          alignSelf: 'center',
        }}
      >
        {multiplePhotos && (
          <View style={{ width: '100%', marginBottom: 10 }}>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 20 }}
              showsHorizontalScrollIndicator={false}
            >
              {multiplePhotos.map((a, index) => {
                return (
                  <View key={index} style={{}}>
                    <Image
                      source={{
                        uri: a.uri,
                      }}
                      style={{ width: 100, height: 100, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                    <RNBounceable
                      onPress={() => {
                        setMultiplePhotos(
                          multiplePhotos.filter((_, i) => i !== index),
                        );
                      }}
                      style={{ position: 'absolute', right: 0 }}
                    >
                      <MaterialIcons color={'white'} name="cancel" size={20} />
                    </RNBounceable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View
          style={[
            {
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}
        >
          {(setPhoto || setPhotos) && (
            <RNBounceable onPress={pickImage} style={{}}>
              <MaterialCommunityIcons
                name={'image-plus'}
                size={50}
                color="white"
              />
            </RNBounceable>
          )}
          {setQRCode && <View style={{ width: 50 }} />}
          <RNBounceable
            onPress={async () => {
              if (setQRCode) {
                setIsCodeScanner(true);
              } else {
                console.log('INSIDE THIS IF');
                await snapPhoto();
              }
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              backgroundColor: 'rgba(245, 82, 39, 1)',
              height: 100,
              borderRadius: 10000,
            }}
          >
            {setQRCode ? (
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={50}
                color="white"
              />
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: 'white',
                }}
              />
            )}
          </RNBounceable>
          <View style={{ minWidth: 50 }}>
            {multiplePhotos.length > 0 && (
              <RNBounceable
                onPress={() => {
                  if (setPhotos) {
                    setPhotos(multiplePhotos);
                  }
                  setCameraVisible(false);
                }}
                style={{
                  borderRadius: 100,
                  width: 50,
                  height: 50,
                  backgroundColor: 'rgba(245, 82, 39, 1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="check" size={40} color="white" />
              </RNBounceable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

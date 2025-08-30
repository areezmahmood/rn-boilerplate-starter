import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import RNBounceable from '@freakycoder/react-native-bounceable';

type Props = {
  setImageToView: React.Dispatch<React.SetStateAction<{ uri: string }[]>>;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setImageViewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  images: { uri: string }[];
};

export default function ImageMessage({
  setImageToView,
  setImageIndex,
  setImageViewVisible,
  images,
}: Props) {
  return (
    <View style={styles.imageContainer}>
      <RNBounceable
        onPress={() => {
          setImageToView(images);
          setImageIndex(0);
          setImageViewVisible(true);
        }}
        style={styles.mainImage}
      >
        <Image
          source={{ uri: images[0].uri }}
          style={styles.image}
          resizeMode={'stretch'}
        />
      </RNBounceable>
      {images.length > 1 && (
        <View style={styles.additionalImages}>
          {images.map((img, index) => {
            if (index === 0 || index > 2) return null;
            return (
              <RNBounceable
                key={index}
                onPress={() => {
                  setImageToView(images);
                  setImageIndex(index);
                  setImageViewVisible(true);
                }}
                style={styles.additionalImage}
              >
                <Image
                  source={{ uri: img.uri }}
                  style={styles.image}
                  resizeMode={"cover"}
                />
                {index === 2 && (
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageOverlayText}>
                      +{images.length - 3}
                    </Text>
                  </View>
                )}
              </RNBounceable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 150,
    width: '100%',
    flexDirection: 'row',
    gap: 5,
  },
  mainImage: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  additionalImages: {
    flex: 1,
    gap: 5,
  },
  additionalImage: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

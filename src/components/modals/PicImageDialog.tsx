import React, {useEffect, useRef} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import PicIcon from '@icons/pic.svg';
import CameraIcon from '@icons/camera.svg';
import {IAddItemFormData, IModalProps} from '@/types';
import {Button} from '@/components';
import {selectImage, takePhoto} from '@/helpers';

interface IPicImageDialogProps extends IModalProps {
  setUris: React.Dispatch<React.SetStateAction<IAddItemFormData>>;
}

const PicImageDialog = ({visible, onClose, setUris}: IPicImageDialogProps) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateModal = (toValue: number, onComplete?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: toValue === 0 ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  };

  useEffect(() => {
    visible ? animateModal(0) : animateModal(300, onClose);
  }, [visible]);

  const handleSelectImage = async () => {
    try {
      const selectedImage = await selectImage();

      if (selectedImage) {
        setUris(prev => {
          const newImgUris = [...prev.imgUris];
          newImgUris.push({
            uri: selectedImage,
            active: prev.imgUris.length === 0,
          });

          return {
            ...prev,
            imgUris: newImgUris,
          };
        });
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    } finally {
      onClose();
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photoUri = await takePhoto();

      if (photoUri) {
        setUris(prev => ({
          ...prev,
          imgUris: [
            ...prev.imgUris,
            {uri: photoUri, active: prev.imgUris.length === 0},
          ],
        }));
      }
    } catch (error) {
      console.log('Error taking photo:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, {opacity: opacityAnim}]}>
        <Animated.View
          style={[styles.content, {transform: [{translateY: slideAnim}]}]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btn}
            onPress={handleTakePhoto}>
            <CameraIcon />
            <Text style={styles.text}>Зробити фото</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btn}
            onPress={handleSelectImage}>
            <PicIcon />
            <Text style={styles.text}>Вибрати фото</Text>
          </TouchableOpacity>
          <Button onPress={() => animateModal(300, onClose)} type="secondary">
            Закрити
          </Button>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default PicImageDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
    padding: 20,
    paddingTop: 30,
    gap: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btn: {
    flexDirection: 'row',
    gap: 20,
  },
  text: {
    fontFamily: 'Raleway-Regular',
    fontSize: 15,
  },
});

import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  AppIcon,
  Button,
  CategoriesList,
  Checkbox,
  DatePicker,
  EditButton,
  FilterItem,
  Input,
  KeyboardScroll,
  Modal,
  PhoneInput,
  PicImageDialog,
  SelectLocationList,
  Thumbnail,
} from '@/components';
import {IAddItemFormData} from '@/types';

type TFormType = 'i_find' | 'i_looking_for';

interface IItemFormProps {
  type: TFormType;
}

const ItemForm = ({type}: IItemFormProps) => {
  const [formData, setFormData] = useState<IAddItemFormData>({
    name: '',
    description: '',
    date: '',
    imgUris: [],
    forRemuneration: false,
    phone: '',
    category: '',
    location: '',
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [picImgOpen, setPicImgOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    setDateOpen(false);
  }, [formData.date]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const setActiveImage = (uri: string) => {
    setFormData(prev => ({
      ...prev,
      imgUris: prev.imgUris.map(image => ({
        ...image,
        active: image.uri === uri,
      })),
    }));
  };

  const onDeleteImage = (uri: string) => {
    setFormData((prev: IAddItemFormData) => {
      return {
        ...prev,
        imgUris: prev.imgUris.filter(item => item.uri !== uri),
      };
    });
  };

  const handleFormSubmit = () => {
    console.log('Form Data:', formData);
  };

  return (
    <View style={[styles.form, {paddingBottom: insets.bottom + 60}]}>
      <KeyboardScroll>
        <View>
          <Input
            placeholder={type === 'i_find' ? 'Що знайшли' : 'Що згубили'}
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            style={{marginBottom: 20}}
          />
          <Input
            multiline
            numberOfLines={5}
            placeholder={
              type === 'i_find' ? 'Де знайдено, опис знахідки' : 'Опис'
            }
            value={formData.description}
            onChangeText={value => handleInputChange('description', value)}
          />

          <Button
            onPress={() => setPicImgOpen(true)}
            style={{marginTop: 20}}
            type="bordered"
            before={<AppIcon name="file" />}>
            Завантажити фото
          </Button>

          <PicImageDialog
            visible={picImgOpen}
            onClose={() => setPicImgOpen(false)}
            setUris={setFormData}
          />

          <FlatList
            scrollEnabled={false}
            data={formData.imgUris}
            renderItem={({item}) => (
              <View style={{width: '25%', paddingHorizontal: 10}}>
                <Thumbnail
                  uri={item.uri}
                  active={item.active}
                  setActiveImage={setActiveImage}
                  onDelete={onDeleteImage}
                  style={{width: '100%', aspectRatio: 1}}
                />
              </View>
            )}
            keyExtractor={item => item.uri}
            numColumns={4}
            columnWrapperStyle={{}}
            contentContainerStyle={{
              marginTop: 20,
              rowGap: 20,
            }}
            style={{marginLeft: -10, marginRight: -10}}
          />

          <FilterItem title="Категорія">
            <EditButton
              title={formData.category || 'Вибрати категорію'}
              onPress={() => setCategoryModalOpen(true)}
            />
          </FilterItem>
          <FilterItem title="Локація">
            <EditButton
              title={formData.location || 'Локація'}
              onPress={() => setLocationModalOpen(true)}
            />
          </FilterItem>
          <FilterItem
            title={type === 'i_find' ? 'Дата знахідки' : 'Дата згуби'}>
            <DatePicker
              setOpen={() => setDateOpen(true)}
              date={formData.date}
              maxDate={new Date()}
              isOpen={dateOpen}
              onClose={() => setDateOpen(false)}
              onChange={date => handleInputChange('date', date)}
            />
          </FilterItem>
          <FilterItem title="Телефон для зв’язку">
            <PhoneInput
              placeholder="___ ___ __ __"
              value={formData.phone}
              onChange={value => handleInputChange('phone', value)}
            />
          </FilterItem>

          <View style={{marginVertical: 20}}>
            <Checkbox
              label="За винагороду"
              value={true}
              onValueChange={() =>
                handleInputChange('forRemuneration', !formData.forRemuneration)
              }
              checked={formData.forRemuneration}
            />
          </View>
        </View>

        <Button onPress={handleFormSubmit}>Опублікувати</Button>
      </KeyboardScroll>
      <Modal
        openFrom="right"
        visible={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Категорії">
        <CategoriesList />
      </Modal>
      <Modal
        openFrom="right"
        visible={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        title="Локація">
        <SelectLocationList style={{padding: 20}} />
      </Modal>
    </View>
  );
};

export default ItemForm;

const styles = StyleSheet.create({
  form: {
    padding: 20,
    paddingBottom: 60,
  },
});

import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';

import {ScreenHeader} from '@/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IScreen extends React.PropsWithChildren {
  title?: string;
  headerShown?: boolean;
  backColor?: string;
  header?: React.ReactNode;
}

const Screen = ({
  children,
  title,
  headerShown = true,
  backColor = '#FFEAEA',
  header,
}: IScreen) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backColor,
          paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 20,
          paddingBottom: insets.bottom,
        },
      ]}>
      {headerShown && <ScreenHeader>{title}</ScreenHeader>}
      {header}
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

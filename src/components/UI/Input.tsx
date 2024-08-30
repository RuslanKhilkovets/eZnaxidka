import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

import {AppIcon} from '@/components';

interface IInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  label?: string;
  labelStyle?: TextStyle;
  error?: string;
  errorStyle?: TextStyle;
  disabled?: boolean;
  mask?: string;
  maskOptions?: Record<string, any>;
  maxLength?: number;
  searchMode?: boolean;
  endAdornment?: React.JSX.Element | null;
  numberOfLines?: number; // Add this prop
  multiline?: boolean; // Add this prop to enable multiline input
}

const Input: React.FC<IInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  style,
  inputStyle,
  label,
  labelStyle,
  error,
  disabled,
  mask,
  maskOptions,
  maxLength,
  searchMode,
  endAdornment,
  numberOfLines = 1, // Default to 1 line
  multiline = false, // Default to single-line input
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <View style={[style]}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          !!error && styles.error,
          isFocused && styles.activeInput,
          disabled && styles['disabled'],
          multiline && {height: numberOfLines * 25}, // Adjust height based on number of lines
        ]}>
        {mask ? (
          <TextInputMask
            type={'custom'}
            options={{
              mask,
              ...maskOptions,
            }}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            editable={!disabled}
            maxLength={maxLength}
            numberOfLines={numberOfLines} // Apply numberOfLines
            multiline={multiline} // Apply multiline
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.input,
              inputStyle,
              isFocused && styles.activeInput,
              disabled && styles.disabled,
            ]}
          />
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={showPassword}
            editable={!disabled}
            maxLength={maxLength}
            numberOfLines={numberOfLines} // Apply numberOfLines
            multiline={multiline} // Apply multiline
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.input,
              inputStyle,
              multiline && {height: numberOfLines * 20}, // Adjust height based on number of lines
            ]}
          />
        )}
        {endAdornment && (
          <View style={styles.endAdornment}>{endAdornment}</View>
        )}
        {secureTextEntry && !mask && (
          <TouchableOpacity
            style={styles.endAdornment}
            onPress={handleTogglePasswordVisibility}>
            <AppIcon name={!showPassword ? 'see' : 'hide'} />
          </TouchableOpacity>
        )}
        {searchMode && (
          <AppIcon
            style={styles.endAdornment}
            name="search"
            color={'#757575'}
          />
        )}
      </View>
      {!!error && <Text style={[styles.errorText]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Raleway-Medium',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: 60,
    borderColor: '#e7e7e7',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Raleway-Regular',
  },
  activeInput: {
    borderColor: '#000',
  },
  error: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#ff0000',
    marginVertical: 5,
  },
  disabled: {
    color: '#757575',
    userSelect: 'none',
  },
  endAdornment: {
    marginLeft: 5,
  },
});

export default Input;

import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#282828', // Spotify dark gray background
        borderLeftWidth: 0,         // Remove the default left border line
        width: 'auto',              // Let it scale naturally or set a max-width
        
        minWidth: '70%',
        maxWidth: '90%',
        alignSelf: 'center',
        borderRadius: 50,           // Pill-shaped corners
        height: 50,                 // Sleek, compact height
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',       // Center text horizontally like Spotify
      }}
      text1Style={{
        color: '#FFFFFF',           // Crisp white text
        fontSize: 14,
        fontWeight: '700',          // Bold headline
        textAlign: 'center',
      }}
      text2Style={{
        color: '#B3B3B3',           // Muted gray subtext
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#282828', // Keeps dark theme uniform
        borderLeftWidth: 0,         
        width: 'auto',
        minWidth: '70%',
        maxWidth: '90%',
        alignSelf: 'center',
        borderRadius: 50,
        height: 50,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      text1Style={{
        color: '#FF5A5A',           // Soft, clean red tint for errors instead of a thick border
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
      }}
      text2Style={{
        color: '#B3B3B3',
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
      }}
    />
  ),
};



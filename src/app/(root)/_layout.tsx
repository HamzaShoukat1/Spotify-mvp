import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

export default function _layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <Slot />
    </View>
  )
}
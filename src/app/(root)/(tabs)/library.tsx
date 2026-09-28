import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Library() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      {<KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >

        <View>
          <Text>

            hazma
          </Text>
        </View>



      </KeyboardAvoidingView>}

    </SafeAreaView>


  )
}
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#282828',
        borderLeftWidth: 0,
        width: '80%',
        maxWidth: 340,
        alignSelf: 'center',
        borderRadius: 25,
        height: 'auto',
        minHeight: 52,
        paddingVertical: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
      }}
      text2Style={{
        color: '#B3B3B3',
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 2,
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#282828',
        borderLeftWidth: 0,
        width: '80%',
        maxWidth: 340,
        alignSelf: 'center',
        borderRadius: 25,
        height: 'auto',
        minHeight: 52,
        paddingVertical: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      text1Style={{
        color: '#FF5A5A',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
      }}
      text2Style={{
        color: '#B3B3B3',
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 2,
      }}
    />
  ),
};

export function formatDisplayDate(dateString: any) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return 'Invalid Date';

  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
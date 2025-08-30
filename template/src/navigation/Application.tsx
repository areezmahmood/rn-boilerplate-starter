import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import { ChatScreen, Example, Startup } from '@/screens';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { ChatHeader, HeaderActionsProvider } from '@/components/templates';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();

  return (
    <SafeAreaProvider>
      <HeaderActionsProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            key={variant}
            initialRouteName={Paths.ChatScreen}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen component={Startup} name={Paths.Startup} />
            <Stack.Screen component={Example} name={Paths.Example} />
            <Stack.Screen
              component={ChatScreen}
              name={Paths.ChatScreen}
              options={{
                headerShown: true,
                headerBackTitle: '',
                header(props) {
                  return <ChatHeader {...props} />;
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </HeaderActionsProvider>
      <Toasts
        defaultStyle={{
          view: {
            backgroundColor: variant === 'dark' ? '#212331' : '#f7f7f7',
          },
          pressable: {
            backgroundColor: variant === 'dark' ? '#212331' : 'f7f7f7',
          },
          text: {
            color: variant === 'dark' ? 'white' : 'black',
          },
        }}
      />
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;

import 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKVLoader } from 'react-native-mmkv-storage';

import ApplicationNavigator from '@/navigation/Application';
import { ThemeProvider } from '@/theme';
import '@/translations';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StoresProvider } from './stores';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const storage = new MMKVLoader().initialize();

function App() {
  return (
    <GestureHandlerRootView>
      <StoresProvider>

      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
              <KeyboardProvider>

          <ApplicationNavigator />
          </KeyboardProvider>
        </ThemeProvider>
      </QueryClientProvider>
      </StoresProvider>

    </GestureHandlerRootView>
  );
}

export default App;

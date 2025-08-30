import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, StackActions, useRoute } from '@react-navigation/native';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import RNBounceable from '@freakycoder/react-native-bounceable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

interface HeaderActionsContextType {
  actions: {
    onCallPress?: () => void;
    onVideoPress?: () => void;
    onAvatarPress?: () => void;
    onNamePress?: () => void;
  };
  setActions: (actions: Partial<HeaderActionsContextType['actions']>) => void;
}
const HeaderActionsContext = createContext<HeaderActionsContextType | null>(
  null,
);
export const HeaderActionsProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [actions, setActionsState] = useState<
    HeaderActionsContextType['actions']
  >({});

  const setActions = useCallback(
    (newActions: Partial<HeaderActionsContextType['actions']>) => {
      setActionsState(prev => ({ ...prev, ...newActions }));
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      actions,
      setActions,
    }),
    [actions, setActions],
  );

  return (
    <HeaderActionsContext.Provider value={contextValue}>
      {children}
    </HeaderActionsContext.Provider>
  );
};
export const useHeaderActions = () => {
  const context = useContext(HeaderActionsContext);

  if (context === null) {
    console.error(
      'useHeaderActions must be used within a HeaderActionsProvider. Make sure to wrap your app with HeaderActionsProvider.',
    );
    return { actions: {}, setActions: () => {} };
  }

  return context;
};
export const useSetHeaderActions = (
  actions: Partial<HeaderActionsContextType['actions']>,
) => {
  const { setActions } = useHeaderActions();

  useEffect(() => {
    setActions(actions);

    return () => {
      setActions({
        onCallPress: undefined,
        onVideoPress: undefined,
        onAvatarPress: undefined,
        onNamePress: undefined,
      });
    };
  }, [setActions, actions]);
};

function throttle<T extends (...args: any[]) => void>(
  func: T,
  duration: number,
): T {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return function (this: unknown, ...args) {
    if (timeout == null) {
      func.apply(this, args);

      timeout = setTimeout(() => {
        timeout = undefined;
      }, duration);
    }
  } as T;
}

type ChatScreenRouteParams = RouteProp<RootStackParamList, Paths.ChatScreen>;

interface ChatHeaderProps extends StackHeaderProps {
  callButton?: boolean;
  videoButton?: boolean;
}

export default function ChatHeader({
  back,
  layout,
  progress,
  options,
  route,
  navigation,
  styleInterpolator,
  callButton = true,
  videoButton = true,
}: ChatHeaderProps) {
  const { actions } = useHeaderActions();
  const { onCallPress, onVideoPress, onAvatarPress, onNamePress } = actions;

  const insets = useSafeAreaInsets();
  const screenRoute = useRoute<ChatScreenRouteParams>();
  const { name, uri } = screenRoute.params || { name: '', uri: '' };

  const previousTitle = React.useMemo(() => {
    if (options.headerBackTitle !== undefined) {
      return options.headerBackTitle;
    }
    return back?.title;
  }, [options.headerBackTitle, back?.title]);

  const goBack = React.useCallback(
    throttle(() => {
      if (navigation.isFocused() && navigation.canGoBack()) {
        navigation.dispatch({
          ...StackActions.pop(),
          source: route.key,
        });
      }
    }, 50),
    [navigation, route.key],
  );

  const { statusBarHeight, headerHeight, styles } = React.useMemo(() => {
    const statusBarHeight = insets.top;
    const headerHeight =
      getDefaultHeaderHeight(
        layout,
        options.presentation === 'modal',
        insets.top,
      ) || 44;
    const { height } = Dimensions.get('window');

    const styles = {
      headerBackTitleStyle:
        options.headerBackTitleStyle &&
        !('animated' in options.headerBackTitleStyle)
          ? StyleSheet.flatten(options.headerBackTitleStyle as object)
          : {},
      headerBackContainerStyle:
        options.headerLeftContainerStyle &&
        !('animated' in options.headerLeftContainerStyle)
          ? StyleSheet.flatten(options.headerLeftContainerStyle as object)
          : {},
      headerContainerStyle:
        options.headerStyle && !('animated' in options.headerStyle)
          ? StyleSheet.flatten(options.headerStyle as object)
          : {},
      headerRightContainerStyle:
        options.headerRightContainerStyle &&
        !('animated' in options.headerRightContainerStyle)
          ? StyleSheet.flatten(options.headerRightContainerStyle as object)
          : {},
    };

    return {
      statusBarHeight,
      headerHeight: headerHeight + height * 0.03,
      styles,
    };
  }, [insets.top, layout, options, Dimensions.get('window').height]);

  const renderLeftContent = () => {
    if (options.headerLeft) {
      return options.headerLeft({
        onPress: goBack,
        tintColor: options.headerTintColor,
      });
    }

    return (
      <RNBounceable
        onPress={goBack}
        style={[localStyles.backButton, styles.headerBackContainerStyle]}
      >
        <MaterialIcons
          size={22}
          name="arrow-back-ios"
          color={options.headerTintColor}
        />
        <Text
          style={[
            localStyles.backTitle,
            { color: options.headerTintColor },
            styles.headerBackTitleStyle,
          ]}
        >
          {previousTitle ?? 'Back'}
        </Text>
      </RNBounceable>
    );
  };

  const renderRightContent = () => {
    if (options.headerRight) {
      return options.headerRight({ tintColor: options.headerTintColor });
    }
    const buttonsToRender = [];
    if (callButton !== false) {
      buttonsToRender.push(
        <RNBounceable
          key="call"
          onPress={
            onCallPress ||
            (() => {
              console.error(
                'Call action not defined, Kindly use the useSetHeaderActions() to define it',
              );
            })
          }
          style={localStyles.actionButton}
        >
          <MaterialIcons
            size={22}
            name="call"
            color={options.headerTintColor}
          />
        </RNBounceable>,
      );
    }
    if (videoButton !== false) {
      buttonsToRender.push(
        <RNBounceable
          key="video"
          onPress={
            onVideoPress ||
            (() => {
              console.error(
                'Video action not defined, Kindly use the useSetHeaderActions() to define it',
              );
            })
          }
          style={localStyles.actionButton}
        >
          <MaterialIcons
            size={22}
            name="videocam"
            color={options.headerTintColor}
          />
        </RNBounceable>,
      );
    }
    if (buttonsToRender.length === 0) {
      return null;
    }
    return (
      <View
        style={[localStyles.rightContainer, styles.headerRightContainerStyle]}
      >
        {buttonsToRender}
      </View>
    );
  };
  const { layout: themeLayout, gutters } = useTheme();
  return (
    <View
      style={[
        {
          paddingTop: statusBarHeight,
          height: headerHeight,
          backgroundColor: 'white',
        },
        styles.headerContainerStyle,
      ]}
    >
      <View
        style={[
          {
            paddingHorizontal: '2.5%',
          },
          themeLayout.flex_1,
          themeLayout.row,
          themeLayout.justifyBetween,
          themeLayout.itemsCenter,
        ]}
      >
        <View
          style={[themeLayout.itemsCenter, themeLayout.row, themeLayout.flex_1]}
        >
          {renderLeftContent()}

          <View
            style={[
              themeLayout.itemsCenter,
              themeLayout.row,
              themeLayout.flex_1,
            ]}
          >
            <RNBounceable
              onPress={
                onAvatarPress ||
                (() => {
                  console.error(
                    'Avatar action not defined,Kindly use the useSetHeaderActions() to define it',
                  );
                })
              }
              style={localStyles.avatar}
            >
              <Image
                style={{ width: 50, height: 50 }}
                source={{
                  uri: uri || 'https://unsplash.it/400/400?image=1',
                }}
                resizeMode={'cover'}
              />
            </RNBounceable>

            <RNBounceable
              onPress={
                onNamePress ||
                (() => {
                  console.error(
                    'Name action not defined,Kindly use the useSetHeaderActions() to define it',
                  );
                })
              }
              style={localStyles.nameContainer}
            >
              <Text
                style={[
                  localStyles.nameText,
                  { color: options.headerTintColor },
                ]}
              >
                {name || 'Chat'}
              </Text>
            </RNBounceable>
          </View>
        </View>

        {renderRightContent()}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTitle: {
    fontSize: 18,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 10,
    overflow: 'hidden',
  },
  nameContainer: {
    marginLeft: 10,
    flex: 1,
    padding: 5,
  },
  nameText: {
    fontSize: 18,
  },
  rightContainer: {
    maxWidth: 75,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});

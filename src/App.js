import React, {Node, useContext, useEffect, useState} from 'react';
import AppRouter from 'components/root/AppRouter';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {userChanged} from 'services/redux/userSlice';
import Preloader from 'components/root/Preloader';
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DefaultDarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {SettingsContext} from 'SettingsProvider';
import NotificationMessageProvider from 'components/root/NotificationMessageProvider';

const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
    background: 'lightgray',
  },
};

const Main = () => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);
  const {settings} = useContext(SettingsContext);

  useEffect(
    () =>
      auth().onAuthStateChanged(user => {
        dispatch(userChanged(user));
        if (initializing) {
          setInitializing(false);
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return initializing ? (
    <Preloader loading />
  ) : (
    <PaperProvider
      theme={settings.theme === 'dark' ? DefaultDarkTheme : defaultTheme}>
      <NotificationMessageProvider>
        <AppRouter />
      </NotificationMessageProvider>
    </PaperProvider>
  );
};

const App: () => Node = () => <Main />;

export default App;

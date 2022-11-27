import React, {createContext, useEffect, useState} from 'react';
import {enableLatestRenderer} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

const requestGeoLocation = async () =>
  (await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  )) ||
  (await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  )) === PermissionsAndroid.RESULTS.GRANTED;

const GeoLocationContext = createContext();

const GeoLocationProvider = ({children}) => {
  const [position, setPosition] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (!initialized) {
      enableLatestRenderer();
      requestGeoLocation().then(
        result => setInitialized(result) && setEnabled(result),
      );
    }
  }, [initialized]);

  useEffect(() => {
    let id;
    if (initialized) {
      id = Geolocation.watchPosition(
        ({coords}) => {
          setEnabled(true);
          setError(null);
          setPosition(coords);
        },
        e => {
          setError(e);
          setEnabled(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
        },
      );
    }
    return () => {
      if (id) {
        Geolocation.clearWatch(id);
      }
    };
  }, [enabled, error, initialized]);

  return (
    <GeoLocationContext.Provider value={{position, enabled, error}}>
      {children}
    </GeoLocationContext.Provider>
  );
};

export {GeoLocationContext, GeoLocationProvider};

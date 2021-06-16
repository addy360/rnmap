import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import winDimensions from "../constants/Layout";

import { Text, View } from "./Themed";
import MapView, { Geojson } from "react-native-maps";
import * as Location from "expo-location";

interface Coo {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export default function EditScreenInfo({ path }: { path: string }) {
  const [Coords, setCoords] = useState<Coo | undefined>(undefined);
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return;

    const { coords } = await Location.getCurrentPositionAsync();
    if (!coords) return;

    setCoords(coords);
  };
  useEffect(() => {
    getLocation();
  }, []);

  const myPlace = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [Coords?.longitude, Coords?.latitude],
        },
      },
    ],
  };
  return (
    <View style={styles.container}>
      {!Coords ? (
        <View>
          <Text>Getting your current position</Text>
        </View>
      ) : (
        <MapView style={styles.map}>
          <Geojson
            geojson={myPlace}
            strokeColor="red"
            fillColor="green"
            strokeWidth={2}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 50,
    height: winDimensions.window.height,
    width: winDimensions.window.width,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});

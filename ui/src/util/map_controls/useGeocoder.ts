import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from 'maplibre-gl';
import { store } from "~/store/store";

export function useGeocoder(map: maplibregl.Map) {
  
  const geocoderApi = {
  forwardGeocode: async (config) => {
      const features = [];
      try {
          const request =
      `https://nominatim.openstreetmap.org/search?q=${
          config.query
      }&format=geojson&polygon_geojson=1&addressdetails=1&countrycodes=${store.country.toLowerCase()}`;
          const response = await fetch(request);
          const geojson = await response.json();
          for (const feature of geojson.features) {
            
              const center = [
                  feature.bbox[0] +
              (feature.bbox[2] - feature.bbox[0]) / 2,
                  feature.bbox[1] +
              (feature.bbox[3] - feature.bbox[1]) / 2
              ];
              const point = {
                  type: 'Feature',
                  geometry: {
                      type: 'Point',
                      coordinates: center
                  },
                  place_name: feature.properties.display_name,
                  properties: feature.properties,
                  text: feature.properties.display_name,
                  place_type: ['place'],
                  center
              };
              features.push(point);
          
        }
      } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
      }

      return {
          features
      };
  }
};
map.addControl(
  new MaplibreGeocoder(geocoderApi, {
      maplibregl,
      marker: true,
      showResultMarkers: true,
      showResultsWhileTyping: true,
      collapsed: true
  })
);
}
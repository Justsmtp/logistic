/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import LoadingSpinner from './LoadingSpinner';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#1a1a2e' }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8b92ab' }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1a1a2e' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0f1523' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2d2d44' }],
    },
  ],
};

const DeliveryMap = ({ delivery }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Calculate center and zoom to fit all markers
  useEffect(() => {
    if (!delivery) return;

    const pickupCoords = delivery.pickupAddress?.location?.coordinates;
    const deliveryCoords = delivery.deliveryAddress?.location?.coordinates;

    if (pickupCoords && deliveryCoords) {
      // Center between pickup and delivery
      const centerLat = (pickupCoords[1] + deliveryCoords[1]) / 2;
      const centerLng = (pickupCoords[0] + deliveryCoords[0]) / 2;
      setCenter({ lat: centerLat, lng: centerLng });
    } else if (pickupCoords) {
      setCenter({ lat: pickupCoords[1], lng: pickupCoords[0] });
    } else if (deliveryCoords) {
      setCenter({ lat: deliveryCoords[1], lng: deliveryCoords[0] });
    } else {
      // Default to Lagos, Nigeria
      setCenter({ lat: 6.5244, lng: 3.3792 });
    }
  }, [delivery]);

  const onLoad = useCallback((map) => {
    setMap(map);

    // Fit bounds to show all markers
    if (delivery) {
      const bounds = new window.google.maps.LatLngBounds();
      
      const pickupCoords = delivery.pickupAddress?.location?.coordinates;
      const deliveryCoords = delivery.deliveryAddress?.location?.coordinates;
      const driverCoords = delivery.driver?.currentLocation?.coordinates;

      if (pickupCoords) {
        bounds.extend({ lat: pickupCoords[1], lng: pickupCoords[0] });
      }
      if (deliveryCoords) {
        bounds.extend({ lat: deliveryCoords[1], lng: deliveryCoords[0] });
      }
      if (driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0) {
        bounds.extend({ lat: driverCoords[1], lng: driverCoords[0] });
      }

      map.fitBounds(bounds);
    }
  }, [delivery]);

  if (loadError) {
    return (
      <div className="bg-dark-800 rounded-xl p-8 text-center">
        <p className="text-red-400">⚠️ Error loading map</p>
        <p className="text-gray-500 text-sm mt-2">
          Please check your Google Maps API key
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-dark-800 rounded-xl p-12">
        <LoadingSpinner message="Loading map..." />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="bg-dark-800 rounded-xl p-8 text-center">
        <p className="text-gray-400">📍 Location data not available</p>
      </div>
    );
  }

  const pickupCoords = delivery.pickupAddress?.location?.coordinates;
  const deliveryCoords = delivery.deliveryAddress?.location?.coordinates;
  const driverCoords = delivery.driver?.currentLocation?.coordinates;

  // Path coordinates for the route
  const pathCoordinates = [];
  if (pickupCoords) {
    pathCoordinates.push({ lat: pickupCoords[1], lng: pickupCoords[0] });
  }
  if (driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0) {
    pathCoordinates.push({ lat: driverCoords[1], lng: driverCoords[0] });
  }
  if (deliveryCoords) {
    pathCoordinates.push({ lat: deliveryCoords[1], lng: deliveryCoords[0] });
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      options={mapOptions}
    >
      {/* Pickup Marker */}
      {pickupCoords && (
        <Marker
          position={{ lat: pickupCoords[1], lng: pickupCoords[0] }}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="15" fill="#00d4ff" opacity="0.3"/>
                <circle cx="20" cy="20" r="10" fill="#00d4ff"/>
                <text x="20" y="25" font-size="16" text-anchor="middle" fill="white">📦</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          title="Pickup Location"
        />
      )}

      {/* Delivery Marker */}
      {deliveryCoords && (
        <Marker
          position={{ lat: deliveryCoords[1], lng: deliveryCoords[0] }}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="15" fill="#10b981" opacity="0.3"/>
                <circle cx="20" cy="20" r="10" fill="#10b981"/>
                <text x="20" y="25" font-size="16" text-anchor="middle" fill="white">📍</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          title="Delivery Location"
        />
      )}

      {/* Driver Marker (if available and has valid coordinates) */}
      {driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0 && (
        <Marker
          position={{ lat: driverCoords[1], lng: driverCoords[0] }}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="15" fill="#a855f7" opacity="0.3"/>
                <circle cx="20" cy="20" r="10" fill="#a855f7"/>
                <text x="20" y="25" font-size="16" text-anchor="middle" fill="white">🚚</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          title={`Driver: ${delivery.driver?.name}`}
          animation={window.google.maps.Animation.BOUNCE}
        />
      )}

      {/* Route Polyline */}
      {pathCoordinates.length > 1 && (
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: '#00d4ff',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            geodesic: true,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default DeliveryMap;
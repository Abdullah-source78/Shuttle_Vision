import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface BusLocation {
  id: string;
  bus_number: string;
  route_name: string;
  location?: {
    latitude: number;
    longitude: number;
    available_seats: number;
  };
}

interface TransitMapProps {
  buses: BusLocation[];
}

export const TransitMap = ({ buses }: TransitMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map centered on New York City (where our test data is)
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([40.7580, -73.9855], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Create custom bus icon based on availability
    const createBusIcon = (availableSeats: number, capacity: number = 40) => {
      const fillPercentage = (availableSeats / capacity) * 100;
      let color = "#ef4444"; // red for full
      if (fillPercentage > 50) color = "#22c55e"; // green for plenty
      else if (fillPercentage > 20) color = "#f59e0b"; // orange for filling up

      return L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            animation: pulse 2s infinite;
          ">
            🚌
          </div>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // Update markers
    buses.forEach((bus) => {
      if (!bus.location) return;

      const { latitude, longitude, available_seats } = bus.location;
      const position: L.LatLngExpression = [latitude, longitude];

      if (markersRef.current[bus.id]) {
        // Update existing marker
        markersRef.current[bus.id].setLatLng(position);
        markersRef.current[bus.id].setIcon(createBusIcon(available_seats));
      } else {
        // Create new marker
        const marker = L.marker(position, {
          icon: createBusIcon(available_seats),
        }).addTo(mapRef.current!);

        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <strong style="font-size: 16px; color: #0891b2;">${bus.bus_number}</strong><br/>
            <span style="color: #64748b; font-size: 13px;">${bus.route_name}</span><br/>
            <div style="margin-top: 8px; padding: 6px; background: #f1f5f9; border-radius: 6px;">
              <span style="font-size: 14px;">
                <strong style="color: ${available_seats > 10 ? "#22c55e" : available_seats > 5 ? "#f59e0b" : "#ef4444"}">
                  ${available_seats} seats
                </strong> available
              </span>
            </div>
          </div>
        `);

        markersRef.current[bus.id] = marker;
      }
    });

    // Remove markers for buses that no longer exist
    Object.keys(markersRef.current).forEach((busId) => {
      if (!buses.find((b) => b.id === busId)) {
        mapRef.current?.removeLayer(markersRef.current[busId]);
        delete markersRef.current[busId];
      }
    });

    // Adjust map bounds to show all buses
    if (buses.length > 0 && buses.some((b) => b.location)) {
      const bounds = L.latLngBounds(
        buses
          .filter((b) => b.location)
          .map((b) => [b.location!.latitude, b.location!.longitude] as L.LatLngExpression)
      );
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        Object.values(markersRef.current).forEach((marker) => {
          mapRef.current?.removeLayer(marker);
        });
      }
    };
  }, [buses]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

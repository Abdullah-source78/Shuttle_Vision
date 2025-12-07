import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BusData {
  id: string;
  bus_number: string;
  route_name: string;
  capacity: number;
  location?: {
    latitude: number;
    longitude: number;
    available_seats: number;
    updated_at: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
}

interface BusListProps {
  buses: BusData[];
}

export const BusList = ({ buses }: BusListProps) => {
  const getAvailabilityColor = (available: number, capacity: number) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return "success";
    if (percentage > 20) return "warning";
    return "destructive";
  };

  const getAvailabilityLabel = (available: number, capacity: number) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return "Available";
    if (percentage > 20) return "Filling Up";
    return "Almost Full";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-foreground">Active Buses</h2>
        <Badge variant="default" className="ml-auto">
          {buses.length} buses
        </Badge>
      </div>

      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
        {buses.map((bus) => (
          <Card
            key={bus.id}
            className="border-border hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Bus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{bus.bus_number}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{bus.route_name}</p>
                  </div>
                </div>
                {bus.location && (
                  <Badge
                    variant={getAvailabilityColor(bus.location.available_seats, bus.capacity) as any}
                  >
                    {getAvailabilityLabel(bus.location.available_seats, bus.capacity)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {bus.location ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {bus.location.available_seats} / {bus.capacity}
                    </span>
                    <span className="text-muted-foreground">seats available</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {bus.location.latitude.toFixed(4)}, {bus.location.longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      Updated {formatDistanceToNow(new Date(bus.location.updated_at), { addSuffix: true })}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-success pulse-live ml-auto" />
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No location data available</div>
              )}

              {bus.driver && (
                <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                  Driver: {bus.driver.name}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

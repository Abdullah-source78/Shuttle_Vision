import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, Bus, Loader2, Navigation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusInfo {
  id: string;
  bus_number: string;
  route_name: string;
  capacity: number;
}

const DriverPortal = () => {
  const [buses, setBuses] = useState<BusInfo[]>([]);
  const [selectedBus, setSelectedBus] = useState<string>("");
  const [availableSeats, setAvailableSeats] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const { data, error } = await supabase.from("buses").select("*");
      if (error) throw error;
      setBuses(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buses:", error);
      toast({
        title: "Error",
        description: "Failed to load buses",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setGpsActive(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "GPS Active",
            description: "Location acquired successfully",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "GPS Error",
            description: "Unable to get your location",
            variant: "destructive",
          });
          setGpsActive(false);
        }
      );
    } else {
      toast({
        title: "GPS Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setGpsActive(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedBus || !availableSeats || !location) {
      toast({
        title: "Missing Information",
        description: "Please select a bus, get GPS location, and enter available seats",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      // Check if location exists for this bus
      const { data: existing } = await supabase
        .from("bus_locations")
        .select("id")
        .eq("bus_id", selectedBus)
        .single();

      if (existing) {
        // Update existing location
        const { error } = await supabase
          .from("bus_locations")
          .update({
            latitude: location.lat,
            longitude: location.lng,
            available_seats: parseInt(availableSeats),
            updated_at: new Date().toISOString(),
          })
          .eq("bus_id", selectedBus);

        if (error) throw error;
      } else {
        // Insert new location
        const { error } = await supabase.from("bus_locations").insert({
          bus_id: selectedBus,
          latitude: location.lat,
          longitude: location.lng,
          available_seats: parseInt(availableSeats),
        });

        if (error) throw error;
      }

      toast({
        title: "Update Successful",
        description: "Bus location and availability updated",
      });

      // Refresh GPS location after update
      getCurrentLocation();
    } catch (error) {
      console.error("Error updating location:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update bus information",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedBusInfo = buses.find((b) => b.id === selectedBus);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Bus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Driver Portal</h1>
              <p className="text-sm text-muted-foreground">Update Your Bus Status</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Update Bus Information</CardTitle>
              <CardDescription>Keep students informed with real-time updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bus">Select Your Bus</Label>
                <Select value={selectedBus} onValueChange={setSelectedBus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.bus_number} - {bus.route_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBusInfo && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Route</p>
                  <p className="font-semibold">{selectedBusInfo.route_name}</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Total Capacity</p>
                  <p className="font-semibold">{selectedBusInfo.capacity} seats</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="location">GPS Location</Label>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  variant={gpsActive ? "default" : "outline"}
                  className="w-full"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {location
                    ? `GPS Active (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                    : "Get Current Location"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Available Seats</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="seats"
                    type="number"
                    placeholder="Enter number of available seats"
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(e.target.value)}
                    className="pl-10"
                    min="0"
                    max={selectedBusInfo?.capacity || 50}
                  />
                </div>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updating || !selectedBus || !location || !availableSeats}
                className="w-full"
                size="lg"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Update Location & Availability
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverPortal;

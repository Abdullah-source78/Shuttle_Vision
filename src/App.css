import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TransitMap } from "@/components/TransitMap";
import { BusList } from "@/components/BusList";
import { Bus, Loader2 } from "lucide-react";

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

const StudentPortal = () => {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusData = async () => {
    try {
      const { data: busesData, error: busesError } = await supabase
        .from("buses")
        .select(`
          *,
          bus_locations(*),
          drivers(*)
        `);

      if (busesError) throw busesError;

      const formattedBuses: BusData[] = (busesData || []).map((bus: any) => ({
        id: bus.id,
        bus_number: bus.bus_number,
        route_name: bus.route_name,
        capacity: bus.capacity,
        location: bus.bus_locations?.[0] ? {
          latitude: parseFloat(bus.bus_locations[0].latitude),
          longitude: parseFloat(bus.bus_locations[0].longitude),
          available_seats: bus.bus_locations[0].available_seats,
          updated_at: bus.bus_locations[0].updated_at,
        } : undefined,
        driver: bus.drivers?.[0] ? {
          name: bus.drivers[0].name,
          phone: bus.drivers[0].phone,
        } : undefined,
      }));

      setBuses(formattedBuses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bus data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("bus_locations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bus_locations",
        },
        () => {
          fetchBusData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Bus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart Transit</h1>
              <p className="text-sm text-muted-foreground">Real-time Bus Tracking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden h-[600px]">
              <TransitMap buses={buses} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <BusList buses={buses} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPortal;

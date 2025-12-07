import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BusInfo {
  id: string;
  bus_number: string;
  route_name: string;
  capacity: number;
}

interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  bus_id: string;
}

const AdminPortal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedSection, setSelectedSection] = useState<'add' | 'deleteBus' | 'deleteDriver'>('add');

  const [newBus, setNewBus] = useState({ bus_number: '', route_name: '', capacity: '' });
  const [drivers, setDrivers] = useState({ name: '', phone: '', bus_id: '' });

  const [buses, setBuses] = useState<BusInfo[]>([]);
  const [allDrivers, setAllDrivers] = useState<DriverInfo[]>([]);

  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const { toast } = useToast();

  const fetchBuses = async () => {
    const { data, error } = await supabase.from('buses').select('*');
    if (!error) setBuses(data || []);
  };

  const fetchDrivers = async () => {
    const { data, error } = await supabase.from('drivers').select('*');
    if (!error) setAllDrivers(data || []);
  };

  // LOGIN
  const handleLogin = () => {
    if (username === 'admin1' && password === '111' || username === 'admin2' && password === '222') {
      setIsAuthenticated(true);
      fetchBuses();
      fetchDrivers();
      toast({ title: 'Login Successful', description: 'Welcome Admin!' });
    } else {
      toast({ title: 'Login Failed', description: 'Invalid credentials', variant: 'destructive' });
    }
  };

  // ADD BUS
  const handleAddBus = async () => {
    const { bus_number, route_name, capacity } = newBus;
    if (!bus_number || !route_name || !capacity) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill all fields for adding a bus.',
        variant: 'destructive'
      });
      return;
    }

    const { error } = await supabase.from('buses').insert([
      { bus_number, route_name, capacity: parseInt(capacity), created_at: new Date().toISOString() }
    ]);

    if (!error) {
      toast({ title: 'Bus Added', description: 'Bus added successfully!' });
      setNewBus({ bus_number: '', route_name: '', capacity: '' });
      fetchBuses();
    }
  };

  // ADD DRIVER
  const handleAddDriver = async () => {
    const { name, phone, bus_id } = drivers;
    if (!name || !phone || !bus_id) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill all fields for adding a driver.',
        variant: 'destructive'
      });
      return;
    }

    const { error } = await supabase.from('drivers').insert([
      { name, phone, bus_id, created_at: new Date().toISOString() }
    ]);

    if (!error) {
      toast({ title: 'Driver Added', description: 'Driver added successfully!' });
      setDrivers({ name: '', phone: '', bus_id: '' });
      fetchDrivers();
    }
  };

  // DELETE BUS
  const handleDeleteBus = async () => {
    if (!selectedBusId)
      return toast({
        title: 'No Selection',
        description: 'Please select a bus to delete.',
        variant: 'destructive'
      });

    const { error } = await supabase.from('buses').delete().eq('id', selectedBusId);

    if (!error) {
      toast({ title: 'Bus Deleted', description: 'Bus successfully deleted.' });
      setSelectedBusId('');
      fetchBuses();
      fetchDrivers();
    }
  };

  // DELETE DRIVER
  const handleDeleteDriver = async () => {
    if (!selectedDriverId)
      return toast({
        title: 'No Selection',
        description: 'Please select a driver to delete.',
        variant: 'destructive'
      });

    const { error } = await supabase.from('drivers').delete().eq('id', selectedDriverId);

    if (!error) {
      toast({ title: 'Driver Deleted', description: 'Driver successfully deleted.' });
      setSelectedDriverId('');
      fetchDrivers();
    }
  };

  const availableBusesForDriver = buses.filter(
    (bus) => !allDrivers.some((driver) => driver.bus_id === bus.id)
  );

  

  const getBusesForDropdown = () => {
  if (selectedDriverId) {
    // editing existing driver
    const driver = allDrivers.find(d => d.id === selectedDriverId);
    return buses.filter(bus =>
      !allDrivers.some(d => d.bus_id === bus.id) || bus.id === driver?.bus_id
    );
  }

  // adding new driver
  return buses.filter(bus =>
    !allDrivers.some(d => d.bus_id === bus.id)
  );
};


  return (
    <div className="min-h-screen bg-background p-4">
      {!isAuthenticated ? (
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your admin credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button className="w-full" onClick={handleLogin}>Login</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-lg mx-auto space-y-4">

          {/* --- SECTION BUTTONS --- */}
          <div className="flex gap-2">
            <Button variant={selectedSection === 'add' ? 'default' : 'outline'} onClick={() => setSelectedSection('add')}>
              Add Bus / Driver
            </Button>
            <Button variant={selectedSection === 'deleteBus' ? 'default' : 'outline'} onClick={() => setSelectedSection('deleteBus')}>
              Delete Bus
            </Button>
            <Button variant={selectedSection === 'deleteDriver' ? 'default' : 'outline'} onClick={() => setSelectedSection('deleteDriver')}>
              Delete Driver
            </Button>
          </div>

          {/* --- ADD SECTION --- */}
          {selectedSection === 'add' && (
            <>
              {/* ADD BUS */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Bus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input placeholder="Bus Number" value={newBus.bus_number} onChange={(e) => setNewBus({ ...newBus, bus_number: e.target.value })} />
                  <Input placeholder="Route Name" value={newBus.route_name} onChange={(e) => setNewBus({ ...newBus, route_name: e.target.value })} />
                  <Input placeholder="Capacity" type="number" value={newBus.capacity} onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })} />
                  <Button className="w-full" onClick={handleAddBus}>Add Bus</Button>
                </CardContent>
              </Card>

        
              {/* ADD DRIVER */}
<Card>
  <CardHeader>
    <CardTitle>Add / Assign Driver</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">

    {/* 1 — Select Existing Driver (optional) */}
    <Select
      onValueChange={(id) => {
        const d = allDrivers.find((x) => x.id === id);
        if (d) {
          setDrivers({
            name: d.name,
            phone: d.phone,
            bus_id: d.bus_id || "",
          });
          setSelectedDriverId(id);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select existing driver (optional)" />
      </SelectTrigger>
      <SelectContent>
        {allDrivers.map((driver) => (
          <SelectItem key={driver.id} value={driver.id}>
            {driver.name} — {driver.phone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {/* 2 — Name Field */}
    <Input
      placeholder="Driver Name"
      value={drivers.name}
      onChange={(e) => {
        setDrivers({ ...drivers, name: e.target.value });
        setSelectedDriverId(""); // typing makes it a new driver
      }}
    />

    {/* 3 — Phone Field */}
    <Input
      placeholder="Phone Number"
      value={drivers.phone}
      onChange={(e) => {
        setDrivers({ ...drivers, phone: e.target.value });
        setSelectedDriverId(""); // typing makes it a new driver
      }}
    />

    {/* 4 — Bus Selection */}
    <Select
  value={drivers.bus_id}
  onValueChange={(v) => setDrivers({ ...drivers, bus_id: v })}
>
  <SelectTrigger>
    <SelectValue placeholder="Select a bus" />
  </SelectTrigger>

  <SelectContent>
    {getBusesForDropdown().map((b) => (
      <SelectItem key={b.id} value={b.id}>
        {b.bus_number} — {b.route_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


    {/* 5 — Submit Button */}
    <Button
      className="w-full"
      onClick={async () => {
        if (selectedDriverId) {
          // UPDATE EXISTING DRIVER
          const { error } = await supabase
            .from("drivers")
            .update({
              name: drivers.name,
              phone: drivers.phone,
              bus_id: drivers.bus_id,
            })
            .eq("id", selectedDriverId);

          if (!error) {
            toast({
              title: "Driver Updated",
              description: "Existing driver updated successfully!",
            });
            fetchDrivers();
          }
        } else {
          // ADD NEW DRIVER
          const { error } = await supabase.from("drivers").insert([
            {
              name: drivers.name,
              phone: drivers.phone,
              bus_id: drivers.bus_id,
              created_at: new Date().toISOString(),
            },
          ]);

          if (!error) {
            toast({
              title: "Driver Added",
              description: "New driver added successfully!",
            });
            fetchDrivers();
          }
        }

        setDrivers({ name: "", phone: "", bus_id: "" });
        setSelectedDriverId("");
      }}
    >
      Save Driver
    </Button>

  </CardContent>
</Card>

            </>
          )}

          {/* --- DELETE BUS --- */}
          {selectedSection === 'deleteBus' && (
            <Card>
              <CardHeader>
                <CardTitle>Delete Bus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select value={selectedBusId} onValueChange={setSelectedBusId}>
                  <SelectTrigger><SelectValue placeholder="Select a bus" /></SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.bus_number} — {bus.route_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="destructive" className="w-full" onClick={handleDeleteBus}>
                  Delete Bus
                </Button>
              </CardContent>
            </Card>
          )}

          {/* --- DELETE DRIVER --- */}
          {selectedSection === 'deleteDriver' && (
            <Card>
              <CardHeader>
                <CardTitle>Delete Driver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                  <SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger>
                  <SelectContent>
                    {allDrivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="destructive" className="w-full" onClick={handleDeleteDriver}>
                  Delete Driver
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;

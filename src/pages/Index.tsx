import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bus, Users, MapPin, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-primary p-4 rounded-2xl mb-6">
            <Bus className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Shuttle Vision
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time GPS tracking, load estimation, and intelligent bus
            recommendations for smarter campus transportation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
<Link to="/student" className="block">
  <Card className="border-2 hover:border-primary transition-all duration-200 hover:shadow-lg cursor-pointer">
    <CardHeader>
      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-3">
        <Users className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl">Student Portal</CardTitle>
      <CardDescription className="text-base">
        View all buses in real-time, check available seats, and see
        estimated arrival times
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="w-full text-center">
        <Button className="w-full" size="lg">
          Open Student Portal
        </Button>
      </div>
    </CardContent>
  </Card>
</Link>

<Link to="/driver" className="block">
  <Card className="border-2 hover:border-primary transition-all duration-200 hover:shadow-lg cursor-pointer">
    <CardHeader>
      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-3">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl">Driver Portal</CardTitle>
      <CardDescription className="text-base">
        Update your GPS location and available seat count to help
                students track your bus
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="w-full text-center">
        <Button className="w-full" size="lg">
          Open Driver Portal
        </Button>
      </div>
    </CardContent>
  </Card>
</Link>

<Link to="/admin" className="block">
  <Card className="border-2 hover:border-primary transition-all duration-200 hover:shadow-lg cursor-pointer">
    <CardHeader>
      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-3">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl">Admin Portal</CardTitle>
      <CardDescription className="text-base">
                        Modify and add drivers + buses

      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="w-full text-center">
        <Button className="w-full" size="lg">
          Open Admin Portal
        </Button>
      </div>
    </CardContent>
  </Card>
</Link>
          
          {/* <Card className="border-2 hover:border-primary transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-3">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Driver Portal</CardTitle>
              <CardDescription className="text-base">
                Update your GPS location and available seat count to help
                students track your bus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/driver">
                <Button className="w-full" size="lg">
                  Open Driver Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
         
          <Card className="border-2 hover:border-primary transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-3">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription className="text-base">
                Modify and add drivers + buses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button className="w-full" size="lg">
                  Open Admin Portal
                </Button>
              </Link>
            </CardContent>
          </Card> */}
        </div>

        <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-success/10 p-3 rounded-xl w-fit mx-auto mb-3">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Real-time GPS</h3>
              <p className="text-sm text-muted-foreground">
                Live tracking of all buses on interactive map
              </p>
            </div>
            <div className="text-center">
              <div className="bg-warning/10 p-3 rounded-xl w-fit mx-auto mb-3">
                <Users className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Load Estimation</h3>
              <p className="text-sm text-muted-foreground">
                See available seats before the bus arrives
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 p-3 rounded-xl w-fit mx-auto mb-3">
                <Bus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Updates</h3>
              <p className="text-sm text-muted-foreground">
                Instant notifications when bus status changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Bus, LogOut, User } from "lucide-react";
import { ComplaintForm } from "./ComplaintForm";
import { ComplaintList } from "./ComplaintList";
import { UserProfile } from "./UserProfile";
interface UserDashboardProps {
  user: {
    email: string;
    name: string;
  };
  onLogout: () => void;
}

export interface Complaint {
  id: number;
  title: string;
  category: string;
  transportType: string;
  description: string;
  route: string;
  date: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  submittedAt: string;
  photos?: string[];
  photoUrls?: string[];
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const fetchMyComplaints = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) return;

    const res = await fetch("https://noble-adventure-production.up.railway.app/api/complaints/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();

    setComplaints(
      data.map((c: any) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        transportType: c.transportType,
        description: c.description,
        route: c.route,
        date: c.incidentDate,
        submittedAt: c.submittedAt,
        status:
          c.status === "IN_PROGRESS"
            ? "in-progress"
            : c.status.toLowerCase(),
        photos: c.photos ?? [],
        photoUrls: c.photoUrls ?? [],
      }))
    );
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-full">
              <Bus className="text-white" />
            </div>
            <div>
              <h1 className="text-lg">Public Transport Grievance System</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <User className="size-4" />
            {user.email}
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="mr-1 size-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="submit">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="submit">Submit Complaint</TabsTrigger>
            
            <TabsTrigger value="view">My Complaints</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Submit a New Complaint</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComplaintForm onSuccess={fetchMyComplaints} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="view">
            <div className="max-w-4xl mx-auto">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Your Submitted Complaints</CardTitle>
                  <CardDescription>
                    Track the status of your grievances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplaintList complaints={complaints} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="profile">
  <UserProfile />
</TabsContent>

        </Tabs>
      </main>
    </div>
  );
}

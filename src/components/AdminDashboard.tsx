import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Shield,
  LogOut,
  User,
  BarChart3,
  Users,
  UserCircle,
} from "lucide-react";

import { AdminComplaintList } from "./AdminComplaintList";
import { AdminProfile } from "./AdminProfile";
import { AdminManagement } from "./AdminManagement";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminFeedback } from "./AdminFeedback";
import type { Complaint } from "./UserDashboard";

interface AdminDashboardProps {
  user: {
    email: string;
    name: string;
  };
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  /* ================= AUTH INFO ================= */
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  let adminRole: "SENIOR_ADMIN" | "ADMIN" | null = null;
  let adminDepartment:
    | "BUS_OPERATIONS"
    | "TRAIN_OPERATIONS"
    | "METRO_OPERATIONS"
    | "ALL_OPERATIONS"
    | null = null;

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    adminRole = payload.role;
    adminDepartment = payload.department;
  }

  const isSeniorAdmin = adminRole === "SENIOR_ADMIN";
  const isBusAdmin = adminDepartment === "BUS_OPERATIONS";
  const isTrainAdmin = adminDepartment === "TRAIN_OPERATIONS";
  const isMetroAdmin = adminDepartment === "METRO_OPERATIONS";

  /* ================= STATE ================= */
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState("complaints");

  /* ================= FETCH ================= */
  const fetchAllComplaints = async () => {
    if (!token) return;

    const res = await fetch("http://noble-adventure-production.up.railway.app/api/admin/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();

    setAllComplaints(
      data.map((c: any) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        transportType: c.transportType,
        description: c.description,
        route: c.route,
        date: c.incidentDate,
        submittedAt: c.submittedAt,
        status: c.status.toLowerCase().replace("_", "-"),
        photoUrls: c.photoUrls ?? [],
      }))
    );
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  /* ================= FILTERS ================= */
  const busComplaints = allComplaints.filter(
    (c) => c.transportType === "Bus"
  );
  const trainComplaints = allComplaints.filter(
    (c) => c.transportType === "Train"
  );
  const metroComplaints = allComplaints.filter(
    (c) => c.transportType === "Metro"
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <div className="flex gap-3">
            <div className="bg-red-600 p-2 rounded-full">
              <Shield className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Public Transport Grievance Management
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <User className="size-4" />
            <span className="text-sm">{user.email}</span>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="size-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* ===== TOP TABS (ORDER FIXED) ===== */}
          <TabsList
            className={`grid w-full max-w-4xl mx-auto mb-8 ${
              isSeniorAdmin ? "grid-cols-5" : "grid-cols-3"
            }`}
          >
            <TabsTrigger value="complaints">
              <Shield className="size-4 mr-2" /> Complaints
            </TabsTrigger>

            <TabsTrigger value="feedback">
              Feedback
            </TabsTrigger>

            {isSeniorAdmin && (
              <TabsTrigger value="analytics">
                <BarChart3 className="size-4 mr-2" /> Analytics
              </TabsTrigger>
            )}

            {isSeniorAdmin && (
              <TabsTrigger value="admins">
                <Users className="size-4 mr-2" /> Admins
              </TabsTrigger>
            )}

            <TabsTrigger value="profile">
              <UserCircle className="size-4 mr-2" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* ===== FEEDBACK ===== */}
          <TabsContent value="feedback">
            <AdminFeedback adminDepartment={adminDepartment} />
          </TabsContent>

          {/* ===== COMPLAINTS ===== */}
          <TabsContent value="complaints">
            {isSeniorAdmin ? (
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-4 max-w-xl mx-auto mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="bus">Bus</TabsTrigger>
                  <TabsTrigger value="train">Train</TabsTrigger>
                  <TabsTrigger value="metro">Metro</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <AdminComplaintList
                    complaints={allComplaints}
                    refreshComplaints={fetchAllComplaints}
                  />
                </TabsContent>

                <TabsContent value="bus">
                  <AdminComplaintList
                    complaints={busComplaints}
                    refreshComplaints={fetchAllComplaints}
                  />
                </TabsContent>

                <TabsContent value="train">
                  <AdminComplaintList
                    complaints={trainComplaints}
                    refreshComplaints={fetchAllComplaints}
                  />
                </TabsContent>

                <TabsContent value="metro">
                  <AdminComplaintList
                    complaints={metroComplaints}
                    refreshComplaints={fetchAllComplaints}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <AdminComplaintList
                complaints={
                  isBusAdmin
                    ? busComplaints
                    : isTrainAdmin
                    ? trainComplaints
                    : metroComplaints
                }
                refreshComplaints={fetchAllComplaints}
              />
            )}
          </TabsContent>

          {/* ===== ANALYTICS ===== */}
          {isSeniorAdmin && (
            <TabsContent value="analytics">
              <AdminAnalytics complaints={allComplaints} />
            </TabsContent>
          )}

          {/* ===== ADMINS ===== */}
          {isSeniorAdmin && (
            <TabsContent value="admins">
              <AdminManagement />
            </TabsContent>
          )}

          {/* ===== PROFILE ===== */}
          <TabsContent value="profile">
            <AdminProfile user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

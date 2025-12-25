import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  MapPin,
  Tag,
  Bus,
  Train,
  Train as Metro,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type { Complaint } from "./UserDashboard";

interface AdminComplaintListProps {
  complaints: Complaint[];
  refreshComplaints: () => void;
}

/* ================= STATUS UI ================= */

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  resolved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

/* 🔥 BACKEND ENUM MAP (THE REAL FIX) */
const backendStatusMap: Record<string, string> = {
  pending: "PENDING",
  "in-progress": "IN_PROGRESS",
  resolved: "RESOLVED",
  rejected: "REJECTED",
};

const getTransportIcon = (type: string) => {
  switch (type) {
    case "Bus":
      return <Bus className="size-4" />;
    case "Train":
      return <Train className="size-4" />;
    case "Metro":
      return <Metro className="size-4" />;
    default:
      return <Bus className="size-4" />;
  }
};

export function AdminComplaintList({
  complaints,
  refreshComplaints,
}: AdminComplaintListProps) {
  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (
    complaintId: number,
    newStatus: Complaint["status"]
  ) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      toast.error("No auth token found");
      return;
    }

    const backendStatus = backendStatusMap[newStatus];

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/complaints/${complaintId}/status?status=${backendStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      setIsDialogOpen(false);
      refreshComplaints(); // ✅ single source of truth
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDialogOpen(true);
  };

  return (
    <>
      {/* LIST */}
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card
            key={complaint.id}
            className="bg-white border hover:shadow-md cursor-pointer"
            onClick={() => handleComplaintClick(complaint)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{complaint.title}</h3>
                    <Badge className={statusColors[complaint.status]}>
                      {statusLabels[complaint.status]}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {complaint.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {getTransportIcon(complaint.transportType)}
                      {complaint.transportType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="size-4" />
                      {complaint.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {complaint.route}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {new Date(complaint.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplaintClick(complaint);
                  }}
                >
                  <Eye className="size-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComplaint.title}</DialogTitle>
                <DialogDescription>
                  Complaint ID: #{selectedComplaint.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Update Status
                      </label>
                      <Select
                        value={selectedComplaint.status}
                        onValueChange={(value) =>
                          updateStatus(
                            selectedComplaint.id,
                            value as Complaint["status"]
                          )
                        }
                      >
                        <SelectTrigger className="w-48 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Badge
                      className={
                        statusColors[selectedComplaint.status]
                      }
                    >
                      {statusLabels[selectedComplaint.status]}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Info label="Transport Type">
                    {getTransportIcon(
                      selectedComplaint.transportType
                    )}
                    {selectedComplaint.transportType}
                  </Info>
                  <Info label="Category">
                    <Tag className="size-4" />
                    {selectedComplaint.category}
                  </Info>
                  <Info label="Route">
                    <MapPin className="size-4" />
                    {selectedComplaint.route}
                  </Info>
                  <Info label="Date">
                    <Calendar className="size-4" />
                    {new Date(
                      selectedComplaint.date
                    ).toLocaleDateString()}
                  </Info>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Description
                  </p>
                  <div className="bg-white border rounded-lg p-4 text-sm">
                    {selectedComplaint.description}
                  </div>
                </div>

                {selectedComplaint.photoUrls &&
                  selectedComplaint.photoUrls.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Attached Photos
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedComplaint.photoUrls.map(
                          (url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Complaint ${index + 1}`}
                              className="rounded-lg object-cover h-40 w-full border"
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* helper */
function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center gap-2 mt-1 text-sm">
        {children}
      </div>
    </div>
  );
}

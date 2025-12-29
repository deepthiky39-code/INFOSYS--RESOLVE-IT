import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Mail, Phone, Building, Save } from "lucide-react";
import { toast } from "sonner";

interface AdminProfileProps {
  user: {
    email: string;
    name: string;
  };
}

export function AdminProfile({ user }: AdminProfileProps) {
  const [formData, setFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://noble-adventure-production.up.railway.app/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setFormData(data))
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  if (!formData) return <p className="text-center">Loading profile...</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://noble-adventure-production.up.railway.app/api/admin/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed");

      const updated = await res.json();
      setFormData(updated);

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Administrator Profile</CardTitle>
          <CardDescription>
            View and manage your administrator account details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* HEADER */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="bg-red-600 p-6 rounded-full">
              <User className="size-12 text-white" />
            </div>

            <div>
              <h2 className="text-xl">{formData.name}</h2>
              <p className="text-sm text-gray-600">{formData.role}</p>
              <p className="text-sm text-gray-500">
                ID: {formData.employeeId}
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* DEPARTMENT */}
              <div className="space-y-2">
                <Label>Department</Label>
                <select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-md px-3 py-2 bg-white"
                >
                  <option value="">Select Department</option>
                  <option value="BUS_OPERATIONS">Bus Operations</option>
                  <option value="TRAIN_OPERATIONS">Train Operations</option>
                  <option value="METRO_OPERATIONS">Metro Operations</option>
                  <option value="ALL_OPERATIONS">All Operations</option>
                </select>
              </div>

              {/* ROLE */}
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-md px-3 py-2 bg-white"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="SENIOR_ADMIN">Senior Administrator</option>
                  <option value="SUPERVISOR">Supervisor</option>
                </select>
              </div>

              {/* EMPLOYEE ID */}
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input value={formData.employeeId} disabled />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-black text-white"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="bg-black text-white">
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

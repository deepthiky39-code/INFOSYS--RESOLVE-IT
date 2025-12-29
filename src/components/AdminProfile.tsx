import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
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

  if (!formData)
    return <p className="text-center">Loading profile...</p>;

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
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* DEPARTMENT DROPDOWN */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative z-50">
                  <select
                    id="department"
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
                  </select>
                </div>
              </div>

              {/* ROLE DROPDOWN */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative z-50">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                  >
                    <option value="ADMIN">Administrator</option>
                    <option value="SENIOR_ADMIN">Senior Administrator</option>
                    <option value="SUPERVISOR">Supervisor</option>
                  </select>
                </div>
              </div>

              {/* EMPLOYEE ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-black text-white hover:bg-black/90 px-6 py-2 rounded-lg"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-black text-white hover:bg-black/90 px-6 py-2 rounded-lg"
                  >
                    <Save className="size-4" />
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

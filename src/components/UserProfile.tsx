import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
}

export function UserProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [editing, setEditing] = useState(false);

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    if (!token) return;

    const res = await fetch("https://noble-adventure-production.up.railway.app/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast.error("Failed to load profile");
      return;
    }

    const data = await res.json();
    setProfile({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber || "",
      password: "",
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    if (!token) return;

    const payload: any = {
      name: profile.name,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
    };

    if (profile.password?.trim()) {
      payload.password = profile.password;
    }

    const res = await fetch("https://noble-adventure-production.up.railway.app/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to update profile");
      return;
    }

    toast.success("Profile updated successfully");
    setEditing(false);
    fetchProfile();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Profile</CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => (editing ? updateProfile() : setEditing(true))}
          >
            <Pencil className="size-4 mr-2" />
            {editing ? "Update" : "Edit"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={profile.name}
              disabled={!editing}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={profile.email}
              disabled={!editing}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={profile.phoneNumber}
              disabled={!editing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>

          {editing && (
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Leave blank to keep current password"
                value={profile.password}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    password: e.target.value,
                  })
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

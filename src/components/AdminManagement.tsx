import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserPlus, Mail, User, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "Administrator",
    department: "Bus Operations",
  });

  // 🔐 JWT TOKEN
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ================= FETCH ADMINS =================
  const fetchAdmins = async () => {
    try {
      const res = await fetch("https://noble-adventure-production.up.railway.app/api/admin/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setAdmins(data);
    } catch {
      toast.error("Failed to fetch admins");
    }
  };

  // ================= CREATE ADMIN =================
  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Name, Email and Password are required");
      return;
    }

    try {
      await fetch("https://noble-adventure-production.up.railway.app/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      toast.success("Administrator created");
      setIsCreateDialogOpen(false);
      setNewAdmin({
        name: "",
        email: "",
        password: "",
        role: "Administrator",
        department: "Bus Operations",
      });
      fetchAdmins();
    } catch {
      toast.error("Failed to create admin");
    }
  };

  // ================= UPDATE STATUS =================
  const toggleAdminStatus = async (id: string) => {
    try {
      await fetch(`https://noble-adventure-production.up.railway.app/api/admin/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Status updated");
      fetchAdmins();
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ================= DELETE ADMIN =================
  const handleDeleteAdmin = async (id: string) => {
    try {
      await fetch(`https://noble-adventure-production.up.railway.app/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Administrator removed");
      fetchAdmins();
    } catch {
      toast.error("Failed to delete admin");
    }
  };

  // ================= UI =================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Admin Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage administrator accounts
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Create New Admin
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white max-w-xl rounded-2xl shadow-xl border p-6">
  <DialogHeader>
    <DialogTitle className="text-xl font-semibold">
      Create New Administrator
    </DialogTitle>
    <DialogDescription>
      Add a new administrator to the system
    </DialogDescription>
  </DialogHeader>

  <div className="mt-3 space-y-4">

              <div>
                <Label>Full Name</Label>
                <Input
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  value={newAdmin.role}
                  onValueChange={(v) =>
                    setNewAdmin({ ...newAdmin, role: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">
                      Administrator
                    </SelectItem>
                    <SelectItem value="Senior Administrator">
                      Senior Administrator
                    </SelectItem>
                    <SelectItem value="Supervisor">
                      Supervisor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Department</Label>
                <Select
                  value={newAdmin.department}
                  onValueChange={(v) =>
                    setNewAdmin({ ...newAdmin, department: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bus Operations">
                      Bus Operations
                    </SelectItem>
                    <SelectItem value="Train Operations">
                      Train Operations
                    </SelectItem>
                    <SelectItem value="Metro Operations">
                      Metro Operations
                    </SelectItem>
                    <SelectItem value="All Operations">
                      All Operations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateAdmin} className="w-full">
                Create Administrator
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-6 flex justify-between">
              <div className="flex gap-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <Shield className="text-white" />
                </div>

                <div>
                  <h3 className="text-lg">{admin.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail size={14} /> {admin.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <User size={14} /> {admin.role} • {admin.department}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created on{" "}
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAdminStatus(admin.id)}
                >
                  {admin.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleDeleteAdmin(admin.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

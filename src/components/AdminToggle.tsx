import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Shield } from "lucide-react";

interface AdminToggleProps {
  isAdminMode: boolean;
  onToggle: (value: boolean) => void;
}

export function AdminToggle({ isAdminMode, onToggle }: AdminToggleProps) {
  return (
    <div className="fixed top-6 right-6 flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-md">
      <Label htmlFor="admin-mode" className="flex items-center gap-2 cursor-pointer">
        <Shield className={`size-4 ${isAdminMode ? 'text-orange-600' : 'text-gray-400'}`} />
        <span className="text-sm">Admin Login</span>
      </Label>
      <Switch
        id="admin-mode"
        checked={isAdminMode}
        onCheckedChange={onToggle}
      />
    </div>
  );
}

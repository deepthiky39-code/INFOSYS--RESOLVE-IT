import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface ComplaintFormProps {
  onSuccess?: () => void;
}

export function ComplaintForm({ onSuccess }: ComplaintFormProps) {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    transportType: "",
    description: "",
    route: "",
    incidentDate: "",
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > 5) {
      toast.error("You can upload up to 5 photos only");
      return;
    }

    const newFiles = Array.from(files);

    setPhotoFiles((prev) => [...prev, ...newFiles]);
    setPhotos((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index]);
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("transportType", formData.transportType);
    data.append("route", formData.route);
    data.append("incidentDate", formData.incidentDate);
    data.append("description", formData.description);

    // 🔥 FIX: Backend supports ONLY ONE photo
    if (photoFiles.length > 0) {
      data.append("photo", photoFiles[0]); // ✅ correct key
    }

    try {
      const res = await fetch("http://noble-adventure-production.up.railway.app/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) throw new Error();

      toast.success("Complaint submitted successfully!");
      onSuccess?.();

      setFormData({
        title: "",
        category: "",
        transportType: "",
        description: "",
        route: "",
        incidentDate: "",
      });
      setPhotos([]);
      setPhotoFiles([]);
    } catch {
      toast.error("Failed to submit complaint");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-xl"
    >
      {/* Transport Type */}
      <div>
        <Label>Transport Type</Label>
        <Select
          value={formData.transportType}
          onValueChange={(v) =>
            setFormData({ ...formData, transportType: v })
          }
        >
          <SelectTrigger className="bg-gray-100 border-none rounded-lg px-4 py-3 mt-2 text-gray-900">
            <SelectValue placeholder="Select transport type" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            <SelectItem value="Bus">Bus</SelectItem>
            <SelectItem value="Train">Train</SelectItem>
            <SelectItem value="Metro">Metro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div>
        <Label>Complaint Title</Label>
        <Input
          className="bg-gray-100 border-none rounded-lg px-4 py-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500"
          placeholder="Brief summary of the issue"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
      </div>

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Select
          value={formData.category}
          onValueChange={(v) =>
            setFormData({ ...formData, category: v })
          }
        >
          <SelectTrigger className="bg-gray-100 border-none rounded-lg px-4 py-3 mt-2 text-gray-900">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            <SelectItem value="Driver Behavior">Driver Behavior</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Schedule">Schedule</SelectItem>
            <SelectItem value="Safety">Safety</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Route */}
      <div>
        <Label>Route</Label>
        <Input
          className="bg-gray-100 border-none rounded-lg px-4 py-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500"
          placeholder="e.g., Route 45, Line 2, Platform 3"
          value={formData.route}
          onChange={(e) =>
            setFormData({ ...formData, route: e.target.value })
          }
          required
        />
      </div>

      {/* Date */}
      <div>
        <Label>Date of Incident</Label>
        <Input
          className="bg-gray-100 border-none rounded-lg px-4 py-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500"
          type="date"
          value={formData.incidentDate}
          onChange={(e) =>
            setFormData({ ...formData, incidentDate: e.target.value })
          }
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea
          className="bg-gray-100 border-none rounded-lg px-4 py-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500"
          rows={4}
          placeholder="Provide detailed information about the issue..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      {/* Photos */}
      <div>
        <Label className="text-sm font-medium">
          Photos (Optional)
        </Label>

        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer text-gray-500 bg-gray-50 hover:bg-gray-100">
          <Camera className="mb-2" />
          <span className="text-sm">
            Click to upload photos or drag and drop
          </span>
          <span className="text-xs text-gray-400">
            Upload photos (Max 5MB each)
          </span>
          <Input
            
  type="file"
  name="photo"          // 🔥 THIS IS MANDATORY
  multiple
  accept="image/*"
  onChange={handlePhotoUpload}
  className="hidden"
/>

         
        </label>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img
                src={p}
                className="h-24 w-full object-cover rounded-lg"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1"
                onClick={() => removePhoto(i)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl py-6 text-base"
      >
        <Camera className="mr-2 h-4 w-4" />
        Submit Complaint
      </Button>
    </form>
  );
}

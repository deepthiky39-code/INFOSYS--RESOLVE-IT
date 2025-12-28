import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Calendar,
  MapPin,
  Tag,
  Bus,
  Train,
  Train as Metro,
  Image,
} from "lucide-react";
import type { Complaint } from "./UserDashboard";
import { ComplaintFeedbackForm } from "./ComplaintFeedbackForm";

interface ComplaintListProps {
  complaints: Complaint[];
}

const statusBadge = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
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

export function ComplaintList({ complaints }: ComplaintListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null);

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No complaints submitted yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {complaints.map((c) => {
        const images = c.photoUrls ?? c.photos ?? [];
        const isExpanded = expandedId === c.id;

        return (
          <Card
            key={c.id}
            className="border rounded-xl cursor-pointer"
            onClick={() =>
              setExpandedId(isExpanded ? null : c.id)
            }
          >
            <CardContent className="p-6 space-y-4 max-w-2xl mx-auto">
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{c.title}</h3>

                <div className="flex gap-2">
                  <Badge className={statusBadge[c.status]}>
                    {c.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{c.transportType}</Badge>
                </div>
              </div>

              {/* SHORT DESCRIPTION */}
              <p className="text-gray-700">{c.description}</p>

              {/* EXPANDED CONTENT */}
              {isExpanded && (
                <>
                  {/* META INFO */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {getTransportIcon(c.transportType)}
                      <span>{c.transportType}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Tag className="size-4" />
                      <span>{c.category}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      <span>{c.route}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    Submitted on{" "}
                    {new Date(c.submittedAt).toLocaleDateString()} at{" "}
                    {new Date(c.submittedAt).toLocaleTimeString()}
                  </p>

                  {/* PHOTOS */}
                  {images.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                        <Image className="size-4" />
                        {images.length} photo(s) attached
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            className="rounded-lg h-32 w-full object-cover border"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(img, "_blank");
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FEEDBACK BUTTON */}
                  {c.status === "resolved" && (
                    <div>
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenFeedbackId(
                            openFeedbackId === c.id ? null : c.id
                          );
                        }}
                      >
                        Provide Feedback
                      </Button>
                    </div>
                  )}

                  {/* FEEDBACK FORM */}
                  {openFeedbackId === c.id && (
                    <ComplaintFeedbackForm
                      complaintId={c.id}
                      onClose={() => setOpenFeedbackId(null)}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

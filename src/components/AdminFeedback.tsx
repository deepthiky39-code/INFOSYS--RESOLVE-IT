import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star } from "lucide-react";

interface AdminFeedbackProps {
  adminDepartment: string | null;
}

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  submittedAt: string;
  userName: string;
  complaintTitle: string;
  transportType: string;
}

export function AdminFeedback({ adminDepartment }: AdminFeedbackProps) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    const res = await fetch(
      "http://localhost:8080/api/feedback/admin",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setFeedbackList(data);
    }
  };

  // ✅ department filter (unchanged logic)
  const filteredFeedback =
    !adminDepartment || adminDepartment === "ALL_OPERATIONS"
      ? feedbackList
      : feedbackList.filter(
          (f) =>
            f.transportType
              ?.toUpperCase()
              .concat("_OPERATIONS") === adminDepartment
        );

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-5 ${
            i <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>All Feedback</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredFeedback.length === 0 && (
          <p className="text-gray-500 text-center">
            No feedback submitted yet.
          </p>
        )}

        {filteredFeedback.map((f) => (
          <div
            key={f.id}
            className="border rounded-xl p-4 flex justify-between items-start"
          >
            <div className="space-y-1">
              <h3 className="font-semibold">
                {f.complaintTitle}
              </h3>

              <p className="text-sm text-gray-500">
                By: {f.userName}
              </p>

              <p className="text-gray-700 mt-2">
                {f.comment || "No comment provided"}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(f.submittedAt).toLocaleDateString()}
              </p>
            </div>

            {renderStars(f.rating)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

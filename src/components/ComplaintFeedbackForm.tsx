import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ComplaintFeedbackFormProps {
  complaintId: number;
  onClose: () => void;
}

export function ComplaintFeedbackForm({
  complaintId,
  onClose,
}: ComplaintFeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 added
  const [success, setSuccess] = useState(false); // 🔥 added

  const token = localStorage.getItem("token");

  const submitFeedback = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!rating) {
      alert("Please select a rating");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `http://localhost:8080/api/feedback/complaint/${complaintId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
          category: "SERVICE",
        }),
      }
    );

    setLoading(false);

    if (res.ok) {
      setSuccess(true);     // 🔥 show success
      setTimeout(() => {
        onClose();          // 🔥 close AFTER user sees it
      }, 1200);
    } else {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div
      className="
        mt-4 
        rounded-xl 
        border 
        bg-white 
        p-6 
        transition-all 
        duration-300
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title */}
      <h4 className="text-lg font-semibold mb-4">Feedback</h4>

      {/* ⭐ Star Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition ${
              rating && rating >= star
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment Box */}
      <Textarea
        placeholder="Write your comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-6"
      />

      {/* Success Message */}
      {success && (
        <p className="text-green-600 mb-4">
          Thank you for your feedback!
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          onClick={submitFeedback}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="px-6"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

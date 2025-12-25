import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export function UserFeedback() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("APP");

  const token = localStorage.getItem("token");

  const submitFeedback = async () => {
    const res = await fetch("https://noble-adventure-production.up.railway.app/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
        category,
      }),
    });

    if (res.ok) {
      alert("Thank you for your feedback!");
      setComment("");
      setRating(5);
    } else {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <Label>Category</Label>
        <select
          className="border p-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="APP">App Experience</option>
          <option value="SERVICE">Service Quality</option>
          <option value="SUPPORT">Support</option>
        </select>
      </div>

      <div>
        <Label>Rating (1–5)</Label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <Textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button type="button" onClick={submitFeedback}>
        Submit Feedback
      </Button>
    </div>
  );
}

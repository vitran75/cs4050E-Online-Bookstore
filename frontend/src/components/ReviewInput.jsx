import React, { useEffect } from "react";
import Selector from "./Selector";

const ReviewInput = ({ reviews, setReviews }) => {
  const ratingChoices = ["1", "2", "3", "4", "5"];

  
  useEffect(() => {
    if (reviews.length === 0) {
      setReviews([{ reviewerName: "", rating: -1, comment: "" }]);
    }
  }, [reviews, setReviews]);

  // Add a new review block
  const addReview = () => {
    setReviews([...reviews, { reviewerName: "", rating: -1, comment: "" }]);
  };

  // Remove a review block by index
  const removeReview = (index) => {
    if (reviews.length > 1) {
      const updated = [...reviews];
      updated.splice(index, 1);
      setReviews(updated);
    }
  };

  // Handle input change for a specific review
  const handleInputChange = (idx, key, value) => {
    const updated = [...reviews];
    updated[idx][key] = value;
    setReviews(updated);
  };

  return (
    <div className="review-input-container">
      {reviews.map((review, i) => (
        <div className="review-block" key={i}>
          <label htmlFor={`reviewer-${i}`}>Reviewer Name:</label>
          <input
            id={`reviewer-${i}`}
            type="text"
            placeholder="Enter name"
            value={review.reviewerName}
            onChange={(e) => handleInputChange(i, "reviewerName", e.target.value)}
            required
          />

          <div className="review-rating">
            <label htmlFor={`rating-${i}`}>Rating:</label>
            <Selector
              options={ratingChoices}
              selectedValue={review.rating}
              onChange={(value) => handleInputChange(i, "rating", value)}
              name={`rating-${i}`}
              required
            />
          </div>

          <label htmlFor={`comment-${i}`}>Comment:</label>
          <textarea
            id={`comment-${i}`}
            placeholder="Write your review..."
            value={review.comment}
            onChange={(e) => handleInputChange(i, "comment", e.target.value)}
            required
          />

          {reviews.length > 1 && (
            <div className="center-button">
              <button
                type="button"
                className="remove-review-btn"
                onClick={() => removeReview(i)}
              >
                Remove Review
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="center-button">
        <button type="button" className="add-review-btn" onClick={addReview}>
          Add Review
        </button>
      </div>
    </div>
  );
};

export default ReviewInput;

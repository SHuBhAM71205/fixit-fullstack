import React, { useEffect, useState } from 'react';
import '../css/feedback.css';

const backend = import.meta.env.VITE_backend;

 function FeedbackForm({ reqid }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [ratingValue, setRatingValue] = useState(0);

    const handleSubmit = (e) => {
      e.preventDefault();
      // You can handle the feedback submission here
      alert(`Feedback for request ${reqid}: ${feedbackText}, Rating: ${ratingValue}`);
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Give Feedback</h2>
        <label>
          Feedback:
          <textarea
            className="w-full border rounded p-2 mt-1"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
          />
        </label>
        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            className="w-16 border rounded p-1 ml-2"
            value={ratingValue}
            onChange={(e) => setRatingValue(Number(e.target.value))}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    );
  }

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [pendid, setid] = useState([]);
  const [rating, setRating] = useState(0);
  const [selectedReqId, setSelectedReqId] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${backend}/api/user/pendingfeedback`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg0MDA1M2I4MDdiNTI1MWU1NTRmN2ViIn0sImlhdCI6MTc0OTA1MzQ2M30.1_GSrZDEN11n4DQaxAdFv7OkCjeRIdhojXCypyFBTiU',
          },
        });

        const data = await res.json();
        if (res.ok) {
          setid(data.pending);
        } else {
          console.error('Error fetching requests:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPending();
  }, []);

  const openFeedback = (reqId) => {
    setSelectedReqId(reqId);
    setIsOpen(true);
  };

  const closeFeedbackForm = () => {
    setIsOpen(false);
    setFeedback('');
    setRating(0);
  };
  
  if (pendid.length === 0) {
    return (
      <div className="flex justify-center ml-auto mr-auto mt-4 p-20 bg-gray-300 w-3/4 h- rounded-xl">
        There is no pending feedback
        
      </div>)
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-4">
        {pendid.map((req) => (
          <div
            className="flex flex-col gap-3 p-6 bg-white rounded-lg shadow-md border-l-4 border-yellow-400"
            key={req._id}
          >
            <div className="flex justify-between items-center">
              <h6 className="text-xl font-semibold text-gray-800">{req.tag?.name || 'Request'}</h6>
              <button
                onClick={() => openFeedback(req._id)}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
              >
                Give Feedback
              </button>
            </div>
          </div>
        ))}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
                onClick={closeFeedbackForm}
              >
                &times;
              </button>
              <FeedbackForm reqid={selectedReqId} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserHomePage({ user, recentRequests = [] }) {
  const navigate = useNavigate();

  return (
    <div className=" flex-col item-center x p-6 bg-slate-50  w-full min-h-screen">
      <div className="bg-blue-100 p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'User'} 👋</h1>
        <p className="text-gray-600">Submit new requests, track progress, or review past tasks easily.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button onClick={() => navigate('/request')} className="bg-blue-500 text-white p-4 rounded shadow hover:bg-blue-600">New Request</button>
        <button onClick={() => navigate('/track-request')} className="bg-green-500 text-white p-4 rounded shadow hover:bg-green-600">Track Status</button>
        <button onClick={() => navigate('/feedback')} className="bg-yellow-400 text-white p-4 rounded shadow hover:bg-yellow-500">Give Feedback</button>
        <button onClick={() => navigate('/history')} className="bg-purple-500 text-white p-4 rounded shadow hover:bg-purple-600">View History</button>
      </div>

      {/* Recent Requests */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Requests</h2>
        {recentRequests.length === 0 ? (
          <p className="text-gray-500">No recent requests.</p>
        ) : (
          recentRequests.slice(0, 5).map((req) => (
            <div className="bg-white p-4 rounded shadow mb-3 border-l-4 border-blue-400" key={req._id}>
              <div><strong>{req.tag?.name}</strong> in {req.area?.name}</div>
              <div>Status: <span className={`text-sm font-medium ${req.status?.name === 'inactive' ? 'text-yellow-500' : 'text-green-500'}`}>{req.status?.name}</span></div>
            </div>
          ))
        )}
      </div>

      {/* Support Info */}
      <div className="text-sm text-gray-500 text-center">
        Need help? <a href="/help" className="text-blue-600 underline">Contact support</a>
      </div>
    </div>
  );
}

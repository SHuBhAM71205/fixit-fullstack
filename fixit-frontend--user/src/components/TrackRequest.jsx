import React, { useEffect, useState } from 'react';
import '../css/trackRequest.css';
import { useContext } from 'react';
import RequestContext from '../context/requestContext';

const backend = import.meta.env.VITE_backend; 
export default function TrackRequest() {
  
  const [loading, setLoading] = useState(true);

  const context = useContext(RequestContext)
  const{getpendingreq,request}=context;

  useEffect(() => {
    getpendingreq();
    setLoading(false)
  }, []);

  // Helper to map status to progress %
  const getProgressPercent = (statusName) => {
    const map = {
      'inactive': 10,
      'Approved': 40,
      'Assigned': 70,
      'active': 100
    };
    return map[statusName] || 0;
  };

  if (loading) {
    console.log('no')
    return <div className="flex">Loading your requests...</div>;
    
  }

  if (!request) {
    console.log('noreq')
    return (
      
        <div className="flex justify-center ml-auto mr-auto mt-4 p-20 bg-gray-300 w-3/4 h- rounded-xl">There is no service request to show</div>
    );
  }

  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  p-4">
  {request
    .filter((req) => req.status?.name === 'inactive')
    .map((req) => (
      <div
        key={req._id}
        className="w-full p-6 hover:bg-blue-100 bg-white rounded-lg shadow-md space-y-3 border-l-4 border-yellow-400"
      >
        <h6 className="text-xl font-semibold text-gray-800">📝 Request Details</h6>

        <div className="text-gray-700"><strong>Description:</strong> {req.description}</div>
        <div className="text-gray-700"><strong>Area:</strong> {req.area?.name}</div>
        <div className="text-gray-700"><strong>Maintenance Type:</strong> {req.tag?.name}</div>
        <div className={`${req.status?.name === 'inactive' ? 'text-amber-200' : 'text-emerald-500'}text-gray-700`}>
          <strong>Status:</strong>{' '}
          {req.status?.name === 'inactive' ? 'Pending' : 'Completed'}
        </div>

        {req.taskmaster && (
          <div className="text-gray-700">
            <strong>Assigned To:</strong> {req.taskmaster?.name}
          </div>
        )}

        <div>
          <h6 className="font-medium text-gray-800 mb-1">Progress</h6>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercent(req.status?.name)}%` }}
            ></div>
          </div>
        </div>
      </div>
    ))}
</div>

  )}
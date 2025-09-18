import React, { useEffect, useState } from 'react';
// import '../css/trackRequest.css';

const backend = import.meta.env.VITE_backend;

export default function TrackRequest() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [taskmasters, setTaskmasters] = useState([]);
  
  useEffect(() => {
    const getPendingReq = async () => {
      try {
        const res = await fetch(`${backend}/api/admin/viewrequests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        if (res.ok) {
          setRequests(data.requests || []);
        } else {
          console.error('Error fetching requests:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getPendingReq();
  }, []);

  useEffect(() => {
    const fetchTaskmasters = async () => {
      try {
        const res = await fetch(`${backend}/api/admin/gettaskmasters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token':localStorage.getItem('auth-token')
          }
        });
        const data = await res.json();
        if (res.ok) {
          setTaskmasters(data.taskmasters || []);
          console.log(data)
        } else {
          console.error('Failed to load taskmasters');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTaskmasters();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center text-white w-full">Loading requests...</div>;
  }

  if (!requests.length) {
    return (
      <div className="flex justify-center items-center bg-white  ">There is no service request to show</div>
    );
  }

  const toggleDropdown = (reqId) => {
    setOpenDropdownId((prev) => (prev === reqId ? null : reqId));
  };

  const assignTaskToTaskmaster = async (reqId, taskmasterId) => {
    try {
      const res = await fetch(`${backend}/api/admin/assigntask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','auth-token':localStorage.getItem('auth-token') },
        body: JSON.stringify({ requestId: reqId, taskmasterId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Task assigned successfully!');
        setOpenDropdownId(null);
      } else {
        alert('Failed to assign task.');
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 py-4 max-w-[100%]">
        {requests.length === 0 ? (
          <div className="col-span-full text-center text-white text-lg">
            There is no request to show
          </div>
        ) : (
          requests.filter((ele)=>ele.status.name==='inactive').map((req) => (
            <div
              key={req._id}
              className={`bg-gray-300 rounded-xl shadow-xl p-5  space-y-4  ${req.status?.name == 'active' ? 'border-l-green-600' : 'border-l-red-600'}  hover:shadow-lg transition`}
            >
              <div className="flex flex-col sm:flex-row space-x-4">
                <img
                  className="w-12 h-12 border-2 border-indigo-300 rounded-full"
                  src="/man-icon-illustration-vector.jpg"
                  alt="User"
                />
                <div className='flex-wrap'>
                  <p className="text-sm text-gray-800 font-semibold">
                    Owner: {req.user.fname} {req.user.lname}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {req.area.name}
                  </p>
                  <p className="text-sm text-gray-600 overflow-auto">
                    Email: {req.user.email}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <p><strong>Tag:</strong> {req.tag.name}</p>
                <p className={`${req.status?.name == 'active' ? 'text-green-500' : 'text-red-500'}`}><strong>Status:</strong> {req.status?.name == 'active' ? 'completed' : 'pending'}</p>
                <p ><strong>Problem:</strong> {req.description}</p>
              </div>

              <div className="flex justify-evenly flex-wrap">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                  onClick={() => toggleDropdown(req._id)}
                >
                  Assign Task
                </button>

                {openDropdownId === req._id && (
                  <div className="mt-2 w-full bg-gray-100 rounded-md shadow-inner p-2">
                    {taskmasters.length > 0 ? (
                      <select
                        onChange={(e) => assignTaskToTaskmaster(req._id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Taskmaster
                        </option>
                        {taskmasters.map((tm) => (
                          <option key={tm._id} value={tm._id}>
                            {tm.user.fname} {tm.user.lname}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-500">No taskmasters available</p>
                    )}
                  </div>
                )}


              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
// import '../css/trackRequest.css';

export const backend = import.meta.env.VITE_backend;
export const authToken = localStorage.getItem('auth-token') || '';

export default function TaskList() {
  const [requests, setRequests] = useState([
  {
    _id: "1",
    user: {
      fname: "John",
      lname: "Doe",
      email: "john.doe@example.com",
    },
    area: {
      name: "Sector 7",
    },
    tag: {
      name: "Electrical",
    },
    status: {
      name: "inactive",
    },
    description: "The lights in the living room flicker frequently.",
  },
  {
    _id: "2",
    user: {
      fname: "Jane",
      lname: "Smith",
      email: "jane.smith@example.com",
    },
    area: {
      name: "Sector 5",
    },
    tag: {
      name: "Plumbing",
    },
    status: {
      name: "active",
    },
    description: "The kitchen sink is leaking and needs repair.",
  },
  {
    _id: "3",
    user: {
      fname: "Alex",
      lname: "Johnson",
      email: "alex.johnson@example.com",
    },
    area: {
      name: "Sector 3",
    },
    tag: {
      name: "Carpentry",
    },
    status: {
      name: "inactive",
    },
    description: "The main door lock is broken and needs replacement.",
  },
]
);

  useEffect(() => {
    fetch(`${backend}/api/taskmaster/worklist`, {
      method: 'GET',
      headers: {
        'auth-token': authToken,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.requests) {
          setRequests(data.requests);
        }
      })
      .catch(err => console.error('Failed to fetch requests:', err));
  }, []);

  
  return (
    <>
      <h2 className="text-2xl text-center bg-blue-100 text-indigo-800 font-semibold rounded-md my-4 py-2 shadow-lg">
        Task Worklist
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-4">
        {requests.length ===0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            There is no service request to show
          </div>
        ) : (
          // Filter requests with status.name === 'inactive' if you want to show only those
          requests
            .filter(req => req.status?.name === 'inactive')
            .map(req => (
              <div
                key={req._id}
                className={`bg-white flex-col rounded-xl shadow-xl p-5 space-y-4 border-l-4 ${
                  req.status?.name === 'active'
                    ? 'border-l-green-600'
                    : 'border-l-red-600'
                } hover:shadow-lg transition`}
              >
                <div className="flex flex-col flex-none sm:flex-row space-x-4">
                  <img
                    className="w-12 h-12 border-2 border-indigo-300 rounded-full"
                    src="/man-icon-illustration-vector.jpg"
                    alt="User"
                  />
                  <div>
                    <p className="text-sm text-gray-800 font-semibold">
                      Owner: {req.user?.fname} {req.user?.lname}
                    </p>
                    <p className="text-sm text-gray-600">Location: {req.area?.name}</p>
                    <p className="text-sm text-gray-600">Email: {req.user?.email}</p>
                  </div>
                </div>

                <div className="text-sm grow text-gray-700 space-y-1">
                  <p>
                    <strong>Tag:</strong> {req.tag?.name}
                  </p>
                  <p
                    className={
                      req.status?.name === 'active'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    <strong>Status:</strong>{' '}
                    {req.status?.name === 'active' ? 'Completed' : 'Pending'}
                  </p>
                  <p>
                    <strong>Problem:</strong> {req.description}
                  </p>
                </div>

                <button className='w-full flex-none text-center p-2 text-white rounded-sm  hover:bg-red-700 bg-red-600'>Cancel</button>
              </div>
            ))
        )}
      </div>
    </>
  );
}


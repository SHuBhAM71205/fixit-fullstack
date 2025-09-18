import React, { useEffect, useState } from 'react';
// import '../css/TaskmasterApplications.css';
const backend = import.meta.env.VITE_backend;

export default function TaskmasterApplications() {
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    
    const getapplicant = async () => {
      try {
        const data = await fetch(`${backend}/api/admin/showuserapplytaskmaster`, {
          method: 'GET',
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        })
        const refinedata = await data.json();
        
        setApplications(refinedata.applications);
      } catch (error) {
        console.log(error)
      }
    }
    getapplicant();

  }, []);

  const handleAction = async (id, action) => {
    console.log(`${action} application with ID: ${id}`);
    if (action) {
      try {
        const data = await fetch(`${backend}/api/admin/makeusertaskmaster/${id}/${action}`, {
          method: 'PUT',
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        })
        const refinedata = await data.json();
        console.log(refinedata)
      } catch (error) {
        console.log(error)
      }
    }
    else {

    }
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <>
    
      {applications?.length === 0 &&
        <p className="text-white text-center flex justify-center">No pending applications.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 px-6 py-4">
        {applications?.map((app) => (
            <div
              key={app._id}
              className={`bg-gray-300 rounded-xl shadow-xl p-5 w-full space-y-4 border-l-4 border-indigo-500 hover:shadow-lg transition`}
            >
              <div className="flex flex-col sm:flex-row space-x-4">
                <img
                  className="w-12 h-12 border-2 border-indigo-300 rounded-full"
                  src="/man-icon-illustration-vector.jpg"
                  alt="User"
                />
                <div className="flex-wrap">
                  <p className="text-sm text-gray-800 font-semibold">
                    Name: {app?.user?.fname} {app?.user?.lname}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {app?.user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Aadhaar: {app?.application?.Adhaar_no}
                  </p>
                  <a
                    href={app?.application?.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-indigo-600 hover:underline text-sm"
                  >
                    📄 View Document
                  </a>
                </div>
              </div>

              <div className="flex justify-evenly flex-wrap">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                  onClick={() => handleAction(app.user._id, true)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                  onClick={() => handleAction(app.user._id, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          )
          )}
      </div>
    </>
  );
}

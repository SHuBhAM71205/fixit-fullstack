import React, { useEffect, useState } from 'react';
// import '../css/Home.css';
// import '../css/form-style.css';

export const backend = import.meta.env.VITE_backend;
export const authToken = localStorage.getItem('auth-token');


export default function Home() {
  const [available, setAvailable] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch(`${backend}/api/taskmaster/getunasignrequest`, {
      method: 'GET',
      headers: {
        'auth-token': authToken
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.requests) {
          setSuggestions(data.requests);
        }
      })
      .catch(err => console.error('Failed to fetch suggestions:', err));
  }, []);

  const toggleAvailability = () => {
    const newAvailability = !available;
    fetch(`${backend}/api/taskmaster/toggleAvablity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken
      },
      body: JSON.stringify({ available: newAvailability })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailable(newAvailability);
        }
      })
      .catch(err => console.error('Availability toggle failed:', err));
  };

  const acceptTask = (taskId) => {
    fetch(`${backend}/api/taskmaster/acceptrequest/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken
      },
      body: JSON.stringify({ taskId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Task accepted!');
          setSuggestions(prev => prev.filter(task => task._id !== taskId));
        }
      })
      .catch(err => console.error('Accept task failed:', err));
  };

  return (
    <>
      {/* <div className="set-availability flex-col">
        <span>Availability</span>
        <label className="switch">
          <input type="checkbox" checked={available} onChange={toggleAvailability} />
          <span className="slider round"></span>
        </label>
      </div> */}

      <h2 className="text-2xl text-center bg-blue-100 text-indigo-800 font-semibold rounded-md my-4 py-2 shadow-lg">
        Suggestions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 px-6 py-4">
        {suggestions.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            There is no suggestion to show
          </div>
        ) : (
          suggestions.filter(sug=>sug.status.name=='inactive').map((req) => (
            <div
              key={req._id}
              className={`bg-white rounded-xl shadow-xl p-5 space-y-4 ${req.status?.name=='active'?'border-l-green-600':'border-l-red-600'}  hover:shadow-lg transition`}
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
                <p className={`${req.status?.name=='active'?'text-green-500':'text-red-500'}`}><strong>Status:</strong> {req.status?.name=='active'?'completed':'pending'}</p>
                <p ><strong>Problem:</strong> {req.description}</p>
              </div>

              <div className="flex justify-evenly flex-wrap">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                  onClick={() => acceptTask(req._id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600  text-white text-sm font-medium px-4 py-2 rounded-md transition"
                  onClick={() => acceptTask(req._id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

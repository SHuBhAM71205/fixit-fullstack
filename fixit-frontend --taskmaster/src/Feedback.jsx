
import React, { useEffect, useState } from 'react';
// import './css/feedback.css';
import { backend, authToken } from "./components/Home"
const authtoken = localStorage.getItem('auth-token')
export default function Feedback() {

  const [feddbk, setfeedback] = useState([
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
      star: 5,
      feedback: "welldone",
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
      star: 3,
      feedback: "Good Work.",
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
      star: 2,
      feedback: "Not impressive.",
    }
  ]);


  useEffect(() => {
    fetch(`${backend}/api/taskmaster/getfeedback`, {
      method: 'GET',
      headers: {
        'auth-token': authToken
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.requests) {
          setfeedback(data.requests);
        }
      })
      .catch(err => console.error('Failed to fetch feedback:', err));
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-4">
        {feddbk.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            There is no suggestion to show
          </div>
        ) : (
          feddbk.map((req) => (
            <div
              key={req._id}
              className={`bg-white rounded-xl shadow-xl p-5 space-y-4 ${req.status?.name == 'active' ? 'border-l-green-600' : 'border-l-red-600'}  hover:shadow-lg transition`}
            >
              <div className="flex flex-col sm:flex-row space-x-4">
                <img
                  className="w-12 h-12 border-2 border-indigo-300 rounded-full"
                  src="/man-icon-illustration-vector.jpg"
                  alt="User"
                />
                <div>
                  <p className="text-sm text-gray-800 font-semibold">
                    Owner: {req.user.fname} {req.user.lname}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {req.area.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {req.user.email}
                  </p>
                </div>
              </div>

              <div className=" flex text-sm justify-between text-gray-700">

                <p ><strong>Feedback:</strong> {req.feedback}</p>
                <div className='flex flex-wrap'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < req.star ? 'text-yellow-500' : 'text-gray-400'}
                  >
                    ★
                  </span>
                ))}</div>
              </div>
            </div>
          ))
        )}
      </div>



    </>
  );
}

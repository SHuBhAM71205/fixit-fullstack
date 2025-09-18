import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/Logincontextprovider';

const URL = import.meta.env.VITE_backend;

export default function AuthForm({ onLoginSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [works, setWorks] = useState([]);
  const [areas, setAreas] = useState([]);

  // Fetch skills for "work" dropdown
  useEffect(() => {
    fetch(`${URL}/api/gen/mainttag`)
      .then(res => res.json())
      .then(data => setWorks(data.tags || []))
      .catch(err => console.error("Failed to fetch skills:", err));
    fetch(`${URL}/api/gen/areatag`)
      .then(res => res.json())
      .then(data => setAreas(data.tags || []))
      .catch(err => console.error("Failed to fetch skills:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!isLogin && !form.terms.checked) {
      alert('You must accept the terms and conditions.');
      return;
    }

    try {
      let res;
      if (isLogin) {
        const data = {
          email: form.email.value,
          password: form.password.value
        };

        res = await fetch(`${URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

      } else {

        fetch(`${URL}/api/auth/createuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json'
          },
          body: JSON.stringify({
            fname: form.fname.value,
            lname: form.lname.value,
            gender: form.gender.value,
            area: form.area.value,
            role: '683ff5d92cba5619ab8e0823',
            email: form.email.value,
            password: form.password.value,
            contact: form.contact.value,
          })
        })

        const formData = new FormData();

        formData.append("addhar", form.addhar.value);
        formData.append("email", form.email.value);
        formData.append("document", form.document.files[0]);
        formData.append("role", form.work.value);

        res = await fetch(`${URL}/api/auth/applytaskmaster`, {
          method: 'POST',
          body: formData
        });
      }

      const resData = await res.json();

      if (!res.ok) {
        alert(resData.message || "Wrong credentials");
        return;
      }

      if (isLogin) {
        if (resData.user?.role?.name === 'taskmaster') {
          localStorage.setItem('auth-token', res.headers.get('Auth-Token'));
          login();
          navigate('/');
        } else {
          alert("Access denied: only taskmasters can log in.");
        }
      } else {
        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? 'Login' : 'Signup'}</h2>

        <div className="flex justify-center gap-10 mb-5">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`px-7 py-3 text-m rounded-full font-medium transition ${
              !isLogin ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Signup
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`px-7 py-3 text-m rounded-full font-medium transition ${
              isLogin ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Login
          </button>
        </div>

      <form className="space-y-7" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <fieldset>
              <legend>Personal Detail</legend>
              <input className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' type="text" name="fname" placeholder="First Name" required />
              <input className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' type="text" name="lname" placeholder="Last Name" required />
              <input className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' type="text" name="contact" placeholder="Contact No" required />
              <input className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' type="number" name="age" placeholder="Age" required />
              <select className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' name="gender" required>
                <option  value="">Select Gender</option>
                <option  value="m">Male</option>
                <option  value="f">Female</option>
              </select>
              <select className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' name="area" required>
                <option value="">Select Area</option>
                {areas.map((w) => (
                  <option className="max-w-sm"key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>

            </fieldset>

            <fieldset>
              <legend>Verification Document</legend>
              <input className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' type="text" name="addhar" placeholder="Enter your Aadhar number" required />
              <label htmlFor="document">Document</label>
              <input className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' type="file" name="document" id="document" required />
              <label  htmlFor="work">What's your skill</label>
              <select className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' name="work" id="work" required>
                <option value="">Select Skill</option>
                {works.map((w) => (
                  <option className ="w-full"key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </fieldset>
          </>
        )}

        <fieldset>
          <legend  className='block text-sm font-medium text-gray-700'>Email & Password</legend>
          <input  type="email" name="email" placeholder="Email" className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500' required />
          <input className='mt-2 flex w-full p-2 border rounded-lg focus:ring-2
           focus:ring-fuchsia-600' type="password" name="password" placeholder="Password" required />
        </fieldset>

        {!isLogin && (
          <div className="flex items-center text-sm text-gray-600">
            <input type="checkbox" id="terms" name="terms" className='mr-2'  required />
            <label htmlFor="terms">I accept the terms</label>
          </div>
        )}

        {isLogin && (
          <a href="#" className="text-sm text-purple-600 hover:underline">Forgot password?</a>
        )}

        <button className="block text-xl text-center bg-purple-600 text-white rounded-lg w-full p-1.5 mt-5 "type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      </div>
    </div>
  );
}

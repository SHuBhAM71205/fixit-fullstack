import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/Logincontextprovider';
const URL = import.meta.env.VITE_backend;

export default function AuthForm({ onLoginSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    fetch(`${URL}/api/gen/mainttag`)
      .then(res => res.json())
      .then(data => setWorks(data.tags || []))
      .catch(err => console.error("Failed to fetch tags:", err));
    fetch(`${URL}/api/gen/areatag`)
      .then(res => res.json())
      .then(data => setAreas(data.tags || []))
      .catch(err => console.error("Failed to fetch areas:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!isLogin && !form.terms.checked) {
      alert('You must accept the terms and conditions.');
      return;
    }

    try {
      let res, resData;

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

        resData = await res.json();

        if (!res.ok) {
          alert(resData.message || "Invalid credentials");
          return;
        }

        if (resData.user?.role?.name === 'admin' || resData.user?.role?.name === 'user') {
          localStorage.setItem('auth-token', res.headers.get('Auth-Token'));
          login();
          navigate('/');
        } else {
          alert("Access denied: invalid role.");
        }
      } else {
        const signupData = {
          fname: form.fname.value,
          lname: form.lname.value,
          gender: form.gender.value,
          area: form.area.value,
          role: '683ff5d02cba5619ab8e0821',
          email: form.email.value,
          password: form.password.value,
          contact: form.contact.value
        };

        res = await fetch(`${URL}/api/auth/createuser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData)
        });

        resData = await res.json();

        if (!res.ok) {
          alert(resData.message || "Signup failed");
          return;
        }

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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Signup'}
        </h2>

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
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="fname"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  name="contact"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Area</label>
                <select
                  name="area"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select area</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {!isLogin && (
            <div className="flex items-center text-sm text-gray-600">
              <input type="checkbox" id="terms" name="terms" className="mr-2" required />
              <label htmlFor="terms">I accept the terms and conditions</label>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-sm text-purple-600 hover:underline">Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
}

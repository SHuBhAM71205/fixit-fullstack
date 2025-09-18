import React, { useState, useEffect } from 'react';

const backend = import.meta.env.VITE_backend;

export default function User() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorFilters, setErrorFilters] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const res = await fetch(`${backend}/api/admin/viewusers`, {
          method: 'GET',
          headers: {
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg0MDVkNjkzOGEwMzVjYmRhODk0NjYwIn0sImlhdCI6MTc0OTA1MjEzNn0.i4fH-pEhOMhjWA44vSFermd_vpku8LsAi3-nmdwZaOY', // replace with actual token securely
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
        const data = await res.json();
        setUsers(data.users); // Fix: data.users not data
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchFilters() {
      setLoadingFilters(true);
      try {
        const [rolesRes, placesRes] = await Promise.all([
          fetch(`${backend}/api/gen/roletag`),
          fetch(`${backend}/api/gen/areatag`),
        ]);
        const rolesData = await rolesRes.json();
        const placesData = await placesRes.json();

        setRoles(rolesData.tags || []);
        setPlaces(placesData.tags || []);
      } catch (err) {
        setErrorFilters(err.message);
      } finally {
        setLoadingFilters(false);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    let result = [...users];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(user =>
        `${user.fname} ${user.lname}`.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (roleFilter) {
      result = result.filter(user => user.role?.name === roleFilter);
    }

    if (placeFilter) {
      result = result.filter(user => user.area?.name === placeFilter);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, placeFilter]);

  function removeUser(id)
  {
      fetch(`${backend}/api/admin/removeuser/${id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to remove user');
          setUsers(prev => prev.filter(user => user._id !== id));
        })
        .catch(err => {
          alert('Error removing user: ' + err.message);
        });
  }

  if (loadingUsers || loadingFilters) return <div>Loading...</div>;
  if (errorUsers) return <div>Error loading users: {errorUsers}</div>;
  if (errorFilters) return <div>Error loading filters: {errorFilters}</div>;

  return (
    <div className='flex-col w-full'>
      <div className="flex flex-col justify-center items-center  mt-10 md:flex-row gap-4 md:items-center mb-6">

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-1/3 bg-gray-400"
        />

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-1/4 bg-gray-400"
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role._id} value={role.name}>{role.name}</option>
          ))}
        </select>

        <select
          value={placeFilter}
          onChange={e => setPlaceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 bg-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-1/4"
        >
          <option value="">All Areas</option>
          {places.map(place => (
            <option key={place._id} value={place.name}>{place.name}</option>
          ))}
        </select>

      </div>


      <div className="grid grid-cols-1 flex-1justify-items-center items-center sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 py-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user._id}
              className={`bg-gray-300 flex-col lg:flex rounded-xl shadow-xl p-5 w-full space-y-4 border-l-4 border-indigo-500 hover:shadow-lg transition`}
            >
        
              <div className="flex flex-1 flex-col sm:flex-row space-x-4">
                <img
                  className="w-12 h-12 border-2 border-indigo-300 rounded-full"
                  src={user.image || '/man-icon-illustration-vector.jpg'}
                  alt={`${user.fname} ${user.lname}`}
                />
                <div className="flex-wrap">
                  <p className="text-sm text-gray-800 font-semibold">
                    Name: {user.fname} {user.lname}
                  </p>
                  <p className="text-sm text-gray-600">
                    Role: {user.role?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Place: {user.area?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {user.status || 'N/A'}
                  </p>
                </div>
              </div>

              <div className='flex justify-center gap-2'>
                <button className='bg-red-300  hover:bg-red-500 p-1.5 rounded-sm text-xs'>Remove User</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-user">No users found.</div>
        )}
      </div>
    </div>
  );
}
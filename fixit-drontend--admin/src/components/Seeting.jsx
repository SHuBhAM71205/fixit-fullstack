import React, { useEffect, useState } from 'react';
// import '../css/Seeting.css'
const backend = import.meta.env.VITE_backend;

export default function Settings() {
  const [location, setLocation] = useState('');
  const [maintTag, setMaintTag] = useState('');
  const [statusTag, setStatusTag] = useState('');

  const [locations, setLocations] = useState([]);
  const [maintTags, setMaintTags] = useState([]);
  const [statusTags, setStatusTags] = useState([]);

  // Fetch all tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [locRes, maintRes, statusRes] = await Promise.all([
          fetch(`${backend}/api/gen/areatag`),
          fetch(`${backend}/api/gen/mainttag`),
          fetch(`${backend}/api/gen/roletag`)
        ]);

        const [locData, maintData, statusData] = await Promise.all([
          locRes.json(),
          maintRes.json(),
          statusRes.json()
        ]);
        console.log(locData.tags)
        setLocations(locData.tags);
        setMaintTags(maintData.tags);
        setStatusTags(statusData.tags);

      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    fetchTags();
  }, []);

  const handleAdd = (nam, value, setter, listSetter) => {

    fetch(`${backend}/api/admin/addtag/${nam}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': value
      })
    })

    if (value.trim()) {
      listSetter(prev => [...prev, value.trim()]);
      // You can add a POST request here to save it in DB
      setter('');
    }
  };

  const handleDelete = (index, list, setList) => {
    let nam = ''

    if (list === locations) {
      nam = 'area'
    }
    else if (list === maintTags) {
      nam = 'maint'
    }
    else {
      nam = 'role'
    }

    fetch(`${backend}/api/admin/deletetag/${nam}/${index}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg0MDVkNjkzOGEwMzVjYmRhODk0NjYwIn0sImlhdCI6MTc0OTA1MjEzNn0.i4fH-pEhOMhjWA44vSFermd_vpku8LsAi3-nmdwZaOY'
      }
    })

    setList(list.filter(item => item._id != index))

  };

  const renderTags = (list, setList) =>
    list.map((obj) => (
      <span key={obj._id} className="bg-gray-300 rounded-full p-2">
        {obj.name}
        <button className="bg-gray-300 rounded-full" onClick={() => handleDelete(obj._id, list, setList)}>✖</button>
      </span>
    ));

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gray-200 rounded-xl shadow-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Settings</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Add Location</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g., Delhi"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-gray-800"
          />
          <button
            onClick={() => handleAdd('area', location, setLocation, setLocations)}
            className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">{renderTags(locations, setLocations)}</div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Add Maintenance Tag</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={maintTag}
            onChange={e => setMaintTag(e.target.value)}
            placeholder="e.g., Plumbing"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-gray-800"
          />
          <button
            onClick={() => handleAdd('maint', maintTag, setMaintTag, setMaintTags)}
            className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">{renderTags(maintTags, setMaintTags)}</div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Add Role Tag</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={statusTag}
            onChange={e => setStatusTag(e.target.value)}
            placeholder="e.g., Admin"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-gray-800"
          />
          <button
            onClick={() => handleAdd('role', statusTag, setStatusTag, setStatusTags)}
            className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">{renderTags(statusTags, setStatusTags)}</div>
      </div>
    </div>

  );
}

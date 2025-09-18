import React, { useEffect, useState } from 'react';

const backend = import.meta.env.VITE_backend;

export default function Request() {
  const [areas, setAreas] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    area: '',
    tag: '',
    appliance_details: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const areaRes = await fetch(`${backend}/api/gen/areatag`);
        const areaData = await areaRes.json();
        setAreas(areaData.tags || []);
        console.log(areaData)

        const tagRes = await fetch(`${backend}/api/gen/mainttag`);
        const tagData = await tagRes.json();
        setTags(tagData.tags || []);
        
        console.log(tagData)

      } catch (err) {
        console.error('Error fetching area/tag data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitReq = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/api/user/createrequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg0MDA1M2I4MDdiNTI1MWU1NTRmN2ViIn0sImlhdCI6MTc0OTA1MzQ2M30.1_GSrZDEN11n4DQaxAdFv7OkCjeRIdhojXCypyFBTiU"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Request submitted successfully!');
        setFormData({ area: '', tag: '', appliance_details: '', description: '' });
      } else {
        alert('❌ Failed to submit request: ' + result.message);
      }
    } catch (err) {
      console.error('Submit failed', err);
      alert('⚠️ Error submitting request');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-10 bg-indigo-100 p-6 rounded-lg shadow-2xl">
  <h2 className="text-2xl font-bold text-center text-gray-800 pb-4">🛠️ Service Request Form</h2>

  <form onSubmit={submitReq} className="space-y-4">
    
    <div>
      <label htmlFor="area" className="block text-sm font-medium text-gray-700">Select Area</label>
      <select
        id="area"
        name="area"
        value={formData.area}
        onChange={handleChange}
        required
        className="mt-1 w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Area --</option>
        {areas.map(area => (
          <option key={area._id} value={area._id}>{area.name}</option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Select Service Type</label>
      <select
        id="tag"
        name="tag"
        value={formData.tag}
        onChange={handleChange}
        required
        className="mt-1 w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-3 focus:ring-blue-500"
      >
        <option value="">-- Select Service Type --</option>
        {tags.map(tag => (
          <option key={tag._id} value={tag._id}>{tag.name}</option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="appliance_details" className="block text-sm font-medium text-gray-700">Appliance/Device Details</label>
      <input
        type="text"
        id="appliance_details"
        name="appliance_details"
        value={formData.appliance_details}
        onChange={handleChange}
        placeholder="e.g., LG AC Model X123"
        required
        className="mt-1 w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Issue Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        placeholder="Briefly describe the problem"
        required
        className="mt-1 w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <div className="text-center">
      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
      >
        📤 Submit Request
      </button>
    </div>
  </form>
</div>

  );
}

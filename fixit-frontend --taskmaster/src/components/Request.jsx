import React from 'react'
import '../css/form-style.css'
export default function Request() {
  return (
    <div>
      <h2>Service Request Form</h2>
      <form >

        <label for="service-type">Service Type:</label>
        <select id="service-type" name="service_type" required>
          <option value="">Select Service</option>
          <option value="fridge">Fridge Repair</option>
          <option value="computer">Computer Repair</option>
          <option value="laptop">Laptop Repair</option>
          <option value="home_appliance">Home Appliance Repair</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="appliance-details">Appliance/Device Details:</label>
        <input type="text" id="appliance-details" name="appliance_details" placeholder="Brand, Model, etc." required />

        <label htmlFor="description">Issue Description:</label>
        <textarea id="description" name="description" rows="4" placeholder="Describe the problem..." required></textarea>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  )
}

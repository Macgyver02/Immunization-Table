// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [immunizations, setImmunizations] = useState([]);
  const [newImmunization, setNewImmunization] = useState({
    patient_id: '',
    vaccine_name: '',
    dose_number: '',
    administration_date: '',
    administered_by: '',
    notes: ''
  });

  useEffect(() => {
    fetchImmunizations();
  }, []);

  const fetchImmunizations = async () => {
    const response = await axios.get('http://localhost:5000/immunizations');
    setImmunizations(response.data);
  };

  const handleInputChange = (e) => {
    setNewImmunization({ ...newImmunization, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/immunizations', newImmunization);
    setNewImmunization({
      patient_id: '',
      vaccine_name: '',
      dose_number: '',
      administration_date: '',
      administered_by: '',
      notes: ''
    });
    fetchImmunizations();
  };

  return (
    <div className="App">
      <h1>Immunization Records</h1>
      
      <h2>Add New Immunization</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="patient_id"
          value={newImmunization.patient_id}
          onChange={handleInputChange}
          placeholder="Patient ID"
          required
        />
        <input
          type="text"
          name="vaccine_name"
          value={newImmunization.vaccine_name}
          onChange={handleInputChange}
          placeholder="Vaccine Name"
          required
        />
        <input
          type="number"
          name="dose_number"
          value={newImmunization.dose_number}
          onChange={handleInputChange}
          placeholder="Dose Number"
        />
        <input
          type="date"
          name="administration_date"
          value={newImmunization.administration_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="administered_by"
          value={newImmunization.administered_by}
          onChange={handleInputChange}
          placeholder="Administered By"
        />
        <textarea
          name="notes"
          value={newImmunization.notes}
          onChange={handleInputChange}
          placeholder="Notes"
        ></textarea>
        <button type="submit">Add Immunization</button>
      </form>

      <h2>Immunization Records</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Vaccine</th>
            <th>Dose</th>
            <th>Date</th>
            <th>Administered By</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {immunizations.map(immunization => (
            <tr key={immunization.id}>
              <td>{immunization.patient_id}</td>
              <td>{immunization.vaccine_name}</td>
              <td>{immunization.dose_number}</td>
              <td>{immunization.administration_date}</td>
              <td>{immunization.administered_by}</td>
              <td>{immunization.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
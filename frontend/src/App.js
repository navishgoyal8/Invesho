import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState([]);

  const handleSearch = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/search?company=${company}`);
    setEmployees(res.data);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">LinkedIn Employee Finder</h1>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter company name..."
          className="w-full p-2 border mb-4 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>

        <ul className="mt-6 space-y-4">
          {employees.map((emp, idx) => (
            <li key={idx} className="p-4 border rounded shadow-sm bg-gray-50">
              <p className="font-bold">{emp.name}</p>
              <p>{emp.position}</p>
              <p className="text-sm text-gray-600">{emp.email || ''}</p>
              <a href={emp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                LinkedIn Profile
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

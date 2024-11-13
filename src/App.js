import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling
import manufacturerIcon from './icons/manufacturer.png';
import middlemanIcon from './icons/middleman.png';
import retailerIcon from './icons/retailer.png';
import medicineIcon from './icons/medicine.png';

const App = () => {
  const [nodes, setNodes] = useState([
    { id: 1, name: 'Admin Node', role: 'Admin', medicines: [] }
  ]);
  const [medicines, setMedicines] = useState([]);
  const [medicineHistory, setMedicineHistory] = useState({});
  const [newNodeName, setNewNodeName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [medicineName, setMedicineName] = useState('');

  const createNode = (role) => {
    if (!newNodeName || !selectedNode || selectedNode.role !== 'Admin') return;

    const newNode = {
      id: nodes.length + 1,
      name: newNodeName,
      role,
      medicines: [],
    };

    setNodes([...nodes, newNode]);
    setNewNodeName('');
  };

  const createMedicine = () => {
    if (!selectedNode || selectedNode.role !== 'Manufacturer' || !medicineName) return;

    const newMedicine = {
      id: medicines.length + 1,
      name: medicineName,
      owner: selectedNode.name,
      status: 'Created',
    };

    setMedicines([...medicines, newMedicine]);
    setMedicineHistory((prevHistory) => ({
      ...prevHistory,
      [newMedicine.id]: [{ node: selectedNode.name, action: 'Created' }],
    }));
    setMedicineName('');
  };

  const transferMedicine = (medicineId, newOwnerName) => {
    setMedicines((prevMedicines) =>
        prevMedicines.map((med) =>
            med.id === medicineId ? { ...med, owner: newOwnerName, status: 'In Transit' } : med
        )
    );

    setMedicineHistory((prevHistory) => ({
      ...prevHistory,
      [medicineId]: [
        ...(prevHistory[medicineId] || []),
        { node: newOwnerName, action: 'Transferred' },
      ],
    }));
  };

  const sellMedicine = (medicineId) => {
    setMedicines((prevMedicines) =>
        prevMedicines.map((med) =>
            med.id === medicineId ? { ...med, status: 'Sold' } : med
        )
    );

    setMedicineHistory((prevHistory) => ({
      ...prevHistory,
      [medicineId]: [
        ...(prevHistory[medicineId] || []),
        { node: 'Customer', action: 'Sold' },
      ],
    }));
  };

  return (
      <div className="app">
        <h1>Medicine Supply Chain</h1>

        <h2>Nodes</h2>
        <div className="nodes-section">
          <h3>Admin</h3>
          <ul>
            {nodes.filter(node => node.role === 'Admin').map((node) => (
                <li key={node.id} onClick={() => setSelectedNode(node)}>
                  {node.name} - {node.role}
                </li>
            ))}
          </ul>

          {selectedNode && selectedNode.role === 'Admin' && (
              <div>
                <h2>Create Node</h2>
                <input
                    type="text"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    placeholder="Node Name"
                />
                <button onClick={() => createNode('Manufacturer')}>
                  <img src={manufacturerIcon} alt="Manufacturer" /> Create Manufacturer
                </button>
                <button onClick={() => createNode('Middleman')}>
                  <img src={middlemanIcon} alt="Middleman" /> Create Middleman
                </button>
                <button onClick={() => createNode('Retailer')}>
                  <img src={retailerIcon} alt="Retailer" /> Create Retailer
                </button>
              </div>
          )}

          <h3>Manufacturers</h3>
          <ul>
            {nodes.filter(node => node.role === 'Manufacturer').map((node) => (
                <li key={node.id} onClick={() => setSelectedNode(node)}>
                  {node.name} - {node.role}
                </li>
            ))}
          </ul>

          <h3>Middlemen</h3>
          <ul>
            {nodes.filter(node => node.role === 'Middleman').map((node) => (
                <li key={node.id} onClick={() => setSelectedNode(node)}>
                  {node.name} - {node.role}
                </li>
            ))}
          </ul>

          <h3>Retailers</h3>
          <ul>
            {nodes.filter(node => node.role === 'Retailer').map((node) => (
                <li key={node.id} onClick={() => setSelectedNode(node)}>
                  {node.name} - {node.role}
                </li>
            ))}
          </ul>
        </div>

        {selectedNode && (
            <div>
              <h3>Selected Node: {selectedNode.name}</h3>
              {selectedNode.role === 'Manufacturer' && (
                  <div>
                    <input
                        type="text"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        placeholder="Medicine Name"
                    />
                    <button onClick={createMedicine}>
                      <img src={medicineIcon} alt="Medicine" /> Create Medicine
                    </button>
                    <h4>Transfer Medicine</h4>
                    {medicines.filter((med) => med.owner === selectedNode.name).map((medicine) => (
                        <div key={medicine.id}>
                          {medicine.name} - Status: {medicine.status}
                          <select
                              onChange={(e) => transferMedicine(medicine.id, e.target.value)}
                              defaultValue=""
                          >
                            <option value="" disabled>
                              Select recipient
                            </option>
                            {nodes
                                .filter((node) => node.role === 'Middleman' || node.role === 'Retailer')
                                .map((node) => (
                                    <option key={node.id} value={node.name}>
                                      {node.name} ({node.role})
                                    </option>
                                ))}
                          </select>
                        </div>
                    ))}
                  </div>
              )}

              {selectedNode.role === 'Middleman' && (
                  <div>
                    <h4>Transfer Medicine</h4>
                    {medicines.filter((med) => med.owner === selectedNode.name).map((medicine) => (
                        <div key={medicine.id}>
                          {medicine.name} - Status: {medicine.status}
                          <select
                              onChange={(e) => transferMedicine(medicine.id, e.target.value)}
                              defaultValue=""
                          >
                            <option value="" disabled>
                              Select recipient
                            </option>
                            {nodes
                                .filter((node) => node.role === 'Middleman' || node.role === 'Retailer')
                                .map((node) => (
                                    <option key={node.id} value={node.name}>
                                      {node.name} ({node.role})
                                    </option>
                                ))}
                          </select>
                        </div>
                    ))}
                  </div>
              )}

              {selectedNode.role === 'Retailer' && (
                  <div>
                    <h4>Sell Medicine</h4>
                    {medicines.filter((med) => med.owner === selectedNode.name && med.status !== 'Sold').map((medicine) => (
                        <div key={medicine.id}>
                          {medicine.name} - Status: {medicine.status}
                          <button onClick={() => sellMedicine(medicine.id)}>
                            <img src={medicineIcon} alt="Sell" /> Sell to Customer
                          </button>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}

        <h2>Medicines</h2>
        <ul>
          {medicines.map((medicine) => (
              <li key={medicine.id}>
                {medicine.name} - Owner: {medicine.owner} - Status: {medicine.status}
              </li>
          ))}
        </ul>

        <h2>Medicine History</h2>
        <ul>
          {Object.keys(medicineHistory).map((medicineId) => (
              <li key={medicineId}>
                Medicine ID: {medicineId}
                <ul>
                  {medicineHistory[medicineId].map((entry, index) => (
                      <li key={index}>
                        {entry.node} - {entry.action}
                      </li>
                  ))}
                </ul>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default App;
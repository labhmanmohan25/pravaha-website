import React, { useState } from "react";
import "./App.css"; // Import the CSS file for styling
import manufacturerIcon from "./icons/manufacturer.png";
import middlemanIcon from "./icons/middleman.png";
import retailerIcon from "./icons/retailer.png";
import medicineIcon from "./icons/medicine.png";
import "retro.css/css/index.min.css";

const App = () => {
  const [nodes, setNodes] = useState([
    { id: 1, name: "Admin Node", role: "Admin", medicines: [] },
  ]);
  const [medicines, setMedicines] = useState([]);
  const [medicineHistory, setMedicineHistory] = useState({});
  const [newNodeName, setNewNodeName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [medicineName, setMedicineName] = useState("");

  const createNode = (role) => {
    if (!newNodeName || !selectedNode || selectedNode.role !== "Admin") return;

    const newNode = {
      id: nodes.length + 1,
      name: newNodeName,
      role,
      medicines: [],
    };

    setNodes([...nodes, newNode]);
    setNewNodeName("");
  };

  const createMedicine = () => {
    if (!selectedNode || selectedNode.role !== "Manufacturer" || !medicineName)
      return;

    const newMedicine = {
      id: medicines.length + 1,
      name: medicineName,
      owner: selectedNode.name,
      status: "Created",
    };

    setMedicines([...medicines, newMedicine]);
    setMedicineHistory((prevHistory) => ({
      ...prevHistory,
      [newMedicine.id]: [{ node: selectedNode.name, action: "Created" }],
    }));
    setMedicineName("");
  };

  const transferMedicine = (medicineId, newOwnerName) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((med) =>
        med.id === medicineId
          ? { ...med, owner: newOwnerName, status: "In Transit" }
          : med
      )
    );

    setMedicineHistory((prevHistory) => ({
      ...prevHistory,
      [medicineId]: [
        ...(prevHistory[medicineId] || []),
        { node: newOwnerName, action: "Transferred" },
      ],
    }));
  };

  const sellMedicine = (medicineId) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((med) =>
        med.id === medicineId ? { ...med, status: "Sold" } : med
      )
    );

    setMedicineHistory((prevHistory) => ({
      ...prevHistory,
      [medicineId]: [
        ...(prevHistory[medicineId] || []),
        { node: "Customer", action: "Sold" },
      ],
    }));
  };

  return (
    <div className="app">
      <h1 class="title">Medicine Supply Chain</h1>

      <div className="nodes-section">
        <div class="container" style={{ width: "70vw", maxWidth: "1200px" }}>
          <h2 class="subtitle">Admin</h2>
          <div>
            {nodes
              .filter((node) => node.role === "Admin")
              .map((node) => (
                <button
                  class="button is-info"
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                >
                  <img src={manufacturerIcon} alt="Manufacturer" /> {node.name}{" "}
                  - {node.role}
                </button>
              ))}
          </div>

          {selectedNode && selectedNode.role === "Admin" && (
            <div>
              <h3 class="subtitle">Create Node</h3>
              <div class="row center-y space-x-5">
                <input
                  class="input is-info"
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="Node Name"
                />
                <button
                  class="button is-info"
                  onClick={() => createNode("Manufacturer")}
                >
                  <img src={manufacturerIcon} alt="Manufacturer" /> Create
                  Manufacturer
                </button>
                <button
                  class="button is-info"
                  onClick={() => createNode("Middleman")}
                >
                  <img src={middlemanIcon} alt="Middleman" /> Create Middleman
                </button>
                <button
                  class="button is-info"
                  onClick={() => createNode("Retailer")}
                >
                  <img src={retailerIcon} alt="Retailer" /> Create Retailer
                </button>
              </div>
            </div>
          )}
        </div>

        <div class="container" style={{ width: "70vw", maxWidth: "1200px" }}>
          <h2 class="subtitle">Manufacturers</h2>
          <div class="row center-y space-x-5">
            {nodes
              .filter((node) => node.role === "Manufacturer")
              .map((node) => (
                <button
                  class="button is-success"
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                >
                  {node.name} - {node.role}
                </button>
              ))}
          </div>
          {selectedNode && (
            <>
              {selectedNode.role === "Manufacturer" && (
                <div>
                  <h2 class="subtitle">
                    Create Medicine in: {selectedNode.name}
                  </h2>
                  <div class="row center-y space-x-5">
                    <input
                      class="input is-success"
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="Medicine Name"
                    />
                    <button class="button is-success" onClick={createMedicine}>
                      <img src={medicineIcon} alt="Medicine" /> Create Medicine
                    </button>
                  </div>

                  <h4 class="subtitle">Transfer Medicine</h4>
                  {medicines
                    .filter((med) => med.owner === selectedNode.name)
                    .map((medicine) => (
                      <div style={{ marginBottom: "5px" }} key={medicine.id}>
                        <span className="medincine-title">
                          {medicine.name} - Status: {medicine.status}
                        </span>

                        <select
                          class="select is-success"
                          onChange={(e) =>
                            transferMedicine(medicine.id, e.target.value)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select recipient
                          </option>
                          {nodes
                            .filter(
                              (node) =>
                                node.role === "Middleman" ||
                                node.role === "Retailer"
                            )
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
            </>
          )}
        </div>

        <div class="container" style={{ width: "70vw", maxWidth: "1200px" }}>
          <h2 class="subtitle">Middlemen</h2>
          <div class="row center-y space-x-5">
            {nodes
              .filter((node) => node.role === "Middleman")
              .map((node) => (
                <button
                  class="button is-danger"
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                >
                  {node.name} - {node.role}
                </button>
              ))}
          </div>
          {selectedNode && (
            <div>
              {selectedNode.role === "Middleman" && (
                <div>
                  <h4 class="subtitle">Transfer Medicine</h4>
                  {medicines
                    .filter((med) => med.owner === selectedNode.name)
                    .map((medicine) => (
                      <div style={{ marginBottom: "5px" }} key={medicine.id}>
                        <span className="medincine-title">
                          {medicine.name} - Status: {medicine.status}
                        </span>
                        <select
                          class="select is-success"
                          onChange={(e) =>
                            transferMedicine(medicine.id, e.target.value)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select recipient
                          </option>
                          {nodes
                            .filter(
                              (node) =>
                                node.role === "Middleman" ||
                                node.role === "Retailer"
                            )
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
            </div>
          )}
        </div>

        <div class="container" style={{ width: "70vw", maxWidth: "1200px" }}>
          <h2 class="subtitle">Retailers</h2>
          <div class="row center-y space-x-5">
            {nodes
              .filter((node) => node.role === "Retailer")
              .map((node) => (
                <button
                  class="button is-warning"
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                >
                  {node.name} - {node.role}
                </button>
              ))}
          </div>
          {selectedNode && (
            <div>
              {selectedNode.role === "Retailer" && (
                <div>
                  <h4 class="subtitle">Sell Medicine</h4>
                  {medicines
                    .filter(
                      (med) =>
                        med.owner === selectedNode.name && med.status !== "Sold"
                    )
                    .map((medicine) => (
                      <div
                        class="row wrap"
                        style={{ marginBottom: "15px" }}
                        key={medicine.id}
                      >
                        <span className="medincine-title">
                          {medicine.name} - Status: {medicine.status}
                        </span>
                        <button
                          class="button"
                          onClick={() => sellMedicine(medicine.id)}
                        >
                          <img src={medicineIcon} alt="Sell" /> Sell to Customer
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <h1 className="subtitle" style={{ marginTop: "2rem" }}>
        Medicines
      </h1>

      <table
        class="table with-wood"
        style={{ width: "70vw", maxWidth: "1200px" }}
      >
        <tr>
          <th>Medicine Name</th>
          <th>Owner</th>
          <th>Status</th>
        </tr>
        {medicines.map((medicine) => (
          <tr>
            <td>{medicine.name}</td>
            <td>{medicine.owner}</td>
            <td>
              <span
                style={{
                  color:
                    medicine.status === "Sold"
                      ? "#28a745" // Green for "Sold"
                      : medicine.status === "In Transit"
                      ? "#ffc107" // Yellow for "In Transit"
                      : "#007bff", // Blue for other statuses
                }}
              >
                {medicine.status}
              </span>
            </td>
          </tr>
        ))}
      </table>

      <h1 className="subtitle" style={{ marginTop: "3rem" }}>
        Medicine History
      </h1>
      <div
        class="row center space-10 wrap"
        style={{ width: "70vw", maxWidth: "1200px" }}
      >
        {Object.keys(medicineHistory).map((medicineId) => (
          <div class="card" key={medicineId} style={{ marginBottom: "2rem" }}>
            <h3 class="subtitle">Medicine ID: {medicineId}</h3>
            <ul>
              {medicineHistory[medicineId].map((entry, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  <strong>{entry.node}</strong> - {entry.action}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

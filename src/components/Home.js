import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {  Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import UpdateForm from './UpdateForm';
import Logs from "./Logs";
import Nav from "./Nav";
import axios from "axios";
import getAxiosInstance from "../services/api2";

function Home(props) {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showLogsForm, setShowLogsForm] = useState(false);
const [currentIncident, setCurrentIncident] = useState(null);
 const onIncidentUpdate = props.onIncidentUpdate;
  const { role ,contextjwt} = useContext(AuthContext);
  const instance = getAxiosInstance(contextjwt);
  const navigate = useNavigate();
  useEffect(() => {


    const getIncidents = async () => {
      try {

       
        const response = await instance.get("getincidents");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch incidents", error);
        return null;
      }
    };

    getIncidents()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });

    const getIncidentsSummary = async () => {
      try {
        const response = await instance.get("getincidentsummary");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch incident summary", error);
        return null;
      }
    };

    getIncidentsSummary()
      .then((data) => {
        setSummary(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!data || !summary) {
    return "Loading...";
  }




const handleViewLogs = (incident) => {
  setCurrentIncident(incident);
  if (incident.logsCollection.length === 0) {
    alert("No logs associated with this incident");
  }
  else {
 // navigate('/logs', { state: { logs: incident.logsCollection ,incidentId: currentIncident.incidentID } });
  setShowLogsForm(true); 
}
};
  
const handleUpdate = (incident) => {
  setCurrentIncident(incident);
  setShowUpdateForm(true);
};


  const { personalIncidents, reporteeIncidents } = data;

  function renderAdminActionButtons(incident) {
    return (
      <>
        <Button onClick={() => handleViewLogs(incident)}>View Logs</Button>
        <span> </span>
        {
          role === "ROLE_ADMIN" && incident.status.toLowerCase() !== "resolved" && (
            <Button onClick={() => handleUpdate(incident)}>Update</Button>
          )
        }
      </>
    );
  }

  function renderActionButtons(incident) {
    return (
      <>
        <Button onClick={() => handleViewLogs(incident)}>View Logs</Button>
        <span> </span>
        {
          incident.status.toLowerCase() !== "resolved" && (
            <Button onClick={() => handleUpdate(incident)}>Update</Button>
          )
        }
      </>
    );
  }
  

  return (
    <div
    style={{
      borderColor: "white",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundImage: `url("loginpage.jpg")`,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("loginpage.jpg")`, 
      minHeight: "100vh",
    }}
  >
    <div className="px-3">
      <Nav />
      <div className="container-fluid">
        <div className="row g-3 my-2">
          <div className="col-md-3 p-1">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <p className="fs-4">All</p>
                <h3 className="fs-4">{summary.all}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 p-1">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <p className="fs-4">Active</p>
                <h3 className="fs-4">{summary.active}</h3>
              </div>
              <i className="bi bi-circle-fill p-3 fs-1 text-danger"></i>
            </div>
          </div>

          <div className="col-md-3 p-1">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <p className="fs-4">Pending</p>
                <h3 className="fs-4">{summary.pending}</h3>
              </div>
              <i className="bi bi-circle-fill p-3 fs-1 text-warning"></i>
            </div>
          </div>

          <div className="col-md-3 p-1">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <p className="fs-4">Resolved</p>
                <h3 className="fs-4">{summary.resolved}</h3>
              </div>
              <i className="bi bi-circle-fill p-3 fs-1 text-success"></i>
            </div>
          </div>
        </div>
      </div>

      {personalIncidents && personalIncidents.length > 0 && (
        <table className="table table-hover caption-top bg-white rounded mt-2" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', overflow: 'hidden' }}>          <caption className="text-white fs-4"> My Cases</caption>
          <thead>
            <tr>
              <th scope="col">Case ID</th>
              <th scope="col">Submitter</th>
              <th scope="col">Date</th>
              <th scope="col">Summary</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personalIncidents.map((incident, index) => (
              <tr key={index}>
                <th scope="row">{incident.incidentID}</th>
                <td>{incident.reporter}</td>
                <td>{new Date(incident.reportedtime).toLocaleDateString()}</td>
                <td>{incident.description}</td>
                <td>{incident.status}</td>
                <td>
                 {renderActionButtons(incident)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {reporteeIncidents && reporteeIncidents.length > 0 && (
        <table className="table table-hover caption-top bg-white rounded mt-2" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', overflow: 'hidden' }}>          <caption className="text-white fs-4"> Reportee Cases</caption>
          <thead>
            <tr>
              <th scope="col">Case ID</th>
              <th scope="col">Submitter</th>
              <th scope="col">Date</th>
              <th scope="col">Summary</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reporteeIncidents.map((incident, index) => (
              <tr key={index}>
                <th scope="row">{incident.incidentID}</th>
                <td>{incident.reporter}</td>
                <td>{new Date(incident.reportedtime).toLocaleDateString()}</td>
                <td>{incident.description}</td>
                <td>{incident.status}</td>
                <td>
                {renderAdminActionButtons(incident)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(!personalIncidents || personalIncidents.length === 0) &&
        (!reporteeIncidents || reporteeIncidents.length === 0) && (
          <p>No Incidents to display!</p>
        )}
    <UpdateForm show={showUpdateForm} handleClose={() => setShowUpdateForm(false)} incident={currentIncident} onIncidentUpdate={onIncidentUpdate} />
    <Logs show={showLogsForm} handleClose={() => setShowLogsForm(false)} logs={currentIncident ? currentIncident.logsCollection : null} incidentId={currentIncident ? currentIncident.incidentID : null} />

    </div>
    </div>
  );
}

export default Home;

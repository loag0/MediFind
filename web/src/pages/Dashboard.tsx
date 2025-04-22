import '../styles/dashboard.css';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit, faFileAlt} from '@fortawesome/free-solid-svg-icons'
import placeholder from '../assets/placeholder-profile.png';

export default function Dashboard() {

  type Doctor = {
    id: string;
    fullName: string;
    email: string;
    profession: string;
    gender?: string;
    phone?: string;
    fax?: string;
    bio?: string;
    location?: string;
    profileImageUrl?: string;
    isSuspended?: boolean;
  };

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const list: Doctor[] = snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Doctor, 'id'>)
        }));        
        setDoctors(list);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, []);
  

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
  
      <div className="dashboard-page">
        <div className="dashboard-stats">
          <div className="details">
            <div>
              <p>Total number of doctors: {doctors.length} </p>
            </div>
            <div>
              <p>Total number of specialties: {new Set(doctors.map(doc => doc.profession)).size} </p>
            </div>
          </div>

          <div className="doctor-list">
            {loading ? (
              <p className="loading-text">Loading doctors...</p>
            ) : (

              doctors.map(doc => (
                <div key={doc.id} className={`doctor-card ${doc.isSuspended ? 'suspended' : ''}`}>
                  <div className="doctor-card-content">
                    <div className="doctor-profile-pic">
                      <img 
                        src={doc.profileImageUrl || placeholder} 
                        alt={doc.fullName} 
                      />
                    </div>
                
                    <div className="doctor-info">
                      <h2>{doc.fullName}</h2>
                      <p className="doctor-location">{doc.location || "No location"}</p>
                      <p className="doctor-profession">{doc.profession}</p>
                
                      <div className="doctor-actions">
                        <Link to={`/edit-doctor/${doc.id}`} className="action-btn edit-btn">
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </Link>
                
                        {!doc.isSuspended && (
                          <button 
                            onClick={() => console.log(`Generate report for ${doc.id}`)} 
                            className="action-btn report-btn"
                            ><FontAwesomeIcon icon={faFileAlt} /> Generate Report</button>
                          )}
                      </div>
                    </div>
                  </div>
                
                  {doc.isSuspended && (
                    <div className="suspended-overlay">
                      <span>SUSPENDED</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
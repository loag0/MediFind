import '../styles/dashboard.css';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileAlt } from '@fortawesome/free-solid-svg-icons';
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
    location?: string | { _lat: number; _long: number };
    profileImageUrl?: string;
    isSuspended?: boolean;
  };

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const snap = await getDocs(collection(db, 'doctors'));
        console.log("📦 Fetched Docs:", snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
        // Check if we got any documents at all
        if (snap.empty) {
          console.log("No documents found in the 'doctors' collection");
          setDoctors([]);
          return;
        }
    
        const validDocs: Doctor[] = [];
    
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          
          // More robust validation
          if (!data || typeof data !== 'object') {
            console.warn(`⚠️ Doc ${docSnap.id} has invalid data structure`);
            return;
          }
          
          if (!data.fullName) {
            console.warn(`⚠️ Doc ${docSnap.id} missing fullName. Skipping...`);
            return;
          }
    
          validDocs.push({
            id: docSnap.id,
            fullName: data.fullName || 'Unknown',
            email: data.email || '',
            profession: data.profession || 'Not specified',
            gender: data.gender,
            phone: data.phone,
            fax: data.fax,
            bio: data.bio,
            location: data.location,
            profileImageUrl: data.profileImageUrl,
            isSuspended: data.isSuspended
          });
        });
    
        console.log("✅ Valid Doctors:", validDocs);
        setDoctors(validDocs);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
        setError("Failed to load doctors. Please try refreshing the page.");
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
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : doctors.length === 0 ? (
              <div className="no-doctors">
                <p style={{ color: "black" }}>No doctors available</p>
                <p>You may need to add some doctors to your database.</p>
              </div>
            ) : (
              doctors.map(doc => (
                <div key={doc.id} className={`doctor-card ${doc.isSuspended ? 'suspended' : ''}`}>
                  <div className="doctor-card-content">
                    <div className="doctor-profile-pic">
                      <img
                        src={doc.profileImageUrl || placeholder}
                        alt={doc.fullName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholder;
                        }}
                      />
                    </div>

                    <div className="doctor-info">
                      <h2>{doc.fullName}</h2>
                      <p className="doctor-location">
                        {typeof doc.location === 'object' && '_lat' in doc.location && '_long' in doc.location
                          ? `${doc.location._lat}, ${doc.location._long}`
                          : doc.location || "No location"}
                      </p>
                      <p className="doctor-profession">{doc.profession}</p>

                      <div className="doctor-actions">
                        <Link to={`/edit-doctor/${doc.id}`} className="action-btn edit-btn">
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </Link>

                        {!doc.isSuspended && (
                          <Link
                            to={`/doctor-report/${doc.id}`}
                            className="action-btn report-btn"
                          >
                            <FontAwesomeIcon icon={faFileAlt} /> Generate Report
                          </Link>
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
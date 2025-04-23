import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/doctorReport.css';
import Navbar from '../components/Navbar';

export default function DoctorReport() {
  const { id } = useParams();
  const reportRef = useRef<HTMLDivElement | null>(null);

  interface Doctor {
    fullName: string;
    email: string;
    profession: string;
    gender: string;
    phone: string;
    fax: string;
    location: string;
    rating?: number;
    isSuspended: boolean;
    workingHours?: {
      start: string;
      end: string;
    };
    bio: string;
  }

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const snap = await getDoc(doc(db, 'doctors', id!));
        if (snap.exists()) {
          setDoctor(snap.data() as Doctor);
        }
      } catch (err) {
        console.error("Failed to fetch report:", err);
      }
    };

    fetchDoctor();
  }, [id]);

  const printPage = () => {
    const content = reportRef.current?.innerHTML;
    const win = window.open('', '_blank');
    if (win && content) {
      win.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; }
              .report-info p { margin-bottom: 0.5rem; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      win.document.close();
      win.focus();
      win.print();
      win.close();
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="container">
      <Navbar />

      <div className="report-page">
        <h1>Doctor Report</h1>
        
        <div className="report-info" ref={reportRef}>
          <p><strong>Full Name:</strong> {doctor.fullName}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Profession:</strong> {doctor.profession}</p>
          <p><strong>Gender:</strong> {doctor.gender}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>Fax:</strong> {doctor.fax}</p>
          <p><strong>Location:</strong> {doctor.location}</p>
          <p><strong>Rating:</strong> {doctor.rating ?? 'N/A'}</p>
          <p><strong>Status:</strong> {doctor.isSuspended ? 'Suspended' : 'Active'}</p>
          <p><strong>Working Hours:</strong> {doctor.workingHours?.start} - {doctor.workingHours?.end}</p>
          <p><strong>Bio:</strong> {doctor.bio}</p>
        </div>

        <button onClick={printPage} className="print-btn">Print Report</button>
      </div>
    </div>
  );
}

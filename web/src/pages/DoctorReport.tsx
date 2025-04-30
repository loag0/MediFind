import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/doctorReport.css';
import Navbar from '../components/Navbar';
import html2pdf from 'html2pdf.js';
import ReactDOMServer from 'react-dom/server';
import DoctorPDF from '../components/DoctorPDF';

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
    city: string;
    location: string | { lat: number; lng: number };
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
    if (doctor) {
      const html = ReactDOMServer.renderToStaticMarkup(<DoctorPDF doctor={doctor} />);
      html2pdf()
        .from(html)
        .set({
          margin: 0.5,
          filename: `${doctor.fullName.replace(/\s+/g, '_')}_Report.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .save();
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

        {doctor.location && typeof doctor.location === 'object' && (
          <p>
            <strong>City:</strong>{' '}
            <a
              href={`https://www.google.com/maps?q=${doctor.location.lat || doctor.location.lat},${doctor.location.lng || doctor.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
            {doctor.city || 'Unknown'}
            </a>
          </p>
        )}

        <p><strong>Status:</strong> {doctor.isSuspended ? 'Suspended' : 'Active'}</p>
        <p><strong>Working Hours:</strong> {doctor.workingHours?.start} - {doctor.workingHours?.end}</p>
        <p><strong>Bio:</strong> {doctor.bio}</p>

        </div>
          <button onClick={printPage} className="download-btn">Download Report</button>
        </div>
      </div>
  );
}

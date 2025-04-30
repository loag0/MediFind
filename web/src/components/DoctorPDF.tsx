export default function DoctorPDF({ doctor }: { doctor: {
  fullName: string;
  email: string;
  profession: string;
  gender: string;
  phone: string;
  fax: string;
  city: string;
  location: string | { lat: number; lng: number } | null;
  isSuspended: boolean;
  workingHours?: {
    start: string;
    end: string;
  };
  bio: string;
} }) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      overflowWrap: 'break-word',
      wordWrap: 'break-word'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        borderBottom: '2px solid #2c3e50',
        paddingBottom: '20px',
        marginBottom: '30px',
      }}>
        <h1 style={{
          fontSize: '28px',
          color: '#2c3e50',
          margin: '0 0 10px',
        }}>Doctor Profile Report</h1>
        <p style={{
          fontSize: '16px',
          color: '#7f8c8d',
          margin: 0,
        }}>Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Personal Info Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '22px',
            color: '#2c3e50',
            marginTop: 0,
            marginBottom: '15px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px',
          }}>Personal Information</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Full Name: </span>
                <span>{doctor.fullName}</span>
              </p>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Profession: </span>
                <span>{doctor.profession}</span>
              </p>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Gender: </span>
                <span>{doctor.gender}</span>
              </p>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Status: </span>
                <span style={{ 
                  color: doctor.isSuspended ? '#e74c3c' : '#27ae60',
                  fontWeight: 'bold' 
                }}>
                  {doctor.isSuspended ? 'Suspended' : 'Active'}
                </span>
              </p>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Working Hours: </span>
                <span>{doctor.workingHours?.start} - {doctor.workingHours?.end}</span>
              </p>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>City: </span>
                <span>{doctor.city}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '22px',
            color: '#2c3e50',
            marginTop: 0,
            marginBottom: '15px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px',
          }}>Contact Information</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Email: </span>
                <span>{doctor.email}</span>
              </p>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Phone: </span>
                <span>{doctor.phone}</span>
              </p>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Fax: </span>
                <span>{doctor.fax}</span>
              </p>
              <p style={{ margin: '5px 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>Location: </span>
                <a 
                  href={doctor.location ? 
                    (typeof doctor.location === 'string' 
                      ? `https://maps.google.com/?q=${doctor.location}`
                      : `https://maps.google.com/?q=${doctor.location.lat},${doctor.location.lng}`) 
                    : '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    color: '#3498db',
                    textDecoration: 'none',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {doctor.location ? 'View on Google Maps' : 'Location not available'}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '22px',
            color: '#2c3e50',
            marginTop: 0,
            marginBottom: '15px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px',
          }}>Professional Biography</h2>
          
          <p style={{ 
            margin: '5px 0',
            lineHeight: '1.6',
            
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            maxWidth: '100%'
          }}>
            {doctor.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
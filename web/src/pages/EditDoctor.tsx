import "../styles/add_doctor.css";
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStop } from '@fortawesome/free-solid-svg-icons';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/Medi-Find/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'MediFind';

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    profession: '',
    gender: '',
    phone: '',
    fax: '',
    location: '',
    bio: '',
    rating: 0,
    profileImageUrl: '',
    workingHours: {
      start: '',
      end: '',
    },
    isSuspended: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, 'doctors', id as string);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setForm(prev => ({
            ...prev,
            ...data,
          }));
          setPreviewUrl(data.profileImageUrl || '');
        } else {
          alert("Doctor not found.");
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Error loading doctor:", err);
        alert("Something went wrong while loading the doctor.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoctor();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (previewUrl) {
      setImageFile(null);
      setPreviewUrl(null);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      let imageUrl = previewUrl || '';
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData
        });
  
        const data = await res.json();
  
        if (!data.secure_url) {
          console.error("Cloudinary upload error:", data);
          throw new Error("Image upload failed");
        }
  
        imageUrl = data.secure_url;
      }
  
      await updateDoc(doc(db, 'doctors', id as string), {
        ...form,
        profileImageUrl: imageUrl,
        rating: Number(form.rating),
      });
  
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error updating doctor:", err.message);
      } else {
        console.error("Error updating doctor:", err);
      }
      alert('Error updating doctor.');
    }
  };
  

  const handleSuspend = async () => {
    if (!id) return;
    try {
      const newStatus = !form.isSuspended;
      await updateDoc(doc(db, 'doctors', id), {
        isSuspended: newStatus,
      });
      alert(`Doctor has been ${newStatus ? 'suspended' : 'unsuspended'}.`);
      setForm(prev => ({ ...prev, isSuspended: newStatus }));
    } catch (err) {
      console.error("Error toggling suspension:", err);
    }
  };
  

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'doctors', id));
      alert("Doctor deleted");
      navigate('/dashboard');
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <NavBar />
        <div className="loading">Loading doctor info...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <NavBar />
      <div className="add-doctor-page">
        <h1>Edit Doctor</h1>

        <div className="profile-upload-section">
          {!previewUrl ? (
            <div className="image-placeholder" onClick={handleImageClick}>
              <p>Click to add picture</p>
            </div>
          ) : (
            <div className="profile-img-wrapper">
              <img src={previewUrl} alt="Doctor profile" className="profile-img" />
              <div className="image-controls">
                <button type="button" className="edit-btn" onClick={handleImageClick}>Change</button>
                <button type="button" className="delete-btn" onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}>Remove
                </button>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <form onSubmit={handleSubmit} className="add-doctor-form">
          <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="text" name="profession" placeholder="Profession" value={form.profession} onChange={handleChange} required />
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input type="text" name="fax" placeholder="Fax" value={form.fax} onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} rows={4} />

          <button type="submit">Update Doctor</button>
        </form>

        <div className="divider">
          <span>DANGER ZONE</span>
        </div>

        <div className="edit-actions">
        <button className="edit-buttons" onClick={handleSuspend}>
            <FontAwesomeIcon icon={faStop} className="edit-icons"/>
            {form.isSuspended ? 'Unsuspend' : 'Suspend'}
        </button>

        <button className="edit-buttons" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} className="edit-icons"/> Delete
        </button>
        </div>
      </div>
    </div>
  );
}
import "../styles/add_doctor.css";
import { useState, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/Medi-Find/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'MediFind';

export default function AddDoctor() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error("Image upload failed");

        imageUrl = data.secure_url;
      }

      await addDoc(collection(db, 'doctors'), {
        ...form,
        createdAt: serverTimestamp(),
        profileImageUrl: imageUrl,
        rating: Number(form.rating),
      });

      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error uploading to Cloudinary or Firestore:", err.message);
      } else {
        console.error("An unknown error occurred:", err);
      }
      alert('Error adding doctor.');
    }
  };

  return (
    <div className="container">
      <NavBar />

      <div className="add-doctor-page">
        <h1>Add Details</h1>

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

        <form onSubmit={handleSubmit} className={`add-doctor-form ${previewUrl ? 'with-image' : ''}`}>
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
          
          <label>Start Time</label>
          <input
            type="time"
            name="workingStart"
            value={form.workingHours?.start || ''}
            onChange={(e) =>
              setForm((prev) => ({
              ...prev,
              workingHours: {
                ...prev.workingHours,
                start: e.target.value
                }
              }))
            }
          />

          <label>End Time</label>
          <input
            type="time"
            name="workingEnd"
            value={form.workingHours?.end || ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workingHours: {
                ...prev.workingHours,
                end: e.target.value
                }
              }))
            }
          />

          <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} rows={4} />

          <button type="submit">Save Doctor</button>
        </form>
      </div>
    </div>
  );
}

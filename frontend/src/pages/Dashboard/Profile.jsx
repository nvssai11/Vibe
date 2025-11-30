import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateProfile, getProfile } from '../../api/user.api';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Attempting to fetch profile...');
        console.log('AuthContext currentUser:', currentUser);

        if (!currentUser) {
          console.log('No user object available');
          return;
        }

        const profile = await getProfile();
        console.log('Profile data received:', profile);

        setName(profile.name || '');
        setEmail(profile.email || '');

        setFlatNumber(profile.flatNumber || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        alert('Failed to load profile. Please try again.');
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile({ name, email, phone, flatNumber });
      console.log('Updated profile:', updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f3f4f6, #e2e8f0)',
      borderRadius: '16px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width: '90%',
      padding: '40px',
      boxSizing: 'border-box',
      textAlign: 'center',
      margin: 'auto',
      marginTop: '60px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '30px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    formGroup: {
      textAlign: 'left',
    },
    label: {
      display: 'block',
      fontSize: '18px',
      color: '#2d3748',
      marginBottom: '10px',
    },
    input: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      border: '1px solid #cbd5e0',
      borderRadius: '8px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      backgroundColor: '#edf2f7',
    },
    inputFocus: {
      borderColor: '#3182ce',
      boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.3)',
      outline: 'none',
      backgroundColor: '#ffffff',
    },
    button: {
      backgroundColor: '#3182ce',
      color: '#ffffff',
      fontSize: '20px',
      fontWeight: '700',
      padding: '14px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#2b6cb0',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
      
        <div style={styles.formGroup}>
          <label style={styles.label}>Flat Number:</label>
          <input
            type="text"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
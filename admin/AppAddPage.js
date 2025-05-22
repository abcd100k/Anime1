import React, { useState, useEffect } from 'react';
import styles from './AppAddPage.module.css';
import { db } from '@/admin/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from 'next/router';
import Link from 'next/link';

const AppAddPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    iconUrl: '',
    updatedDate: '',
    season: '',
    episode: '',
    language: '',
    downloadUrl: '',
    watchUrl:'',
    screenshots: [],
    description: ''
  });

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData(prev => ({ ...prev, updatedDate: currentDate }));
  }, []);

  const [screenshotInputs, setScreenshotInputs] = useState(['']);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleScreenshotChange = (index, value) => {
    const newScreenshots = [...screenshotInputs];
    newScreenshots[index] = value;
    setScreenshotInputs(newScreenshots);

    const updatedScreenshots = [...formData.screenshots];
    updatedScreenshots[index] = value;
    setFormData(prevFormData => ({
      ...prevFormData,
      screenshots: updatedScreenshots,
    }));
  };

  const addScreenshotInput = () => {
    setScreenshotInputs([...screenshotInputs, '']);
    setFormData(prevFormData => ({
      ...prevFormData,
      screenshots: [...prevFormData.screenshots, ''],
    }));
  };

  const removeScreenshotInput = (index) => {
    const newScreenshots = [...screenshotInputs];
    newScreenshots.splice(index, 1);
    setScreenshotInputs(newScreenshots);

    const updatedScreenshots = [...formData.screenshots];
    updatedScreenshots.splice(index, 1);

    setFormData(prevFormData => ({
      ...prevFormData,
      screenshots: updatedScreenshots,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.language) {
      setMessage('Please fill in the required fields (name, language).');
      setSuccess(false);
      return;
    }

    const screenshots = screenshotInputs.filter(url => url.trim() !== '');

    const appData = {
      ...formData,
      screenshots: screenshots,
      updatedDate: new Date().toLocaleDateString()
    };

    setIsLoading(true);

    try {
      const appsCollection = collection(db, 'anime');
      const document = await addDoc(appsCollection, appData);
      setMessage('App added successfully!');
      setSuccess(true);

      router.push(`/edit/${document.id}`);
    } catch (error) {
      console.error(`Error adding app: ${error.message}`);
      setMessage(`Error adding app: ${error.message}`);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['app-add-page']}>
      <h2>Add New App</h2>
      {message && (
        <div className={`${styles.message} ${success ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
      {isLoading && <div className={styles['loading-message']}>Adding app...</div>}
      <form onSubmit={handleSubmit} style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
        <div className="form-group">
          <label htmlFor="name">App Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="subtitle">Subtitle:</label>
          <input type="text" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="iconUrl">Icon URL:</label>
          <input type="text" id="iconUrl" name="iconUrl" value={formData.iconUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="updatedDate">Updated Date:</label>
          <input type="text" id="updatedDate" name="updatedDate" value={formData.updatedDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="season">Season:</label>
          <input type="text" id="season" name="season" value={formData.season} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="episode">Episode:</label>
          <input type="text" id="episode" name="episode" value={formData.episode} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <input type="text" id="language" name="language" value={formData.language} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="downloadUrl">Download URL:</label>
          <input type="text" id="downloadUrl" name="downloadUrl" value={formData.downloadUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="watchUrl">Watch URL:</label>
          <input type="text" id="watchUrl" name="watchUrl" value={formData.watchUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Screenshots:</label>
          {screenshotInputs.map((input, index) => (
            <div key={index} className="screenshot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => handleScreenshotChange(index, e.target.value)}
                placeholder={`Screenshot URL ${index + 1}`}
              />
              {index !== 0 && (
                <button type="button" onClick={() => removeScreenshotInput(index)} className={styles['remove-screenshot-btn']}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addScreenshotInput} className={styles['add-screenshot-btn']}>
            Add Screenshot
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>
        
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add App'}
        </button>
      </form>
    </div>
  );
};

export default AppAddPage;
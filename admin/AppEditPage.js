// AppEditPage.js
import { useState, useEffect } from 'react';
import './AppEditPage.module.css';
import { db } from './firebaseConfig'; // Adjust your import based on your setup
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { useRouter } from 'next/router';

const AppEditPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    subtitle: '',
    iconUrl: '',
    updatedDate: '',
    season: '',
    episode: '',
    language: '',
    downloadUrl: '',
    watchUrl: '',
    screenshots: [],
    description: ''
  });

  const [screenshotInputs, setScreenshotInputs] = useState(['']);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appFound, setAppFound] = useState(true);

  const router = useRouter();
  const { id: appId } = router.query; // Use useRouter to get the ID

  useEffect(() => {
    const fetchAppData = async () => {
      if (!appId) {
        console.error("App ID is missing.");
        setAppFound(false);
        return;
      }

      setIsLoading(true);
      const appRef = doc(db, 'anime', appId); // Reference to the Firestore document

      try {
        const docSnap = await getDoc(appRef);
        if (docSnap.exists()) {
          const appData = docSnap.data();
          const initialScreenshots = appData.screenshots || [];
          setScreenshotInputs(initialScreenshots.map(url => url || ''));

          setFormData({
            id: appId,
            name: appData.name || '',
            subtitle: appData.subtitle || '',
            iconUrl: appData.iconUrl || '',
            updatedDate: appData.updatedDate || '',
            season: appData.season || '',
            episode: appData.episode || '',
            language: appData.language || '',
            downloadUrl: appData.downloadUrl || '',
            watchUrl: appData.watchUrl || '',
            screenshots: initialScreenshots,
            description: appData.description || ''
          });
        } else {
          setAppFound(false);
          setMessage("App not found.");
          setSuccess(false);
        }
      } catch (error) {
        console.error("Error fetching app data:", error);
        setMessage(`Error fetching app data: ${error.message}`);
        setSuccess(false);
        setAppFound(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppData();
  }, [appId]);

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
      screenshots: screenshots
    };

    const appRef = doc(db, 'anime', appId); // Reference to the Firestore document
    setIsLoading(true);

    try {
      await updateDoc(appRef, appData);
      setMessage('App updated successfully!');
      setSuccess(true);
    } catch (error) {
      console.error('Error updating app:', error);
      setMessage(`Error updating app: ${error.message}`);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!appFound) {
    return (
      <div className="app-edit-page">
        <h2>Edit App</h2>
        {message && <div className={`message ${success ? 'success' : 'error'}`}>{message}</div>}
        {isLoading && <div className="loading-message">Loading...</div>}
        {!isLoading && <p>App not found.</p>}
      </div>
    );
  }

  return (
    <div className="app-edit-page">
      <h2>Edit App</h2>
      {message && (
        <div className={`message ${success ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      {isLoading && <div className="loading-message">Updating app...</div>}
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
              {index > 0 && (
                <button type="button" onClick={() => removeScreenshotInput(index)} className="remove-screenshot-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addScreenshotInput} className="add-screenshot-btn">
            Add Screenshot
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update App'}
        </button>
      </form>
    </div>
  );
};

export default AppEditPage;
import React, { useState, useEffect } from 'react';

import { db } from './firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';

const AppList = () => {
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const appsCollection = collection(db, 'anime');
        const snapshot = await getDocs(appsCollection);

        const appsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedApps = appsArray.sort((a, b) =>
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        );

        setApps(sortedApps);
      } catch (err) {
        setError(err.message || 'Failed to fetch apps.');
        console.error("Error fetching apps:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  const handleDelete = async (id) => {
    const appRef = doc(db, 'anime', id);

    try {
      await deleteDoc(appRef);
      setApps(prevApps => prevApps.filter(app => app.id !== id));
    } catch (err) {
      console.error("Error deleting app:", err);
      setError('Failed to delete app.');
    }
  };

  if (isLoading) {
    return <div className="app-list-loading">Loading apps...</div>;
  }

  if (error) {
    return <div className="app-list-error">Error: {error}</div>;
  }

  return (
    <div className="app-list">
      <h2>App List</h2>
      <Link href="/add" className="add-app-button">
        Add App
      </Link>
      {apps.length === 0 ? (
        <div className="app-list-empty">No apps found.</div>
      ) : (
        <ul className="app-list-items">
          {apps.map(app => (
            <li key={app.id} className="app-list-item">
              <div className="app-list-item-content">
                <img src={app.iconUrl} alt={app.name} className="app-list-item-icon" />
                <div className="app-list-item-details">
                  <h3 className="app-list-item-name">{app.name}</h3>
                  <p className="app-list-item-language">Language: {app.language}</p>
                  <p className="app-list-item-season">Season: {app.season}</p>
                  <p className="app-list-item-date">Added on: {app.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
                <Link href={`/edit/${app.id}`} className="app-list-item-edit-button">
                  Edit
                </Link>
                <button onClick={() => handleDelete(app.id)} className="app-list-item-delete-button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppList;
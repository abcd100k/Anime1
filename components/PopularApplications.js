import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import {db} from "../admin/firebaseConfig";

const RecommendSection = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const appsCollection = collection(db, "anime");
        const snapshot = await getDocs(appsCollection);

        const appsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        appsArray.sort((a, b) => b.viewCount - a.viewCount);
        const topApps = appsArray.slice(0, 4);

        setApps(topApps);
      } catch (err) {
        setError(err);
        console.error("Error fetching apps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Error Loading post: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2>Popular for you</h2>
      <section className="recommend">
        {apps.map((app) => (
          <div key={app.id} className="box_project">
            <div onClick={() => router.push(`/view/${app.id}`)}>
              <img src={app.iconUrl} alt={app.name} />
            </div>
            <p>
              <div className="title">{app.name}</div>
              {app.new && <span className="badge new">NEW</span>}
              {app.updates && <span className="badge">UPDATES</span>}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default RecommendSection;
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../admin/firebaseConfig";

const SearchPage = () => {
  const router = useRouter();
  const { q: initialQuery = "" } = router.query;

  const [apps, setApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const appsCollection = collection(db, "anime");
        const appsSnapshot = await getDocs(appsCollection);
        const appsArray = appsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApps(appsArray);
        setFilteredApps(appsArray);
      } catch (err) {
        setError(err);
        console.error("Error fetching apps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  useEffect(() => {
    const results = apps.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApps(results);
  }, [searchQuery, apps]);

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: { q: searchQuery },
    });
  }, [searchQuery]);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  return (
    <>
      <h2>Search Apps</h2>
      <input
        type="text"
        placeholder="Search for an app..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <section className="latest">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <center key={app.id}>
              <div className="anime box_project">
                <Link href={"/view/" + app.id} legacyBehavior>
                  <img src={app.iconUrl} alt={app.name} />
                </Link>
                <div>
                  <span className="title">{app.name}</span>
                  {app.new && <span className="badge new">NEW</span>}
                  {app.updates && <span className="badge">UPDATES</span>}
                </div>
              </div>
            </center>
          ))
        ) : (
          <p>No results found</p>
        )}
      </section>
    </>
  );
};

export default SearchPage;
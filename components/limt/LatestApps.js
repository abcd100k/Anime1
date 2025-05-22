import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/admin/firebaseConfig';

const LatestApps = () => {
  const router = useRouter();
  const { n: pageFromUrlStr } = router.query;
  const pageFromUrl = parseInt(pageFromUrlStr, 10) || 1;

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const appsCollection = collection(db, 'anime');
        const appsSnapshot = await getDocs(appsCollection);
        const appsArray = appsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        appsArray.sort((a, b) => {
          const dateA = new Date(a.updatedDate);
          const dateB = new Date(b.updatedDate);
          return dateB - dateA;
        });
        setApps(appsArray);
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
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    router.push(`/page?n=${nextPage}`);
  };

  const handleBack = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      if (previousPage === 1) {
        router.push('/');
        return;
      }
      router.push(`/page?n=${previousPage}`);
    }
  };

  const indexOfLastApp = currentPage * itemsPerPage;
  const indexOfFirstApp = indexOfLastApp - itemsPerPage;
  const currentApps = apps.slice(indexOfFirstApp, indexOfLastApp);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  return (
    <>
      {pageFromUrl === 1 && (
        <h2>Latest Posts</h2>
      )}
      {pageFromUrl !== 1 && (
        <div className="pagination-info">
          <span>Page {currentPage}</span>
        </div>
      )}
      <section className={pageFromUrl === 1 ? "latest" : "latest"}>
        {currentApps.map((app) => (
          <center key={app.id}>
            <div className={pageFromUrl === 1 ? "anime box_project l_project" : "anime box_project"}>
              <Link href={`/view/${app.id}`} legacyBehavior>
                <img src={app.iconUrl} alt={app.name} />
              </Link>
              <p>
                <span className="title">{app.name}</span>
                {app.new && <span className="badge new">NEW</span>}
                {app.updates && <span className="badge">UPDATES</span>}
              </p>
            </div>
          </center>
        ))}
      </section>
      <div className="pagination-controls">

        {currentPage > 1 && (
          <>
            <div className="view-more"><button onClick={handleBack}>
              Back
            </button></div></>
        )}
        {currentApps.length < apps.length && (
          <div className="view-more">
            <button onClick={handleLoadMore} >
              View More
            </button>
          </div>
        )
        }
      </div>
    </>
  );
};

export default LatestApps;
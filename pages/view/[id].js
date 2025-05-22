import React, { useState, useEffect } from "react";import dynamic from "next/dynamic";
import Layout from "@/layout/Layout";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/admin/firebaseConfig";

// Lazy load the AppDetails component
const AppDetails = dynamic(() => import("../../components/AppDetails"), {
  ssr: false, // optional: remove this line if you want server-side render inside the component too
});

const View = () => {
  const [app, setApp] = useState(null);
  const isClient = typeof window !== 'undefined';

  const appId = isClient ? window.location.pathname.split("/").pop() : null;

  useEffect(() => {
    if (appId) {
      const fetchApp = async () => {
        const docRef = doc(db, "anime", appId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const appData = docSnap.data();
          appData.viewCount = (appData.viewCount || 0) + 1;

          try {
            await updateDoc(docRef, { viewCount: appData.viewCount });
          } catch (err) {
            console.warn("Failed to update view count:", err);
          }

          setApp({
            ...appData,
            id: appId,
          });
        } else {
          setApp(null);
        }
      };

      fetchApp();
    }
  }, [appId]);

  return (
    <Layout>
      <AppDetails app={app} />
    </Layout>
  );
};
export default View;

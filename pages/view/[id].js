import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/layout/Layout";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/admin/firebaseConfig";
import { env } from "@/next.config";

const AppDetails = dynamic(() => import("../../components/AppDetails"), {
  ssr: false,
});

const View = () => {
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id: appId } = router.query;

  useEffect(() => {
    if (!appId) return;

    const fetchApp = async () => {
      try {
        const docRef = doc(db, "anime", appId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError({ status: 404, message: "Anime not found" });
          return;
        }

        const appData = docSnap.data();
        const newViewCount = (appData.viewCount || 0) + 1;

        // Update view count in background
        updateDoc(docRef, { viewCount: newViewCount }).catch(console.error);

        setApp({
          ...appData,
          id: appId,
          viewCount: newViewCount,
        });
      } catch (err) {
        console.error("Data fetch failed:", err);
        setError({ status: 500, message: "Failed to load anime details" });
      }
    };

    fetchApp();
  }, [appId]);

  if (error) {
    return (
      <Layout>
        <Head>
          <title>Error {error.status} | Mxime Xyz</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="error-page">
          <h1>Error {error.status}</h1>
          <p>{error.message}</p>
        </div>
      </Layout>
    );
  }

  if (!app) {
    return (
      <Layout>
        <Head>
          <title>Loading... | Mxime Xyz</title>
          <meta name="robots" content="noindex" />
        </Head>
      </Layout>
    );
  }

  // Generate meta description from app data
  const metaDescription = app.description
    ? `${app.description.substring(0, 160)}...`
    : `Details about ${app.title}`;

  // Structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: app.title,
    image: app.imageUrl,
    description: metaDescription,
    aggregateRating: app.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: app.rating,
          bestRating: "10",
          ratingCount: app.ratingCount || 1,
        }
      : undefined,
  };

  return (
    <Layout>
      <Head>
        <title>{`${app.title} | Your Site Name`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`anime, ${app.title}, ${app.genre?.join(", ") || ""}`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${window.location.origin}/view/${appId}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="video.tv_show" />
        <meta property="og:title" content={app.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={app.imageUrl} />
        <meta property="og:url" content={`${window.location.origin}/view/${appId}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={app.title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={app.imageUrl} />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <AppDetails app={app} />
    </Layout>
  );
};

export default View;
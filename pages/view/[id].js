import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/admin/firebaseConfig';
import Layout from '@/layout/Layout';
import dynamic from 'next/dynamic';
import { fetchAllAppIds } from '@/lib/firebaseHelpers';

const AppDetails = dynamic(() => import('@/components/AppDetails'), {
  loading: () => <div className="min-h-[500px] flex items-center justify-center">Loading app details...</div>,
  ssr: false,
});

const ViewApp = ({ initialData }) => {
  const router = useRouter();
  const [app, setApp] = useState(initialData);

  useEffect(() => {
    if (!app) return;

    const incrementView = async () => {
      try {
        const docRef = doc(db, 'anime', app.id);
        const newViewCount = (app.viewCount || 0) + 1;
        await updateDoc(docRef, { viewCount: newViewCount });
        setApp(prev => ({ ...prev, viewCount: newViewCount }));
      } catch (err) {
        console.error('Failed to update view count:', err);
      }
    };

    incrementView();
  }, [app]);

  if (!app) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">App not found</div>
      </Layout>
    );
  }

  const metaDescription = app.description
    ? `${app.description.substring(0, 160)}${app.description.length > 160 ? '...' : ''}`
    : `View details about ${app.title}`;
    const metatitle = app.title || 'Watch Anime Online';


  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://mxime.xyz/`;

  return (
    <>
      <Head>
        <title >{metatitle} | {`Mxime Xyz`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metatitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={app.imageUrl || '/default-og-image.jpg'} />
        <meta property="og:url" content={`${siteUrl}/view/${app.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        
      </Head>

      <Layout>
        <AppDetails app={app} />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const ids = await fetchAllAppIds();

  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: false, // Required for static export mode
  };
}

export async function getStaticProps({ params }) {
  try {
    const docRef = doc(db, 'anime', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { notFound: true };
    }

    return {
      props: {
        initialData: {
          id: params.id,
          ...docSnap.data(),
        },
      },
      // 🚫 REMOVE THIS LINE
      // revalidate: 60,
    };
  } catch (err) {
    return { notFound: true };
  }
}


export default ViewApp;

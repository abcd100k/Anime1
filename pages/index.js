import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import RecommendSection from "@/components/RecommendSection";
import Layout from "@/layout/Layout";

// Lazy load components after initial render
const LatestApps = dynamic(() => import("@/components/limt/LatestApps"), {
  ssr: false,
  loading: () => <p>Loading latest apps...</p>,
});

const PopularApplications = dynamic(() => import("@/components/PopularApplications"), {
  ssr: false,
  loading: () => <p>Loading popular apps...</p>,
});

const Home = () => {
  return (
    <>
      <Header />
      <Layout>
        <RecommendSection />
        <LatestApps />
        <PopularApplications />
      </Layout>
    </>
  );
};

export default Home;

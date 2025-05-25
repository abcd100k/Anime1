import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import RecommendSection from "@/components/RecommendSection";
import Layout from "@/layout/Layout";

// Simple loading placeholder component
const LoadingPlaceholder = ({ text }) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-pulse text-gray-500">{text}</div>
  </div>
);

// Lazy load components with error handling
const LatestApps = dynamic(
  () => import("@/components/limt/LatestApps")
    .catch(() => ({ default: () => <div className="text-red-500 p-4">Failed to load latest apps</div> })),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder text="Loading latest apps..." />,
  }
);

const PopularApplications = dynamic(
  () => import("@/components/PopularApplications")
    .catch(() => ({ default: () => <div className="text-red-500 p-4">Failed to load popular apps</div> })),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder text="Loading popular apps..." />,
  }
);

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Layout>
          <RecommendSection />
          <div className="space-y-8 my-8">
            <LatestApps />
            <PopularApplications />
          </div>
        </Layout>
      </main>
    </div>
  );
};

export default Home;
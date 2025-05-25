import Link from "next/link";
import { useEffect } from "react";
import Head from "next/head";
import Layout from "@/layout/Layout";

const ErrorPage = ({ statusCode = 404, message = "Page Not Found" }) => {
  // Log errors to analytics (replace with your actual tracking)
  useEffect(() => {
    console.error(`Error ${statusCode}: ${message}`);
    // Example: trackError(statusCode, message);
  }, [statusCode, message]);

  return (
    <>
      <Head>
        <title>{`Error ${statusCode} | Your Site Name`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Error {statusCode}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center">
                
                  Go to Homepage
                
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Try Again
              </button>
            </div>
            
            {/* Additional Help */}
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:underline dark:text-blue-400">
                
                  Contact support
                
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ErrorPage;
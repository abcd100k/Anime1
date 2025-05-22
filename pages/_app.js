import "@/styles/globals.css";
import { Helmet } from "react-helmet";
import Layout from "@/layout/Layout";
import { AuthProvider } from "@/admin/AuthContext";

export default function App({ Component, pageProps }) {
  // if it is a protected page make it protected
  const isProtectedPage = Component.name === 'AppAddPage' || Component.name === 'AppList' || Component.name === 'AppEditPage';
  if (isProtectedPage) {
    // Render protected pages within the AuthProvider and Layout
    return (
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    );
  } else {
    // Render other pages with the layout
    return (
      <>
       
        {Component.name != 'LoginPage' && (
        
           <Component {...pageProps} />
         
        )}
       
        {Component.name == 'LoginPage' && (
           <Component {...pageProps} />
        )}
      
      
      </>
    );
  }
}

export function reportWebVitals(metric) {
  console.log(metric);
  // You can add your own logic here to report metrics to your chosen analytics provider
}









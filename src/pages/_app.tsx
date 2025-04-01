import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleOptimize from '@/components/analytics/GoogleOptimize';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics />
      <GoogleOptimize />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
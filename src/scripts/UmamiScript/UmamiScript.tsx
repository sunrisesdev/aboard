import Script from 'next/script';

const WEBSITE_IDS = {
  production: '13b8972f-5450-4cd9-a024-f81b0def6407',
  development: '',
  test: '',
};

const UmamiScript = () => {
  const websiteId = WEBSITE_IDS[process.env.NODE_ENV];

  if (!websiteId) {
    return null;
  }

  return (
    <Script
      src="/tracking/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
};

export default UmamiScript;

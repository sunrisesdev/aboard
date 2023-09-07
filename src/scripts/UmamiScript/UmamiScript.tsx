import Script from 'next/script';

const WEBSITE_IDS = {
  production: '4c8d3f9b-21a7-4dab-94c9-71004745d56b',
  development: 'abf15967-1fcd-4c24-8301-1931652f2757',
  test: 'abf15967-1fcd-4c24-8301-1931652f2757',
};

const UmamiScript = () => {
  const websiteId = WEBSITE_IDS[process.env.NODE_ENV];

  return (
    <Script
      src="/tracking/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
};

export default UmamiScript;

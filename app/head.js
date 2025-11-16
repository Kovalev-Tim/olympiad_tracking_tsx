// app/head.js
export default function Head() {
  const title = "Olympiad Tracker — Competition calendar & parser";
  const description = "Parse academic competition pages, extract dates & details, and add events to your calendar.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://trackolymp.tech/og-image.png`} />
      <meta property="og:url" content="https://trackolymp.tech" />
      <meta property="og:site_name" content="Olympiad Tracker"/>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/*<meta name="robots" content="index, follow" />
      <link rel="manifest" href="/site.webmanifest" />*/}
    </>
  );
}

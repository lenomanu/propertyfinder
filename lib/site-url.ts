const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";

  // Add HTTPS outside localhost
  url = url.startsWith("http") ? url : `https://${url}`;

  // Ensure trailing slash
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};

export { getURL };
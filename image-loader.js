export default function imageLoader({ src, width, quality }) {
  // For absolute URLs (external images)
  if (src.startsWith('http')) {
    return src;
  }
  
  // For local images
  return `/${src}`;
}

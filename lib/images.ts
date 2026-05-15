export function getPublicImageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl || path.startsWith("http")) return path;
  return `${baseUrl}/storage/v1/object/public/product-images/${path}`;
}

const decodeText = string => string
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&#39;", "'")
  .replaceAll("&quot;", '"')
  .replaceAll("&gt;", ">")

export default decodeText
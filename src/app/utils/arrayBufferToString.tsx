export default function arrayBufferToString(arrayBuffer: ArrayBuffer) {
  const decoder = new TextDecoder('utf-8');
  const arr = new Uint8Array(arrayBuffer);
  const str = decoder.decode(arr);
  return str;
}

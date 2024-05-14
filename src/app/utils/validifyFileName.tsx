export default function validifyFileName(fileName: string) {
  //  <, >, :, ", /, \ |, ?, *
  return fileName
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/:/g, '')
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/\//g, '')
    .replace(/\|/g, '')
    .replace(/\?/g, '')
    .replace(/\*/g, '');
}

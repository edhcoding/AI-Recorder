// base64 문자열을 Blob 객체로 변환하는 함수

export default function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64); // base64 문자열 디코딩 (atob <-> btoa (base64 인코딩))
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

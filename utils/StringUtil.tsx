export function LongstringHelper(str: string, n: number, useWordBoundary: boolean ){
  if (str.length <= n) { return str; }
  const subString = str.slice(0, n-1); // the original check
  return (useWordBoundary 
    ? subString.slice(0, subString.lastIndexOf(" ")) 
    : subString) + "...";
};

export function base64ToArrayBuffer(data: string): Uint8Array {
  let binaryString = atob(data);
  let bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
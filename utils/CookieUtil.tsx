type HotsauceTk = {
  name: string
  value: string
}
export const getHotsauceTk = (cookieName: string) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, rawValue] = cookie.trim().split('=');
    if (name === cookieName) {
      const decodedValue = decodeURIComponent(rawValue);
      try {
        // Attempt to parse the cookie value as JSON
        const tk: HotsauceTk = JSON.parse(decodedValue);
        return tk.value;
      } catch (error) {
        // If parsing fails, return the raw string value
        return decodedValue;
      }
    }
  }
  return null; // Return null if the cookie is not found
};
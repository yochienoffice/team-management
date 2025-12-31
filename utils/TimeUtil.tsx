export const getLocalTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getLocalDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getLocalDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric", // Use 24-hour format
    month: "2-digit",
    day: "2-digit",
  });
};

export function timeStringToDate(timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
}

export const formatTime = (timeString: string) => {
  if (timeString) {
    const match = timeString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

    if (match) {
      const hour = match[1];
      const minute = match[2];
      return `${hour}:${minute}`;
    } else {
      return timeString;
    }
  } else {
    return "";
  }
};

export const parseDate = (date: string): Date => {
  const splitString = date.split("-");
  return new Date(
    Number(splitString[0]),
    Number(splitString[1]) - 1,
    Number(splitString[2])
  );
};

export const getFormattedDate = (date: Date, format: string) => {
  let mm = (date.getMonth() + 1).toString().padStart(2, "0");
  let dd = date.getDate().toString().padStart(2, "0");
  let yyyy = date.getFullYear();

  if (format === "yyyy-mm-dd") {
    return `${yyyy}-${mm}-${dd}`;
  }
  
  return `${mm}/${dd}/${yyyy}`;
};

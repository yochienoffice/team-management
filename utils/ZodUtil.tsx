export const isURLValid = (url: string) => {
  try {
    let tempUrl = url;
    if (!url.startsWith("https://")) {
      tempUrl = "https://" + url;
    }
    const urlList = tempUrl.split("https://");

    if (url.includes("///") || (urlList[1] && urlList[1].includes("//"))) {
      return false;
    }
    const givenUrl = new URL(tempUrl);
    let fixedUrl = "";

    //Check protocol
    if (givenUrl.protocol !== "http:" && givenUrl.protocol !== "https:") {
      fixedUrl = fixedUrl.concat("https://");
    } else {
      fixedUrl = fixedUrl.concat(givenUrl.protocol).concat("//");
    }

    // Check top-domain
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;
    const matches = givenUrl.hostname.match(domainRegex);
    if (!matches) {
      return false;
    } else if (!matches[1].split(".").includes("com")) {
      return false;
    }
    fixedUrl = fixedUrl.concat(givenUrl.hostname);

    // Add Pathname
    fixedUrl = fixedUrl.concat(givenUrl.pathname);

    return true;
  } catch (error) {
    return false;
  }
};

export const phoneNumberRegex = /^[\d\(\)\-]{0,20}$/;

export const loginPinRegex = /^\d{4}$/;

export const zipCodeRegex = /^[\d\(\)\-]{0,5}$/;

export const selectionValid = (minSelections: string, maxSelections: string) => {
  if(maxSelections != "") {
    return Number(maxSelections) >= Number(minSelections);
  } else {
    return true;
  }
};

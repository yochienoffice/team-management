import { PUBLIC_SERVER } from "@/utils/Config";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  DELETE = "DELETE",
  PUT = "PUT",
}

export const BasicHeader = {
  "Content-Type": "application/json",
};

export const getAuthorizedHeader = (token: string) => {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
};

export async function noAuthPOST(
  endpoint: string,
  body: Record<string, any> = {}
): Promise<AuthenticationResponse> {
  try {
    const data = JSON.stringify(body);
    const options: RequestInit = {
      method: HttpMethod.POST,
      headers: {
        ...BasicHeader,
      },
      body: data,
    };

    const res = await fetch(PUBLIC_SERVER + endpoint, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response: AuthenticationResponse = await res.json();

    return response;
  } catch (error) {
    throw new Error("Failed to fetch: " + error);
  }
}

export const createAPICall = async (
  endpoint: string,
  httpMethod: HttpMethod,
  token: string,
  body = {}
) => {
  try {
    const data = JSON.stringify(body);
    console.info("API call: " + endpoint);
    let options = {};
    if (httpMethod === HttpMethod.GET) {
      options = {
        method: httpMethod,
        maxBodyLength: Infinity,
        headers: getAuthorizedHeader(token),
      };
    } else {
      options = {
        method: httpMethod,
        maxBodyLength: Infinity,
        headers: getAuthorizedHeader(token),
        body: data,
      };
    }

    return await fetch(PUBLIC_SERVER + endpoint, options).then((res) => {
      return res.json();
    });
  } catch (error) {
    let errorMessage = "";
    if (typeof error === "string") {
      errorMessage = error.toUpperCase(); // works, `e` narrowed to string
    } else if (error instanceof Error) {
      errorMessage = error.message; // works, `e` narrowed to Error
    }

    console.error("API Error:", errorMessage);
    throw null;
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import customFetch from "./config";
import { useRuntimeConfig } from "#app";

// Get API URLs from runtime config if available
function getUrls() {
  try {
    const config = useRuntimeConfig();
    return {
      SERVER_URL:
        config.public.apiBase ||
        (process.dev ? "/api" : "https://server.pptist.cn"),
      ASSET_URL: config.public.assetUrl || "https://asset.pptist.cn",
    };
  } catch (e) {
    // Fallback to old method if runtime config is not available
    return {
      SERVER_URL: process.dev ? "/api" : "https://server.pptist.cn",
      ASSET_URL: "https://asset.pptist.cn",
    };
  }
}

const { SERVER_URL, ASSET_URL } = getUrls();

export { SERVER_URL, ASSET_URL };

export default {
  getMockData(filename: string): Promise<any> {
    return customFetch(`./mocks/${filename}.json`);
  },

  getFileData(filename: string): Promise<any> {
    return customFetch(`${ASSET_URL}/data/${filename}.json`);
  },

  AIPPT_Outline(
    content: string,
    language: string,
    model: string,
  ): Promise<any> {
    return fetch(`${SERVER_URL}/tools/aippt_outline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language,
        model,
        stream: true,
      }),
    });
  },

  AIPPT(content: string, language: string, model: string): Promise<any> {
    return fetch(`${SERVER_URL}/tools/aippt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language,
        model,
        stream: true,
      }),
    });
  },
};

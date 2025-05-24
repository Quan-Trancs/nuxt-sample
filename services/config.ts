import { $fetch, FetchError } from "ofetch";
import message from "@/utils/message";

// Create default fetch options that will be applied to all requests
const defaultFetchOptions = {
  timeout: 1000 * 300, // 300 seconds timeout to match axios config
  retry: 0, // No retries by default
  onRequest({ options }) {
    // You can modify request options here if needed
    return options;
  },
  onRequestError({ error }) {
    // Handle request errors
    message.error("Request error: " + error.message);
    return Promise.reject(error);
  },
  onResponse({ response }) {
    // Process successful responses
    return response._data;
  },
  onResponseError({ response, error }) {
    // Handle response errors
    if (response?.status) {
      if (response.status >= 400 && response.status < 500) {
        message.error(error.message || "Client error");
        return Promise.reject(error.message);
      } else if (response.status >= 500) {
        message.error(error.message || "Server error");
        return Promise.reject(error.message);
      }
    }

    message.error("服务器遇到未知错误！");
    return Promise.reject(error);
  },
};

/**
 * Custom fetch wrapper with error handling
 * Mimics the behavior of the previous axios instance
 */
const customFetch = async (url: string, options = {}) => {
  try {
    return await $fetch(url, {
      ...defaultFetchOptions,
      ...options,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      // FetchError is handled by the onResponseError handler
      throw error;
    }

    // Network errors or timeouts
    message.error("连接到服务器失败 或 服务器响应超时！");
    throw error;
  }
};

export default customFetch;

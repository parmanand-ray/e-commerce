"use client";

import axios from "axios";
import { useState, useMemo, useEffect } from "react";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setReFreshIndex] = useState(0);

  const optionsString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts = { ...options };

    if (method === "POST" && !opts.data) {
      opts.data = {};
    }

    return opts;
  }, [method, optionsString]);

  useEffect(() => {
    if (!url) return; // ✅ IMPORTANT: prevent invalid calls

    const apiCall = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });

        if (!response?.success) {
          throw new Error(response?.message || "Request failed");
        }

        setData(response);
      } catch (err) {
        setData(null);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    apiCall();
  }, [url, refreshIndex, requestOptions, method]);

  const refetch = () => setReFreshIndex((prev) => prev + 1);

  return { data, loading, error, refetch };
};

export default useFetch;

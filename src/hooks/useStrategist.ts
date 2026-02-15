"use client";

import { useState, useEffect } from "react";
import { ApiOption, StrategistResponse } from "@/types";
import { fetchOptions, submitStrategistRequest } from "@/services/api";

export function useStrategist() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [option, setOption] = useState("");
  const [parameterValue, setParameterValue] = useState("");
  const [options, setOptions] = useState<ApiOption[]>([]);
  const [response, setResponse] = useState<StrategistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOptions()
      .then((opts) => {
        setOptions(opts);
        if (opts.length > 0) setOption(opts[0].id);
      })
      .catch((err) => setError(err.message));
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const result = await submitStrategistRequest(
        file,
        prompt,
        option,
        parameterValue
      );
      setResponse(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return {
    file,
    setFile,
    prompt,
    setPrompt,
    option,
    setOption,
    parameterValue,
    setParameterValue,
    options,
    response,
    loading,
    error,
    handleSubmit,
  };
}

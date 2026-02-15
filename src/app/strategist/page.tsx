"use client";

import { useStrategist } from "@/hooks/useStrategist";
import FileUpload from "@/components/FileUpload";
import PromptInput from "@/components/PromptInput";
import OptionDropdown from "@/components/OptionDropdown";
import ParameterInput from "@/components/ParameterInput";
import SubmitButton from "@/components/SubmitButton";
import ResponseDisplay from "@/components/ResponseDisplay";

export default function StrategistPage() {
  const {
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
  } = useStrategist();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Strategist</h1>

      <div className="space-y-5">
        <FileUpload file={file} onFileChange={setFile} />
        <PromptInput value={prompt} onChange={setPrompt} />
        <OptionDropdown options={options} selected={option} onChange={setOption} />
        <ParameterInput value={parameterValue} onChange={setParameterValue} />
        <SubmitButton onClick={handleSubmit} loading={loading} />
      </div>

      <ResponseDisplay response={response} loading={loading} error={error} />
    </div>
  );
}

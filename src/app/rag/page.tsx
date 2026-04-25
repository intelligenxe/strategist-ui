"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRag } from "@/hooks/useRag";
import FileUpload from "@/components/FileUpload";
import UrlIngestion from "@/components/UrlIngestion";
import PromptInput from "@/components/PromptInput";
import OptionDropdown from "@/components/OptionDropdown";
import ParameterInput from "@/components/ParameterInput";
import SubmitButton from "@/components/SubmitButton";
import ResponseDisplay from "@/components/ResponseDisplay";
import StatsPanel from "@/components/StatsPanel";

export default function RagPage() {
  const {
    file,
    setFile,
    extractionMethod,
    setExtractionMethod,
    extractionOptions,
    uploading,
    uploadMessage,
    uploadError,
    handleUpload,
    urls,
    setUrls,
    sourceType,
    setSourceType,
    sourceTypeOptions,
    ingesting,
    ingestResult,
    ingestError,
    handleIngestUrls,
    stats,
    statsLoading,
    handleDeleteDocument,
    handleClearKnowledgeBase,
    question,
    setQuestion,
    topK,
    setTopK,
    queryResponse,
    querying,
    queryError,
    handleQuery,
  } = useRag();

  const [dataSource, setDataSource] = useState<"upload" | "urls">("upload");

  const searchParams = useSearchParams();
  const returnWorkflow = searchParams.get("return") ?? "swot";
  const backHref = `/workflows/${returnWorkflow}`;

  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        ← Back to Strategist
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">RAG</h1>

      {/* Document Management */}
      <section className="mb-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Knowledge</h2>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setDataSource("upload")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              dataSource === "upload"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setDataSource("urls")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              dataSource === "urls"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ingest URLs
          </button>
        </div>

        {/* Tab Content */}
        {dataSource === "upload" ? (
          <div className="space-y-4">
            <FileUpload file={file} onFileChange={setFile} />
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <OptionDropdown
                  options={extractionOptions}
                  selected={extractionMethod}
                  onChange={setExtractionMethod}
                  label="Extraction Method"
                />
              </div>
              <SubmitButton
                onClick={handleUpload}
                loading={uploading}
                disabled={!file}
                label="Upload"
                loadingLabel="Uploading..."
              />
            </div>
            {uploadMessage && (
              <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                <p className="text-sm text-green-700">{uploadMessage}</p>
              </div>
            )}
            {uploadError && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            )}
          </div>
        ) : (
          <UrlIngestion
            urls={urls}
            onUrlsChange={setUrls}
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
            sourceTypeOptions={sourceTypeOptions}
            onSubmit={handleIngestUrls}
            ingesting={ingesting}
            ingestResult={ingestResult}
            ingestError={ingestError}
          />
        )}
      </section>

      {/* Knowledge Base Stats */}
      <section className="mb-8">
        <StatsPanel
          stats={stats}
          loading={statsLoading}
          onDelete={handleDeleteDocument}
          onClear={handleClearKnowledgeBase}
        />
      </section>

      {/* Query */}
      <section className="rounded-lg bg-gray-50 p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Query Knowledge Base</h2>
        <div className="space-y-4">
          <PromptInput
            value={question}
            onChange={setQuestion}
            label="Question"
            placeholder="Ask a question about your documents..."
          />
          <ParameterInput value={topK} onChange={setTopK} label="Top K" />
          <SubmitButton
            onClick={handleQuery}
            loading={querying}
            disabled={!question.trim()}
            label="Query"
            loadingLabel="Querying..."
          />
        </div>
        <ResponseDisplay response={queryResponse} loading={querying} error={queryError} />
      </section>

      <div className="mt-8">
        <Link
          href={backHref}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Strategist
        </Link>
      </div>
    </div>
  );
}

import { StrategistResponse } from "@/types";

interface ResponseDisplayProps {
  response: StrategistResponse | null;
  loading: boolean;
  error: string | null;
}

export default function ResponseDisplay({
  response,
  loading,
  error,
}: ResponseDisplayProps) {
  if (loading) {
    return (
      <div className="mt-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-lg bg-red-50 p-6 border border-red-200">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="mt-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Response</h2>
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {response.content}
      </div>
    </div>
  );
}

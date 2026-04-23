import { QueryResponse } from "@/types";

interface ResponseDisplayProps {
  response: QueryResponse | null;
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
      <div className="mt-6">
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
      <div className="mt-6 rounded-lg bg-red-50 p-3 border border-red-200">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Response</h2>
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {response.answer}
      </div>
      {response.sources && response.sources.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Sources</h3>
          <ul className="space-y-2">
            {response.sources.map((source, i) => (
              <li key={i} className="text-xs text-gray-600 rounded bg-white p-3 border border-gray-100">
                <span className="font-medium text-gray-700">{source.document}</span>
                {source.score != null && (
                  <span className="ml-2 text-gray-400">score: {source.score.toFixed(3)}</span>
                )}
                <p className="mt-1 whitespace-pre-wrap">{source.chunk}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

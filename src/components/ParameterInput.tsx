interface ParameterInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ParameterInput({
  value,
  onChange,
  label = "Parameter",
}: ParameterInputProps) {
  return (
    <div>
      <label
        htmlFor="parameter"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id="parameter"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );
}

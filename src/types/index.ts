export interface StrategistRequest {
  file: File | null;
  prompt: string;
  option: string;
  parameterValue: string;
}

export interface StrategistResponse {
  content: string;
}

export interface ApiOption {
  id: string;
  label: string;
}

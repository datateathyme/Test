
export interface ImageHistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface GenerationState {
  status: AppStatus;
  message: string;
}

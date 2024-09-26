export interface Todo {
  id: number;
  content: string;
  completed: boolean;
}

export interface ClientTodo extends Todo {
  isNew?: boolean;
}

export interface LoginResponse {
  access_token: string;
}

export interface QueryOptions {
  params?: Record<string, string | number | boolean | undefined>;
  enabled?: boolean;
}

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}
const API_BASE = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : (null as T);
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    request<{ user: { id: number; username: string }; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  register: (username: string, password: string) =>
    request<{ user: { id: number; username: string }; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: { username, password },
    }),

  getProfile: (token: string) =>
    request<{ id: number; username: string }>('/auth/profile', { token }),
};

// Computer types
export interface ComputerFile {
  id: string;
  name: string;
  type: 'text' | 'image' | 'link' | 'note';
  content: string;
  icon: string | null;
  isHidden: boolean;
  positionX: number;
  positionY: number;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComputerFolder {
  id: string;
  name: string;
  icon: string | null;
  isHidden: boolean;
  positionX: number;
  positionY: number;
  parentId: string | null;
  files: ComputerFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Computer {
  id: string;
  name: string;
  description: string | null;
  isPublished: boolean;
  visitCount: number;
  files: ComputerFile[];
  folders: ComputerFolder[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ComputerStats {
  id: string;
  name: string;
  isPublished: boolean;
  visitCount: number;
  fileCount: number;
  folderCount: number;
  createdAt: string;
  publishedAt: string | null;
}

// Computers API
export const computersApi = {
  // Public (anonymous) endpoints
  discover: () => request<Computer | null>('/computers/discover'),

  explore: (id: string) => request<Computer>(`/computers/explore/${id}`),

  // Protected (owner) endpoints
  create: (token: string, data: { name?: string; description?: string }) =>
    request<Computer>('/computers', { method: 'POST', body: data, token }),

  getMine: (token: string) => request<Computer[]>('/computers/mine', { token }),

  getMyComputer: (token: string, id: string) =>
    request<Computer>(`/computers/mine/${id}`, { token }),

  getStats: (token: string, id: string) =>
    request<ComputerStats>(`/computers/mine/${id}/stats`, { token }),

  update: (token: string, id: string, data: { name?: string; description?: string }) =>
    request<Computer>(`/computers/mine/${id}`, { method: 'PUT', body: data, token }),

  publish: (token: string, id: string) =>
    request<Computer>(`/computers/mine/${id}/publish`, { method: 'POST', token }),

  unpublish: (token: string, id: string) =>
    request<Computer>(`/computers/mine/${id}/unpublish`, { method: 'POST', token }),

  delete: (token: string, id: string) =>
    request<void>(`/computers/mine/${id}`, { method: 'DELETE', token }),
};

// Files API
export const filesApi = {
  create: (
    token: string,
    computerId: string,
    data: {
      name: string;
      type: string;
      content: string;
      folderId?: string;
      icon?: string;
      isHidden?: boolean;
      positionX?: number;
      positionY?: number;
    },
  ) =>
    request<ComputerFile>(`/computers/${computerId}/files`, {
      method: 'POST',
      body: data,
      token,
    }),

  update: (
    token: string,
    computerId: string,
    fileId: string,
    data: Partial<{
      name: string;
      type: string;
      content: string;
      folderId: string | null;
      icon: string;
      isHidden: boolean;
      positionX: number;
      positionY: number;
    }>,
  ) =>
    request<ComputerFile>(`/computers/${computerId}/files/${fileId}`, {
      method: 'PUT',
      body: data,
      token,
    }),

  delete: (token: string, computerId: string, fileId: string) =>
    request<void>(`/computers/${computerId}/files/${fileId}`, {
      method: 'DELETE',
      token,
    }),
};

export { ApiError };

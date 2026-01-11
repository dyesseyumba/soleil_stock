import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const axiosClient: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:4000/api',
  baseURL: 'https://soleil-stock-backend.railway.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Flush queued requests
 */
function processQueue(error: unknown, token?: string) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Setup interceptors ONCE
 */
function setupInterceptors(client: AxiosInstance) {
  // REQUEST interceptor
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });

  // RESPONSE interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.set('Authorization', `Bearer ${token}`);
                resolve(client(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await client.post<{ accessToken: string }>('/auth/refresh');

          localStorage.setItem('accessToken', data.accessToken);

          processQueue(null, data.accessToken);

          originalRequest.headers.set('Authorization', `Bearer ${data.accessToken}`);

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          localStorage.removeItem('accessToken');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
}

// Explicit init
setupInterceptors(axiosClient);

export { axiosClient };

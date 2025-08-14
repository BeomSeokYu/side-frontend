import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET 요청 메서드
export const httpGet = async (url, params = {}, config = {}) => {
  const response = await instance.get(url, {
    ...config,
    params: params,
  });
  return response.data;
};

// POST 요청 메서드
export const httpPost = async (url, data = {}, config = {}) => {
  const response = await instance.post(url, data, config);
  return response.data;
};

// PUT 요청 메서드
export const httpPut = async (url, data = {}, config = {}) => {
  const response = await instance.put(url, data, config);
  return response.data;
};

// DELETE 요청 메서드
export const httpDelete = async (url, config = {}) => {
  const response = await instance.delete(url, config);
  return response.data;
};

// PATCH 요청 메서드
export const httpPatch = async (url, data = {}, config = {}) => {
  const response = await instance.patch(url, data, config);
  return response.data;
};

// Axios 전역 에러 핸들러 설정
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error: ', error);

    // 이곳에서 에러를 로깅하거나 사용자에게 오류 메시지를 표시할 수 있습니다.

    // 에러를 다시 던져서 개별 요청에서 처리하도록 할 수도 있습니다.
    // return Promise.reject(error);
  }
);

export default instance;
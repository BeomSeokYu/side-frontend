# 1단계: Vue 빌드
FROM node:23 AS build

# 빌드 타임 변수 설정
ARG API_BASE_URL

# ENV 설정 (RUN, CMD 단계에서도 사용 가능)
ENV VUE_APP_API_BASE_URL=${API_BASE_URL}


WORKDIR /app

# package.json과 package-lock.json만 먼저 복사하여 캐싱 최적화
COPY package.json package-lock.json ./
RUN npm install

# 전체 프로젝트 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: Nginx를 사용하여 배포
FROM nginx:alpine

# Vue 앱 빌드 결과물을 Nginx에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 기본 설정 유지 (필요시 커스텀 가능)
EXPOSE 8090
CMD ["nginx", "-g", "daemon off;"]
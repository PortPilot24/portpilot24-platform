# 1) Build stage -----------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite 환경변수는 VITE_ 접두사 필요 (예: ARG VITE_API_BASE_URL)
# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# 2) Run stage (Nginx) ----------------------------------------------
FROM nginx:alpine
# 커스텀 nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Vite 빌드 산출물 복사
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
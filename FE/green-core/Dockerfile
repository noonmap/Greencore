# 베이스 이미지 설정
FROM node:18.12.1 as build

# 작업 폴더 설정
WORKDIR /FE/green-core 

# 앱 종속성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 추가
COPY . .

# Next.js 앱 빌드
RUN npm run build

# Nginx 이미지를 베이스 이미지로 설정
FROM nginx:latest

# Nginx 설정 추가
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 앱 추가
COPY --from=build /FE/green-core/out /usr/share/nginx/html

# 80번 포트 열기
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
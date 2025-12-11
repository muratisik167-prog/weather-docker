FROM nginx:alpine
# Mevcut klasördeki (HTML, CSS, JS) her şeyi Nginx'in yayın klasörüne at
COPY . /usr/share/nginx/html
# 80 portunu dışarı aç
EXPOSE 80

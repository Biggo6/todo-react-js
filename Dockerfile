FROM nginx

COPY ./build /usr/share/nginx/html

EXPOSE 9999:80


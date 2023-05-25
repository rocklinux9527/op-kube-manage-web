#FROM node:12.22.12 as builder
#COPY .  /opt/op-kube-manage-ui

#WORKDIR /opt/op-kube-manage-ui
#RUN set -x \
#    && npm   install \
#    && npm run build:prod
FROM nginx:latest
RUN mkdir /opt/app/op-kube-manage-ui -p && chmod 644 -R /opt/app/op-kube-manage-ui
COPY conf/nginx.conf /etc/nginx/nginx.conf 
COPY conf/ops-api.conf /etc/nginx/conf.d/default.conf 
COPY dist /opt/app/op-kube-manage-ui/dist
EXPOSE 80


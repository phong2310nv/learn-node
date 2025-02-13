FROM nginx:latest
ARG APP_DOMAIN=localhost
ARG NODE_ENV=development
ENV CERT_DIR=/etc/nginx/certs \
    CONFIG_DIR=/etc/nginx/conf.d \
    TEMPLATE_DIR=/etc/nginx/templates \ 
    NODE_ENV=${NODE_ENV}

RUN mkdir -p $CERT_DIR

RUN mkdir ${TEMPLATE_DIR}

RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout $CERT_DIR/self-signed.key \
    -out $CERT_DIR/self-signed.crt \
    -subj "/C=US/ST=State/L=City/O=Company/OU=Org/CN=${APP_DOMAIN}"

COPY default.conf.template.dev ${TEMPLATE_DIR}/default.conf.template.dev
COPY default.conf.template.prod ${TEMPLATE_DIR}/default.conf.template.prod
# Conditional logic to select the correct config
RUN if [ "$NODE_ENV" = "development" ]; then \
      cp /etc/nginx/templates/default.conf.template.dev /etc/nginx/templates/default.conf.template; \
    else \
      cp /etc/nginx/templates/default.conf.template.prod /etc/nginx/templates/default.conf.template; \
    fi


EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
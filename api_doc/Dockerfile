FROM swaggerapi/swagger-ui:v3.4.5

RUN mkdir -p /docs
WORKDIR /docs

COPY all.api.json ./
ENV SWAGGER_JSON /docs/all.api.json
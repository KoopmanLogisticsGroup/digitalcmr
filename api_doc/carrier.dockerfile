FROM swaggerapi/swagger-ui:v3.4.5

RUN mkdir -p /docs
WORKDIR /docs

COPY carrier.api.json ./
ENV SWAGGER_JSON /docs/carrier.api.json
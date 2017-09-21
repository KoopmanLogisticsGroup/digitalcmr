FROM swaggerapi/swagger-ui

RUN mkdir -p /docs
WORKDIR /docs

COPY digital-cmr.api.json ./
ENV SWAGGER_JSON /docs/digital-cmr.api.json
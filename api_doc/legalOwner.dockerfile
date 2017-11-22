FROM swaggerapi/swagger-ui

RUN mkdir -p /docs
WORKDIR /docs

COPY legalOwner.api.json ./
ENV SWAGGER_JSON /docs/legalOwner.api.json
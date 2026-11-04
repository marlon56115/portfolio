# syntax=docker/dockerfile:1.10
# Imagen final: un binario estático de Go con el sitio embebido, sobre distroless (sin shell ni paquetes).
# Imágenes base fijadas por digest.

FROM node:24.11.1-alpine3.22@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43 AS site
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src
ARG BUILD_VERSION=dev
ARG BUILD_COMMIT=0000000
ENV BUILD_VERSION=${BUILD_VERSION} BUILD_COMMIT=${BUILD_COMMIT}
RUN npm run build

FROM golang:1.27.3-alpine@sha256:d200d2dd76b03a99b52651fd1325aff7dcd35422c35c01bac56571b0507f3deb AS server
WORKDIR /src
COPY server/go.mod ./
COPY server/*.go ./
COPY --from=site /app/dist ./public
RUN go vet ./... && go test -count=1 ./... \
 && CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w -buildid=" -o /out/portfolio .

FROM gcr.io/distroless/static-debian12:nonroot@sha256:afa5c872c891853ca7fcf1f12c3edb23f7eeef36189728842dd51042ff57f7ab
LABEL org.opencontainers.image.source="https://github.com/marlon56115/portfolio" \
      org.opencontainers.image.description="Portafolio de Marlon Guerra: sitio estático + servidor Go" \
      org.opencontainers.image.licenses="MIT"
COPY --from=server /out/portfolio /portfolio
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/portfolio"]

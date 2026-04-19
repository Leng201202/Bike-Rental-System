FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV API_UPSTREAM=backend:8080
ENV API_UPSTREAM_SCHEME=http

EXPOSE 80

CMD ["/bin/sh", "-c", "set -eu; if printf '%s' \"${API_UPSTREAM}\" | grep -Eq '^https?://'; then API_UPSTREAM_SCHEME=$(printf '%s' \"${API_UPSTREAM}\" | sed -E 's#^(https?)://.*#\\1#'); API_UPSTREAM=$(printf '%s' \"${API_UPSTREAM}\" | sed -E 's#^https?://##' | sed -E 's#/.*$##'); fi; if printf '%s' \"${API_UPSTREAM_SCHEME}\" | grep -q '\\.'; then TMP_SCHEME=\"${API_UPSTREAM_SCHEME}\"; API_UPSTREAM_SCHEME=\"${API_UPSTREAM}\"; API_UPSTREAM=\"${TMP_SCHEME}\"; fi; if [ \"${API_UPSTREAM_SCHEME}\" != \"http\" ] && [ \"${API_UPSTREAM_SCHEME}\" != \"https\" ]; then API_UPSTREAM_SCHEME=http; fi; API_UPSTREAM=$(printf '%s' \"${API_UPSTREAM}\" | sed -E 's#^https?://##' | sed -E 's#/.*$##'); envsubst '${API_UPSTREAM} ${API_UPSTREAM_SCHEME}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

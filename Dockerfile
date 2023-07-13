FROM node:18-alpine AS base
WORKDIR /project
COPY . .
RUN npm ci

FROM base AS test
CMD [ "npx", "jest", "--coverage" ]

FROM base AS build
RUN npm run build

# ?As this is not an application, we don't need to use `CMD` or `ENTRYPOINT`
# ?Also, we don't need to `expose` any `port`
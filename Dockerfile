FROM node:18.12.1-alpine
WORKDIR /var/www
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . /var/www/
RUN pnpm run build
RUN pnpm prune --prod

EXPOSE 80
CMD ["pnpm", "run", "start:prod"]


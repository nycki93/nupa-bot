FROM docker.io/library/node:20
WORKDIR /usr/src/app
COPY package*.json tsconfig.json .
COPY source ./source
RUN npm ci --omit=dev && npm run build
CMD ["node", "build/main.js", "console"]



FROM node:latest
RUN mkdir -p /raji/service
COPY . /raji/service
WORKDIR /raji/service
RUN npm install
ENV PORT 8080
ENV MASTER_KEY xxxxxx
ENV JWT_SECRET xxxxxx
ENV IP 0.0.0.0
ENV SENDGRID_KEY xxxxxx
ENV MONGODB_URI xxxxxx
EXPOSE 8080
CMD ["npm", "start"]

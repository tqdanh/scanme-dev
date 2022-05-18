FROM common-docker.artifactory.kasikornbank.com:8443/rhscl/nodejs-8-rhel7:1-22
WORKDIR /opt/app-root
COPY ./package.json   .
COPY ./dist/bl-common   ./dist
ARG  BUILD_TIME
RUN  echo $BUILD_TIME > imagebuildtime.txt
CMD [ "npm", "run", "server" ]

FROM ubuntu

SHELL ["/bin/bash", "-c"]

# Install important dependencies
RUN apt-get update -y
RUN apt-get install -y build-essential
RUN apt-get install -y libtool
RUN apt-get install -y python3
RUN apt-get install -y ffmpeg
RUN apt-get install -y curl
# Install Node using NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" \
    && nvm install v19.1.0 \
    && nvm alias default v19.1.0 \
    && nvm use default \
    && ln -s "$(which node)" /usr/bin/node \
    && ln -s "$(which npm)" /usr/bin/npm

# Change working directory
WORKDIR /app

COPY package.json .

# # download for private repo, probably you're behind firewall
# RUN curl -k -o node-v19.0.0-headers.tar.gz -L https://nodejs.org/download/release/v19.0.0/node-v19.0.0-headers.tar.gz

# # capture the absolute path
# RUN TARBALL_PATH=$(pwd) \
#     && npm config set tarball ${TARBALL_PATH}/node-v19.0.0-headers.tar.gz

# Install application dependencies
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

EXPOSE 8888

# Run the command after the container starts
CMD [ "npm", "run", "start:watch" ]

FROM ubuntu

SHELL ["/bin/bash", "-c"]

# Install important dependencies
RUN apt-get update -y
RUN apt-get autoclean
RUN apt-get autoremove 
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

ARG STEP1=true
COPY package.json .

# Install application dependencies
ARG STEP2=true
RUN npm install

# Copy all files from the current directory to the working directory
ARG STEP3=true
COPY . .

EXPOSE 8888

# Run the command after the container starts
CMD [ "npm", "run", "start:watch" ]

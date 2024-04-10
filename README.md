# VeiGo Assistant

Veigo Assistant is a Discord bot primarily designed for playing music.

## How to Start

To get started with VeiGo Assistant, follow these steps:

1. **Install Docker Desktop:** Docker Desktop provides an easy way to manage and deploy containerized applications. You can download and install it from [here](https://www.docker.com/products/docker-desktop).

2. **Set Up a Discord Bot Application:**
   Follow the Discord Guide for Setting up a bot application. This guide will walk you through creating a bot application on Discord and obtaining the necessary credentials. You can find the guide [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).

3. **Create a `.env` File:**
   After obtaining your Discord bot's `APPLICATION_ID` and `CLIENT_TOKEN`, create a `.env` file in the root directory of your project. This file should contain the following keys:
   - `APPLICATION_ID`
   - `CLIENT_TOKEN`

4. **Run the Docker Compose Command:**
   Once you have Docker Desktop installed and your Discord bot credentials set up, you can launch VeiGo Assistant using Docker Compose. Open your terminal, navigate to the project directory, and run the following command:
   ```bash
   docker-compose --env-file docker-compose.env up

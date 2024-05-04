##   Fast & Simple Discord Bot Template (Typescript)

This repository provides a template for building a lightweight and efficient Discord bot using a custom Discord library written entirely in Typescript. 

**Features:**

* **Blazing Fast:** Leverages Typescript for static typing and improved performance.
* **Simple & Easy:** Provides a clean and concise codebase for quick development.
* **Custom Discord Library:** Built-in library handles Discord interactions efficiently. 

**Getting Started:**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/confh/DiscordApi-Wrapper-Template.git
   ```

2. **Install Dependencies:**

   ```bash
   cd DiscordApi-Wrapper-Template
   npm install # or yarn install
   ```

3. **Configure Your Bot:**

   * Edit `.env` to configure your bot token.
   * Replace `<your-bot-token>` with your actual Discord bot token.

4. **Run the Bot:**

   ```bash
   npm run start # or yarn run start
   ```

This will start the botr.

**Using the Template:**

This template provides a basic structure for your bot. 

*  **`src` Folder:** Contains the source code for your bot logic.
   *  **`commands` Folder:** Place your custom commands here. Each command should be a separate file extending the `Command` class.
   *  **`events` Folder:** Place your event listeners here. Each event listener should be a separate file handling the specific Discord event.
   *  **`index.ts`:** Entry point for the bot, initializes the bot and starts it.
*  **`package.json`:** Defines dependencies and scripts for running the bot.

**Next Steps:**

* Customize the code to implement your desired bot functionalities.
* Add commands & event listeners based on your needs.
* Refer to the Discord API documentation for available events and interactions: [https://discord.com/developers/docs/reference](https://discord.com/developers/docs/reference)

**Happy Bot Building!** 
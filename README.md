# Arithmetica-Bot
[![NullDev/DiscordJS-Template](https://img.shields.io/badge/Template%3A-NullDev%2FDiscordJS--Template-green?style=flat-square&logo=github)](https://github.com/NullDev/DiscordJS-Template) [![cd](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/cd.yml/badge.svg)](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/cd.yml) [![ESLint](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/eslint.yml/badge.svg)](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/eslint.yml) [![License](https://img.shields.io/github/license/NullDev/Arithmetica-Bot?label=License&logo=Creative%20Commons)](https://github.com/NullDev/Arithmetica-Bot/blob/master/LICENSE) [![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/NullDev/Arithmetica-Bot?logo=Cachet)](https://github.com/NullDev/Arithmetica-Bot/issues?q=is%3Aissue+is%3Aclosed)

<p align="center"><img height="250" width="auto" src="https://arithmetica.xyz/img/img.png" /></p>
<p align="center"><b>Discord Bot for counting. Allows arithmetic expressions.<br>https://arithmetica.xyz/</b></p>
<hr>

## :question: What does it do?

Your average counting bot. Except you can count with arithmetic expressions!

Wiki: https://arithmetica.xyz/wiki

<hr>

## :satellite: Invite the bot

[![Invite](https://img.shields.io/badge/Invite-37a779?style=for-the-badge)](https://discordapp.com/oauth2/authorize?client_id=1108279646165942363&scope=bot&permissions=1100048526544)

<sub>The link above will invite a bot hosted by me that uses the latest version of this repo. <br>
Alternatively you can host the bot yourself. Instructions [below ⏬](#wrench-setup) </sub>

<hr>

## :star: Features

- [x] Set a counting channel via slash commands
- [x] Count normally (`1, 2, 3, 4`)
- [x] Count with arithmetic expressions (`5^0, sqrt(4), i^2+4, log(10000, 10)`)
- [x] Slash commands
- [x] Arithmetic is toggleable
- [x] Toggleable Math-Only mode (counting only using arithmetic expressions)
- [x] Cooldown for new server members
- [x] Timeout for losers
- [x] Timeout increment factor for every fail
- [x] Timed role for losers 
- [x] Cheat-Mode (no losing)
- [x] `/help` command to get a list of all commands and useful information
- [x] `/stats` command for personal stats or the stats of another user
- [x] `/global-stats` command to see how other servers are doing (filter by current and all time best)
- [x] `/best` command to see the best count of the server so far
- [x] `/top` command for a leaderboard, sortable by counts or fails
- [x] `/calc` command to calculate arithmetic expressions (and see if they are a valid count)
- [x] `/info` command to get information about the bot and an invite link
- [x] `/math-facts` command to get a random math fact
- [x] `/oeis` command to look up a sequence on the [OEIS](https://oeis.org/)
- [x] LaTeX Rendering engine `/tex`
- [x] Wolfram Alpha integration `/ask`
- [x] Code execution engine using `/run`
- [x] Multi-language support (Can be set on every Discord server individually)
    - English (Peer reviewed ✅)
    - German (Peer reviewed ✅)
    - French (Peer reviewed ✅)
    - Spanish (Peer reviewed ✅)
    - Russian (Peer reviewed ✅)
    - Japanese (Peer reviewed ✅)
- [x] Easy to set up (view `/admin-help`)
    - Set the channel and you're good to go (`/set-channel`)
    - Optionally, set server language (`/set-language`) (Default: English)
    - Optionally, disable/enable/force the use of arithmetic (`/toggle-arithmetic`) (Default: Enabled)
    - Optionally. set a timeout for losers (`/set-timeout`) (Default: Disabled)
    - Optionally, set a cooldown for new server members (`/cooldown`) (Default: 60 minutes)
    - Optionally, set a timeout increment factor (`/timeout-increment`) (Default: Disabled)
    - Optionally, enable cheat mode (`/cheat-mode`) (Default: Disabled)
    - Optionally, set a loser role (`/set-loser-role`) (Default: None)
- [x] Easy to self-host
    - No external database needed
    - Easy configuration system
    - Install instructions provided [below](#wrench-setup)
- [x] Admin only commands
- [x] Prevent persons from counting multiple times in a row 
- [x] Ban and unban users from counting
- [x] Handle counts deleted by the user
- [x] Sharding

<hr>

## :diamond_shape_with_a_dot_inside: Feature requests & Issues

Feature request or discovered a bug? Please [open an Issue](https://github.com/NullDev/Arithmetica-Bot/issues/new/choose) here on GitHub.

<hr>

## :lock: Permissions

The bot requires the following permissions:

- Send Messages: To send messages in the counting channel
- Manage Messages: To delete messages in the counting channel
- Read Messages/View Channels: To read messages in the counting channel
- Add Reactions: To add reactions to messages in the counting channel
- Embed Links: To send embeds
- Moderate Members: To timeout users when a timeout is set for losers
- Manage Webhooks: To create webhooks for users when a message is deleted in the counting channel
- View Audit Log: To see who invited the bot in order to send them a setup guide
- Manage Channels: To create a counting channel if it doesn't exist yet

<hr>

## 🤖 DBL & Top.gg

<p align="center">
<a href="https://discordbotlist.com/bots/arithmetica"><img src="https://discordbotlist.com/api/v1/bots/1108279646165942363/widget"></a>&nbsp;&nbsp;
<a href="https://top.gg/bot/1108279646165942363"><img src="https://top.gg/api/widget/1108279646165942363.svg"></a>
</p>

<hr>

## 🌐 Website & Repo

Website: https://arithmetica.xyz <br>
Repository: https://github.com/NullDev/arithmetica.xyz

TOS: https://arithmetica.xyz/tos/ <br>
Privacy: https://arithmetica.xyz/privacy/

<hr>

## :wrench: Setup

0. Open up your favourite terminal (and navigate somewhere you want to download the repository to). <br><br>
1. Make sure you have NodeJS installed (>= v20.0.0). Test by entering <br>
$ `node -v` <br>
If this returns a version number, NodeJS is installed. **If not**, get NodeJS <a href="https://nodejs.org/en/download/package-manager/">here</a>. <br><br>
2. Clone the repository and navigate to it. If you have Git installed, type <br>
$ `git clone https://github.com/NullDev/Arithmetica-Bot.git && cd Arithmetica-Bot` <br>
If not, download it <a href="https://github.com/NullDev/Arithmetica-Bot/archive/master.zip">here</a> and extract the ZIP file.<br>
Then navigate to the folder.<br><br>
3. Install all dependencies by typing <br>
$ `npm install`<br><br>
4. Copy [config/config.template.js](https://github.com/NullDev/Arithmetica-Bot/blob/master/config/config.template.js) and paste it as `config/config.custom.js` OR use `npm run generate-config`. <br><br>
5. Configure it in your favourite editor by editing `config/config.custom.js`. <br><br>
6. Start it in development mode by running <br>
$ `npm start` <br>
or start in production mode <br>
$ `npm run start:prod` <br><br>

<hr>

## :nut_and_bolt: Configuration

Once the config has been copied like described in [Step 4](#wrench-setup), it can be changed to your needs:

| Config Key | Description | Data Type | Default value |
| ---------- | --------- | ------------------ | ------------ |
| discord: <br> `bot_token` | Auth Token of the Discord bot. Can be created [here](https://discordapp.com/developers/). | String | N/A |
| discord: <br> `dbl_token` | OPTIONAL: [DiscordBotList](https://discordbotlist.com/) token to push commands and stats. | String | N/A |
| discord: <br> `top_token` | OPTIONAL: [Top.gg](https://top.gg/) token to push stats. | String | N/A |
| discord: <br> `discords_list_token` | OPTIONAL: [Discords List](https://discords.com/) token to push stats. | String | N/A |
| discord: <br> `vote_webhook_secret` | OPTIONAL: Secret for the vote webhook. | String | N/A |

<hr>

## :octocat: Contributors

<a href="https://github.com/NullDev/Arithmetica-Bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NullDev/Arithmetica-Bot&v=1" />
</a>

<sub>Made with [contrib.rocks](https://contrib.rocks).</sub>

<hr>

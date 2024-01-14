# Arithmetica-Bot
[![NullDev/DiscordJS-Template](https://img.shields.io/badge/Template%3A-NullDev%2FDiscordJS--Template-green?style=flat-square&logo=github)](https://github.com/NullDev/DiscordJS-Template) [![cd](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/cd.yml/badge.svg)](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/cd.yml) [![ESLint](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/eslint.yml/badge.svg)](https://github.com/NullDev/Arithmetica-Bot/actions/workflows/eslint.yml) [![License](https://img.shields.io/github/license/NullDev/Arithmetica-Bot?label=License&logo=Creative%20Commons)](https://github.com/NullDev/Arithmetica-Bot/blob/master/LICENSE) [![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/NullDev/Arithmetica-Bot?logo=Cachet)](https://github.com/NullDev/Arithmetica-Bot/issues?q=is%3Aissue+is%3Aclosed)

<p align="center"><img height="250" width="auto" src="https://cdn.discordapp.com/attachments/1012696857572548759/1108284051942543420/SHADOW_A_material_design_logo_featuring_mathematical_symbols_an_42715bbf-e803-45fe-b1c9-a8e66a2ee57a.png" /></p>
<p align="center"><b>Discord Bot for counting. Allows arithmetic expressions.</b></p>
<hr>

## :question: What does it do?

Your average counting bot. Except you can count with arithmetic expressions!

<hr>

## :satellite: Invite the bot

[![Invite](https://img.shields.io/badge/Invite-37a779?style=for-the-badge)](https://discordapp.com/oauth2/authorize?client_id=1108279646165942363&scope=bot&permissions=1099511655488)

<sub>The link above will invite a bot hosted by me that uses the latest version of this repo. <br>
Alternatively you can host the bot yourself. Instructions [below ⏬](#wrench-setup) </sub>

<hr>

## :star: Features

- [x] Set a counting channel via slash commands
- [x] Count normally (`1, 2, 3, 4`)
- [x] Count with arithmetic expressions (`5^0, sqrt(4), i^2+4, log(10000, 10)`)
- [x] Slash commands
- [x] Arithmetic is toggleable
- [x] `/stats` command for personal stats or the stats of another user
- [x] `/global-stats` command to see how other servers are doing
- [x] `/top` command for a leaderboard, sortable by counts or fails
- [x] Multi-language support (Can be set on every Discord server individually)
    - English (Peer reviewed ✅)
    - German (Peer reviewed ✅)
    - French (Peer reviewed ✅)
    - Spanish (Peer reviewed ✅)
    - Russian (Peer reviewed ✅)
    - Japanese (Peer reviewed ✅)
- [x] Easy to set up
    - Set the channel and you're good to go (`/set-channel`)
    - Optionally, set server language (`/set-language`)
    - Optionally, disable arithmetic (`/toggle-arithmetic`)
    - Optionally. set a timeout for losers (`/set-timeout`)
    - Optionally, set a cooldown for new server members (`/cooldown`)
    - Optionally, set a timeout increment factor (`/timeout-increment`)
- [x] Easy to self-host
    - No external database needed
    - Easy configuration system
    - Install instructions provided [below](#wrench-setup)
- [x] Admin only commands
- [x] Prevent persons from counting multiple times in a row 
- [x] Configurable timeout for losers
- [x] Handle counts deleted by the user
- [x] Cheat-Mode (no losing)
- [x] Sharding

<hr>

## :diamond_shape_with_a_dot_inside: Feature requests & Issues

Feature request or discovered a bug? Please [open an Issue](https://github.com/NullDev/Arithmetica-Bot/issues/new/choose) here on GitHub.

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

<hr>

## :octocat: Contributors

<a href="https://github.com/NullDev/Arithmetica-Bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NullDev/Arithmetica-Bot" />
</a>

<sub>Made with [contrib.rocks](https://contrib.rocks).</sub>

<hr>

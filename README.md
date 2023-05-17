# Arithmetica-Bot

<p align="center"><img height="150" width="auto" src="[https://cdn.discordapp.com/avatars/1102551839674740737/3354a0eebe93a021d96e53c271b0316e.webp?size=128](https://cdn.discordapp.com/attachments/1012696857572548759/1108284051942543420/SHADOW_A_material_design_logo_featuring_mathematical_symbols_an_42715bbf-e803-45fe-b1c9-a8e66a2ee57a.png)" /></p>
<p align="center"><b>Discord Bot for counting. Allows arithmetic expressions.</b></p>
<hr>

## :question: What does it do?

Your average counting bot. Except you can count with arithmetic expressions!

<hr>

## :satellite: Invite the bot

[![Invite](https://img.shields.io/badge/Invite-37a779?style=for-the-badge)](https://discordapp.com/oauth2/authorize?client_id=1108279646165942363&scope=bot&permissions=3136)

<sub>The link above will invite a bot hosted by me that uses the latest version of this repo. <br>
Alternatively you can host the bot yourself. Instructions [below ⏬](#wrench-setup) </sub>

<hr>

## :star: Features

- [x] Set a counting channel via slash commands
- [x] Count normally (`1, 2, 3, 4`)
- [x] Count with arithmetic expressions (`5^0, sqrt(4), i^2+4, log(10000, 10)`)
- [x] Slash commands
- [x] Arithmetic is toggleable 
- [x] Multi-language support (currently English, German, Japanese, Spanish and Russian)
    - Can be set on every Discord server individually
- [x] Easy to set up
    - Set the channel and you're good to go (`/set-channel`)
    - Optionally, set server language (`/set-language`)
    - Optionally, disable arithmetic (`/toggle-arithmetic`)
- [x] Easy to self-host
    - No external database needed
    - Easy configuration system
    - Install instructions provided [below](#wrench-setup)
- [x] Admin only commands
- [x] Prevent persons from counting multiple times in a row 
- [ ] Configurable timeout for losers (_Planned_)

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
$ `git clone https://github.com/NullDev/Discord-RoleShop.git && cd Discord-RoleShop` <br>
If not, download it <a href="https://github.com/NullDev/Arithmetica-Bot/archive/master.zip">here</a> and extract the ZIP file.<br>
Then navigate to the folder.<br><br>
3. Install all dependencies by typing <br>
$ `npm install`<br><br>
4. Copy [config/config.template.js](https://github.com/NullDev/Arithmetica-Bot/blob/master/config/config.template.js) and paste it as `config/config.custom.js` <br><br>
5. Configure it in your favourite editor by editing `config/config.custom.js`. OR use `npm run generate-config`<br><br>
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

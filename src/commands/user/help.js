import { SlashCommandBuilder, InteractionContextType } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.help.desc)
        .setDescriptionLocalizations(translations.help.translations)
        .setContexts([InteractionContextType.Guild]),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const userCommands = /** @type {import("../../service/client.js").default} */ (interaction.client)
            .commands.filter(cmd => cmd.data.default_member_permissions !== "8");

        const str = await Promise.all(userCommands.map(async(cmd) => {
            const serverLang = await __("__LANG__")(interaction.guildId);
            const desc = cmd.data.description_localizations?.[serverLang] || cmd.data.description;
            return `**/${cmd.data.name}** - ${desc}`;
        }));

        const preamble = await __("replies.help_preamble")(interaction.guildId);
        return await interaction.reply({
            content: preamble + "\n\n" + str.join("\n"),
            ephemeral: true,
        });
    },
};

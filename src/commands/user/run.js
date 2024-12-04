import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import Log from "../../util/log.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.run.desc)
        .setDescriptionLocalizations(translations.run.translations)
        .setDMPermission(false)
        .addBooleanOption((option) =>
            option.setName("list-languages")
                .setDescription(translations.run.options.list_languages.desc)
                .setDescriptionLocalizations(translations.run.options.list_languages.translations)
                .setRequired(false)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        if (interaction.options.get("list-languages")?.value){
            const languages = (await fetch("https://emkc.org/api/v2/piston/runtimes").then((res) => res.json())
                .catch((err) => Log.error("Error during fetching of languages: " + err)))
                .map(e => e.language)
                .join(", ");

            return interaction.reply({
                content: languages || (await __("errors.generic_command_execution_failed")(interaction.guildId)),
                ephemeral: true,
            });
        }

        const modal = new ModalBuilder()
            .setCustomId("run_code")
            .setTitle("Run Code");

        const languageInput = new TextInputBuilder()
            .setCustomId("language")
            .setPlaceholder("js")
            .setStyle(TextInputStyle.Short)
            .setLabel("Language")
            .setRequired(true);

        const codeInput = new TextInputBuilder()
            .setCustomId("code")
            .setPlaceholder("console.log('Hello World!')")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Code")
            .setRequired(true);

        const cliArgs = new TextInputBuilder()
            .setCustomId("cli_args")
            .setPlaceholder("arg1\narg2")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("CLI Arguments (1 per line)")
            .setRequired(false);

        const stdIn = new TextInputBuilder()
            .setCustomId("stdin")
            .setPlaceholder("stdin")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Standard Input")
            .setRequired(false);

        const first = /** @type {ActionRowBuilder<import("discord.js").ModalActionRowComponentBuilder>} */ (new ActionRowBuilder()).addComponents(languageInput);
        const second = /** @type {ActionRowBuilder<import("discord.js").ModalActionRowComponentBuilder>} */ (new ActionRowBuilder()).addComponents(codeInput);
        const third = /** @type {ActionRowBuilder<import("discord.js").ModalActionRowComponentBuilder>} */ (new ActionRowBuilder()).addComponents(cliArgs);
        const forth = /** @type {ActionRowBuilder<import("discord.js").ModalActionRowComponentBuilder>} */ (new ActionRowBuilder()).addComponents(stdIn);

        modal.addComponents(first, second, third, forth);

        return await interaction.showModal(modal);
    },
};

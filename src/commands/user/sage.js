import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionContextType } from "discord.js";
import translations from "../../../locales/commands/translations.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.sage.desc)
        .setDescriptionLocalizations(translations.sage.translations)
        .setContexts([InteractionContextType.Guild]),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const modal = new ModalBuilder()
            .setCustomId("sage_math")
            .setTitle("Ask SageMath / SageCell");

        const codeInput = new TextInputBuilder()
            .setCustomId("sage_code")
            .setPlaceholder("integrate(sin(x)^2, x)")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("SageMath Code")
            .setRequired(true);

        const first = /** @type {ActionRowBuilder<import("discord.js").ModalActionRowComponentBuilder>} */ (new ActionRowBuilder()).addComponents(codeInput);

        modal.addComponents(first);

        return await interaction.showModal(modal);
    },
};

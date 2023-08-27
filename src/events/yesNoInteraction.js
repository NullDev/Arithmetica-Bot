import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import __ from "../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable no-param-reassign */

/**
 * Create a yes/no interaction
 *
 * @param {import("discord.js").CommandInteraction | import("discord.js").StringSelectMenuInteraction} interaction
 * @param {object} options
 * @returns {Promise<string>}
 */
const createYesNoInteraction = async function(interaction, {
    promptText = null,
    yesText = null,
    noText = null,
    yesStyle = ButtonStyle.Success,
    noStyle = ButtonStyle.Danger,
    showNoFirst = false,
}){
    promptText ??= await __("generic.are_you_sure")(interaction.guildId);
    yesText ??= await __("generic.yes")(interaction.guildId);
    noText ??= await __("generic.no")(interaction.guildId);

    const yes = new ButtonBuilder()
        .setCustomId("yes")
        .setLabel(yesText)
        .setStyle(yesStyle);

    const no = new ButtonBuilder()
        .setCustomId("no")
        .setLabel(noText)
        .setStyle(noStyle);

    const row = showNoFirst
        ? new ActionRowBuilder().addComponents(no, yes)
        : new ActionRowBuilder().addComponents(yes, no);

    await interaction.deferReply();

    const response = await interaction.followUp({
        content: promptText,
        // @ts-ignore
        components: [row],
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60000,
        });
        await response.edit({ components: [] });
        return confirmation.customId;
    }
    catch (e){
        await response.edit({ components: [] });
        await interaction.followUp({
            content: await __("errors.yn_timeout")(interaction.guildId),
        });
        return "timeout";
    }
};

export default createYesNoInteraction;

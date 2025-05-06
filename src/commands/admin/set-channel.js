import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, InteractionContextType } from "discord.js";
import { QuickDB } from "quick.db";
import createYesNoInteraction from "../../events/yesNoInteraction.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.set_channel.desc)
        .setDescriptionLocalizations(translations.set_channel.translations)
        .setContexts([InteractionContextType.Guild])
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("channel")
                .setDescription(translations.set_channel.options.channel.desc)
                .setDescriptionLocalizations(translations.set_channel.options.channel.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const channel = interaction.options.get("channel");
        if (!channel){
            return await interaction.reply({
                content: await __("errors.invalid_argument")(interaction.guildId),
                ephemeral: true,
            });
        }

        let val = String(channel.value)?.match(/^<#(\d+)>$/)?.[1];
        if (!val) val = (await interaction.guild?.channels.fetch().catch(() => null))?.find(ch => ch?.name === channel.value && ch?.type === ChannelType.GuildText)?.id;
        if (!val){
            const answer = await createYesNoInteraction(interaction, {
                promptText: await __("replies.channel_create", String(channel.value))(interaction.guildId),
            });

            if (answer === "yes"){
                val = (await interaction.guild?.channels.create({ // @ts-ignore
                    name: String(channel.value).replaceAll("#", "") || "counting",
                    type: ChannelType.GuildText,
                }).catch(async() => {
                    interaction.followUp({ content:
                        await __("errors.no_channel_perm")(interaction.guildId),
                    });
                    return null;
                }))?.id;
            }
            else if (answer === "no"){
                await interaction.followUp({
                    content: await __("generic.aborted")(interaction.guildId),
                });
            }
        }
        if (!val) return null;

        await db.set(`guild-${interaction.guildId}.channel`, val);
        await db.delete(`guild-${interaction.guildId}.lastUser`);
        await db.set(`guild-${interaction.guildId}.count`, 0);

        return interaction.deferred
            ? await interaction.followUp({
                content: await __("replies.channel_set", channel.value ?? val)(interaction.guildId),
                ephemeral: true,
            })
            : await interaction.reply({
                content: await __("replies.channel_set", channel.value ?? val)(interaction.guildId),
                ephemeral: true,
            });
    },
};

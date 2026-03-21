import { SlashCommandBuilder, InteractionContextType } from "discord.js";
import getRandomMathFact from "../../util/mathFact.js";
import defaults from "../../util/defaults.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription("Get a random math fact.")
        .setContexts([InteractionContextType.Guild])
        .addStringOption(option =>
            option.setName("search")
                .setDescription("Search for a specific math fact (optional)")
                .setRequired(false),
        ),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        if (!interaction.deferred && !interaction.replied){
            await interaction.deferReply();
        }

        const searchQuery = interaction.options.getString("search");
        if (searchQuery){
            const searchResponse = await fetch(`https://nulldev.org/mathfacts/api/facts/search?text=${encodeURIComponent(searchQuery)}`);
            if (searchResponse.ok){
                const searchData = await searchResponse.json();
                if (searchData && searchData.bestMatch && typeof searchData.bestMatch.content === "string"){
                    const fact = searchData.bestMatch.content;

                    const embed = {
                        color: defaults.embed_color,
                        title: `:abacus:┃Math Fact Search Result for "${searchQuery}"`,
                        description: ":heavy_minus_sign::heavy_minus_sign::heavy_minus_sign: \n" + fact + "\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:",
                        footer: {
                            text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
                            icon_url: interaction.user.displayAvatarURL(),
                        },
                    };

                    if (interaction.deferred){
                        return await interaction.editReply({ embeds: [embed] });
                    }

                    return await interaction.reply({ embeds: [embed] });
                }
            }

            // nothing found
            const fact = await getRandomMathFact();
            const embed = {
                color: defaults.embed_color,
                title: `:abacus:┃No Math Fact Found for "${searchQuery}"`,
                description: `Couldn't find a math fact matching your search query.\nHere's a random one instead:\n\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign: \n${fact}\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:`,
                footer: {
                    text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL(),
                },
            };

            if (interaction.deferred){
                return await interaction.editReply({ embeds: [embed] });
            }

            return await interaction.reply({ embeds: [embed] });
        }

        const fact = await getRandomMathFact();

        const embed = {
            color: defaults.embed_color,
            title: ":abacus:┃Random Math Fact",
            description: ":heavy_minus_sign::heavy_minus_sign::heavy_minus_sign: \n" + fact + "\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:",
            footer: {
                text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        if (interaction.deferred){
            return await interaction.editReply({ embeds: [embed] });
        }

        return await interaction.reply({ embeds: [embed] });
    },
};

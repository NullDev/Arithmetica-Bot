import path from "node:path";
import { QuickDB } from "quick.db";
import executeCode from "../service/codeExecution.js";
import Log from "../util/log.js";
import __ from "../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const statDb = new QuickDB({
    filePath: path.resolve("./data/cmd_stats.sqlite"),
});

/**
 * Handle command Interaction events
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @return {Promise<void>}
 */
const handleCommandInteraction = async function(interaction){
    const command = /** @type {import("../service/client.js").default} */ (interaction.client)
        .commands.get(interaction.commandName);

    if (!command){
        Log.warn(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({ content: await __("errors.command_not_found", interaction.commandName)(interaction.guildId), ephemeral: true });
        return;
    }

    try {
        await statDb.add(interaction.commandName, 1);
        await command.execute(interaction);
    }
    catch (error){
        Log.error("Error during command execution: ", error);
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({ content: await __("errors.generic_command_execution_failed")(interaction.guildId), ephemeral: true });
        }
        else {
            await interaction.reply({ content: await __("errors.generic_command_execution_failed")(interaction.guildId), ephemeral: true });
        }
    }
};

/**
 * Handle modal submit events
 *
 * @param {import("discord.js").ModalSubmitInteraction} interaction
 */
const handleModalSubmit = async function(interaction){
    if (interaction.customId === "run_code"){
        await executeCode(interaction);
    }
};

/**
 * Handle interactionCreate event
 *
 * @param {import("discord.js").Interaction} interaction
 * @return {Promise<void>}
 */
const interactionCreateHandler = async function(interaction){
    if (interaction.isChatInputCommand()) await handleCommandInteraction(interaction);
    if (interaction.isModalSubmit()) await handleModalSubmit(interaction);
};

export default interactionCreateHandler;

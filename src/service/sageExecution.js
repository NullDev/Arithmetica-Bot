import SageCell from "../util/SageCell.js";
import Log from "../util/log.js";
import defaults from "../util/defaults.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const client = new SageCell({ timeoutMs: 20000 });

/**
 * Execute code
 *
 * @param {import("discord.js").ModalSubmitInteraction} interaction
 */
const executeSage = async function(interaction){
    const code = interaction.fields.getTextInputValue("sage_code");

    const embed = {
        color: defaults.embed_color,
        title: ":computer:┃SageMath Output",
        description: "Processing...",
        footer: {
            text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
            icon_url: interaction.user.displayAvatarURL(),
        },
    };

    await interaction.deferReply();

    return client.askSage(code)
        .then(res => {
            embed.description = "Input:\n```py\n" + code + "\n```\nOutput:\n```\n" + (res?.result?.["text/plain"]?.trim() || res?.stdout?.trim() || "No Output") + "\n```";
            return interaction.editReply({ embeds: [embed]});
        })
        .catch(() => {
            embed.description = "An error occurred while executing the code.";
            Log.error("Error during SageMath code execution.");
            return interaction.editReply({ embeds: [embed]});
        });
};

export default executeSage;

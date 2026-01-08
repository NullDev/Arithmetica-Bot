import Log from "../util/log.js";
import defaults from "../util/defaults.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Compare semantic versions
 *
 * @param {String} a
 * @param {String} b
 * @return {Number}
 */
const compareVersions = function(a, b){
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++){
        const aValue = i < aParts.length ? aParts[i] : 0;
        const bValue = i < bParts.length ? bParts[i] : 0;

        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
    }

    return 0;
};

/**
 * Clean language string
 *
 * @param {String} l
 * @return {String}
 */
const clean = function(l){
    return l.replace(/(nasm64|nasm|nasm32)/g, "x86asm");
};

/**
 * Execute code
 *
 * @param {import("discord.js").ModalSubmitInteraction} interaction
 */
const executeCode = async function(interaction){
    const lang = interaction.fields.getTextInputValue("language").toLowerCase();
    const code = interaction.fields.getTextInputValue("code");
    const cli = interaction.fields.getTextInputValue("cli_args");
    const stdin = interaction.fields.getTextInputValue("stdin");

    await interaction.deferReply();

    const languages = await fetch("https://emkc.org/api/v2/piston/runtimes").then((res) => res.json())
        .catch((err) => Log.error("Error during fetching of languages: " + err));

    const language = languages
        .filter(l => l.language.toLowerCase() === lang || l.aliases.map(a => a.toLowerCase()).includes(lang))
        .sort((a, b) => compareVersions(a.version, b.version))[0];

    if (!language){
        return interaction.editReply({ content: "Invalid language. Allowed: `" + languages.map(e => e.language).join(", ") + "`", ephemeral: true });
    }

    const data = {
        language: language.language,
        version: language.version,
        files: [{ content: code }],
        stdin: stdin ?? "",
        log: 0,
    };

    if (cli) data.args = cli.split("\n");

    const r = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json())
        .catch((err) => Log.error("Error during code execution: " + err));

    const embed = {
        color: defaults.embed_color,
        title: ":computer:┃Code Output (" + r.language + " v" + r.version + ")",
        description: "Input:\n```" + clean(language.language) + "\n" + code + "\n```\nOutput:\n```\n" + (r.run.output || "No Output") + "\n```",
        footer: {
            text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
            icon_url: interaction.user.displayAvatarURL(),
        },
    };

    return interaction.editReply({ embeds: [embed]});
};

export default executeCode;

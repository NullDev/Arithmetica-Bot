// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Logging utility class
 *
 * @class Log
 */
class Log {
    /**
     * Get neatly formatted date
     *
     * @return {string}
     * @static
     * @memberof Log
     */
    static #getDate(){
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // eslint-disable-next-line
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        const date = new Intl.DateTimeFormat(
            "en-US",
            /** @type {Intl.DateTimeFormatOptions} */ (options),
        ).format(new Date());

        return "[" + date + "]";
    }

    /**
     * Log an error
     *
     * @static
     * @param {string} input
     * @param {Error} [trace]
     * @memberof Log
     */
    static error(input, trace){
        console.log(" \x1b[41m\x1b[315m x \x1b[0m\x1b[31m [ERROR] " + this.#getDate() + " - " + input + "\x1b[0m");
        if (trace && trace.stack) console.log(" \x1b[41m\x1b[315m x \x1b[0m\x1b[31m [TRACE] " + this.#getDate() + " - " + trace.stack + "\x1b[0m");
    }

    /**
     * Log a warning
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static warn(input){
        console.log(" \x1b[43m\x1b[30m ! \x1b[0m\x1b[33m [WARN]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }

    /**
     * Log a debug message
     * (only if NODE_ENV is set to development)
     *
     * @static
     * @param {string} input
     * @param {boolean} [force=false]
     * @memberof Log
     */
    static debug(input, force = false){
        if (process.env.NODE_ENV !== "development" && !force) return;
        console.log(" \x1b[45m\x1b[30m d \x1b[0m\x1b[35m [DEBUG] " + this.#getDate() + " - " + input + "\x1b[0m");
    }

    /**
     * Log a wait message
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static wait(input){
        console.log(" \x1b[46m\x1b[30m ⧖ \x1b[0m\x1b[36m [WAIT]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }

    /**
     * Log an info
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static info(input){
        console.log(" \x1b[44m\x1b[30m i \x1b[0m\x1b[36m [INFO]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }

    /**
     * Log a success
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static done(input){
        console.log(" \x1b[42m\x1b[30m ✓ \x1b[0m\x1b[32m [DONE]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }
}

export default Log;

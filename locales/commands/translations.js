export default {
    help: {
        desc: "Show an overview of commands.",
        translations: {
            de: "Zeig eine Übersicht aller Befehle.",
            fr: "Afficher un aperçu des commandes.",
            ru: "Показать обзор команд.",
            ja: "コマンドの概要を表示します。",
            "es-ES": "Muestra una descripción general de los comandos.",
        },
    },
    info: {
        desc: "Show information about this bot.",
        translations: {
            de: "Zeig Informationen über diesen Bot.",
            fr: "Afficher des informations sur ce bot.",
            ru: "Показать информацию об этом боте.",
            ja: "このボットに関する情報を表示します。",
            "es-ES": "Muestra información sobre este bot.",
        },
    },
    stats: {
        desc: "View your stats or the stats of another user.",
        translations: {
            de: "Zeige deine Statistiken oder die eines anderen Benutzers.",
            fr: "Afficher vos statistiques ou celles d'un autre utilisateur.",
            ru: "Просмотреть свою статистику или статистику другого пользователя.",
            ja: "あなたの統計情報を表示するか、他のユーザーの統計情報を表示します。",
            "es-ES": "Ver tus estadísticas o las estadísticas de otro usuario.",
        },
        options: {
            user: {
                desc: "The user to show stats for",
                translations: {
                    de: "Der Benutzer, dessen Statistiken angezeigt werden sollen",
                    fr: "L'utilisateur dont les statistiques doivent être affichées",
                    ru: "Пользователь, для которого нужно показать статистику",
                    ja: "統計情報を表示するユーザー",
                    "es-ES": "El usuario para mostrar estadísticas",
                },
            },
        },
    },
    top: {
        desc: "Show the top 10 users.",
        translations: {
            de: "Zeige die Top 10 Benutzer.",
            fr: "Afficher les 10 meilleurs utilisateurs.",
            ru: "Показать топ-10 пользователей.",
            ja: "トップ10のユーザーを表示します。",
            "es-ES": "Muestra los 10 mejores usuarios.",
        },
        options: {
            sort: {
                desc: "Sort by",
                translations: {
                    de: "Sortiere nach",
                    fr: "Trier par",
                    ru: "Сортировать по",
                    ja: "並べ替え",
                    "es-ES": "Ordenar por",
                },
                choices: {
                    wins: {
                        desc: "Correct counts",
                        translations: {
                            de: "Richtige Zählungen",
                            fr: "Comptes corrects",
                            ru: "Правильные счета",
                            ja: "正しいカウント",
                            "es-ES": "Cuentas correctas",
                        },
                    },
                    fails: {
                        desc: "Failed counts",
                        translations: {
                            de: "Falsche Zählungen",
                            fr: "Comptes échoués",
                            ru: "Неудачные счета",
                            ja: "失敗したカウント",
                            "es-ES": "Cuentas fallidas",
                        },
                    },
                },
            },
        },
    },
    admin_help: {
        desc: "Show an overview of all admin commands.",
        translations: {
            de: "Zeig eine Übersicht aller Admin-Befehle.",
            fr: "Afficher un aperçu de toutes les commandes d'administration.",
            ru: "Показать обзор всех административных команд.",
            ja: "すべての管理者コマンドの概要を表示します。",
            "es-ES": "Muestra una descripción general de todos los comandos de administración.",
        },
    },
    reset_guild: {
        desc: "Reset the count of the guild",
        translations: {
            de: "Setze den Zähler des Servers zurück",
            fr: "Réinitialiser le compteur de la guilde",
            ru: "Сбросить счетчик гильдии",
            ja: "ギルドのカウントをリセットする",
            "es-ES": "Restablecer el recuento del gremio",
        },
    },
    set_channel: {
        desc: "Set the counting channel.",
        translations: {
            de: "Setze den Zählkanal.",
            fr: "Définir le canal de comptage.",
            ru: "Установить канал подсчета.",
            ja: "カウントチャンネルを設定します。",
            "es-ES": "Establecer el canal de recuento.",
        },
        options: {
            channel: {
                desc: "The name of the channel to set",
                translations: {
                    de: "Der Name des zu setzenden Kanals",
                    fr: "Le nom du canal à définir",
                    ru: "Имя канала для установки",
                    ja: "設定するチャンネルの名前",
                    "es-ES": "El nombre del canal para establecer",
                },
            },
        },
    },
    set_language: {
        desc: "Set the server language for the bot.",
        translations: {
            de: "Setze die Server-Sprache für den Bot.",
            fr: "Définir la langue du serveur pour le bot.",
            ru: "Установить язык сервера для бота.",
            ja: "ボットのサーバー言語を設定します。",
            "es-ES": "Establecer el idioma del servidor para el bot.",
        },
        options: {
            language: {
                desc: "The language to set",
                translations: {
                    de: "Die zu setzende Sprache",
                    fr: "La langue à définir",
                    ru: "Язык для установки",
                    ja: "設定する言語",
                    "es-ES": "El idioma para establecer",
                },
            },
        },
    },
    set_timeout: {
        desc: "Configure a timeout for losers.",
        translations: {
            de: "Konfiguriere ein Time-Out für Verlierer.",
            fr: "Configurer une temporisation pour les perdants.",
            ru: "Настройте тайм-аут для проигравших.",
            ja: "敗者のタイムアウトを設定します。",
            "es-ES": "Configure un tiempo de espera para los perdedores.",
        },
        options: {
            timeout: {
                desc: "Timeout in minutes or 0 to disable",
                translations: {
                    de: "Time-Out in Minuten oder 0 zum Deaktivieren",
                    fr: "Délai d'attente en minutes ou 0 pour désactiver",
                    ru: "Тайм-аут в минутах или 0 для отключения",
                    ja: "タイムアウト（分単位）または0を無効にする",
                    "es-ES": "Tiempo de espera en minutos o 0 para desactivar",
                },
            },
        },
    },
    toggle_arithmetic: {
        desc: "Enable/Disable support for arithmetic expressions.",
        translations: {
            de: "Aktiviere/Deaktiviere die Verwendung für arithmetische Ausdrücke.",
            fr: "Activer/Désactiver la prise en charge des expressions arithmétiques.",
            ru: "Включить/Отключить поддержку арифметических выражений.",
            ja: "算術式のサポートの有効化/無効化。",
            "es-ES": "Activar/Desactivar el soporte para expresiones aritméticas.",
        },
        options: {
            enabled: {
                desc: "Enable or disable arithmetic expressions",
                translations: {
                    de: "Aktiviere oder deaktiviere arithmetische Ausdrücke",
                    fr: "Activer ou désactiver les expressions arithmétiques",
                    ru: "Включить или отключить арифметические выражения",
                    ja: "算術式の有効化/無効化",
                    "es-ES": "Activar o desactivar expresiones aritméticas",
                },
            },
        },
    },
    cheat_mode: {
        desc: "Enable/Disable cheat mode (no failing).",
        translations: {
            de: "Aktiviere/Deaktiviere den Cheat-Modus (kein Verlieren).",
            fr: "Activer/Désactiver le mode triche (pas d'échec).",
            ru: "Включить/Отключить режим читов (без неудач).",
            ja: "チートモード（失敗なし）の有効化/無効化。",
            "es-ES": "Activar/Desactivar el modo trampa (sin fallas).",
        },
        options: {
            enabled: {
                desc: "Enable or disable cheat mode",
                translations: {
                    de: "Aktiviere oder deaktiviere den Cheat-Modus",
                    fr: "Activer ou désactiver le mode triche",
                    ru: "Включить или отключить режим читов",
                    ja: "チートモードの有効化/無効化",
                    "es-ES": "Activar o desactivar el modo trampa",
                },
            },
            startcount: {
                desc: "The number to start counting from (default: 0)",
                translations: {
                    de: "Die Zahl, ab der gezählt werden soll (Standard: 0)",
                    fr: "Le nombre à partir duquel commencer à compter (par défaut: 0)",
                    ru: "Число, с которого начинать считать (по умолчанию: 0)",
                    ja: "カウントを開始する数（デフォルト：0）",
                    "es-ES": "El número desde el que comenzar a contar (predeterminado: 0)",
                },
            },
        },
    },
};

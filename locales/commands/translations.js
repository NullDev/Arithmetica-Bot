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
                    mathcounts: {
                        desc: "Math counts",
                        translations: {
                            de: "Mathe Zählungen",
                            fr: "Math Comptes",
                            ru: "Счета математики",
                            ja: "数学カウント",
                            "es-ES": "Cuentas de matemáticas",
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
        desc: "Enable/Disable/Force the use of arithmetic expressions (Default: Enabled).",
        translations: {
            de: "Aktiviere/Deaktiviere/Erzwinge die Verwendung von arithmetischen Ausdrücken (Standard: Aktiviert).",
            fr: "Activer/Désactiver/Forcer l'utilisation d'expressions arithmétiques (Par défaut: Activé).",
            ru: "Включить/Отключить/Принудительное использование арифметических выражений (по умолчанию: включено).",
            ja: "算術式の使用を有効化/無効化/強制（デフォルト：有効）。",
            "es-ES": "Activar/Desactivar/Forzar el uso de expresiones aritméticas (predeterminado: activado).",
        },
        options: {
            select: {
                desc: "Choose whether to enable, disable or force arithmetic expressions",
                translations: {
                    de: "Wähle, ob arithmetische Ausdrücke aktiviert, deaktiviert oder erzwungen werden sollen",
                    fr: "Choisissez d'activer, de désactiver ou de forcer les expressions arithmétiques",
                    ru: "Выберите, включить, отключить или принудительное использование арифметических выражений",
                    ja: "算術式を有効、無効、または強制するかどうかを選択します",
                    "es-ES": "Elija si habilitar, deshabilitar o forzar expresiones aritméticas",
                },
                choices: {
                    enabled: {
                        desc: "Enable arithmetic expressions",
                        translations: {
                            de: "Aktiviere arithmetische Ausdrücke",
                            fr: "Activer les expressions arithmétiques",
                            ru: "Включить арифметические выражения",
                            ja: "算術式を有効にする",
                            "es-ES": "Habilitar expresiones aritméticas",
                        },
                    },
                    disabled: {
                        desc: "Disable arithmetic expressions",
                        translations: {
                            de: "Deaktiviere arithmetische Ausdrücke",
                            fr: "Désactiver les expressions arithmétiques",
                            ru: "Отключить арифметические выражения",
                            ja: "算術式を無効にする",
                            "es-ES": "Deshabilitar expresiones aritméticas",
                        },
                    },
                    mathonly: {
                        desc: "Force arithmetic expressions (normal number counts will be rejected)",
                        translations: {
                            de: "Erzwinge arithmetische Ausdrücke (normale Zählungen werden abgelehnt)",
                            fr: "Forcer les expressions arithmétiques (les comptes de nombres normaux seront rejetés)",
                            ru: "Принудительное использование арифметических выражений (обычные счетчики чисел будут отклонены)",
                            ja: "算術式を強制（通常の数値カウントは拒否されます）",
                            "es-ES": "Forzar expresiones aritméticas (los recuentos normales de números serán rechazados)",
                        },
                    },
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
    calc: {
        desc: "Evaluate a math expression",
        translations: {
            de: "Berechne einen mathematischen Ausdruck",
            fr: "Évaluer une expression mathématique",
            ru: "Вычислить математическое выражение",
            ja: "数式を評価する",
            "es-ES": "Evaluar una expresión matemática",
        },
        options: {
            expression: {
                desc: "The expression to evaluate",
                translations: {
                    de: "Der auszuwertende Ausdruck",
                    fr: "L'expression à évaluer",
                    ru: "Выражение для вычисления",
                    ja: "評価する式",
                    "es-ES": "La expresión a evaluar",
                },
            },
        },
    },
    oeis: {
        desc: "Search the OEIS for a sequence",
        translations: {
            de: "Durchsuche die OEIS nach einer Sequenz",
            fr: "Rechercher la séquence OEIS",
            ru: "Поиск последовательности OEIS",
            ja: "OEISでシーケンスを検索する",
            "es-ES": "Buscar la secuencia OEIS",
        },
        options: {
            sequence: {
                desc: "The sequence to search for",
                translations: {
                    de: "Die zu suchende Sequenz",
                    fr: "La séquence à rechercher",
                    ru: "Последовательность для поиска",
                    ja: "検索するシーケンス",
                    "es-ES": "La secuencia a buscar",
                },
            },
        },
    },
    cooldown: {
        desc: "Cooldown for new members before they can count",
        translations: {
            de: "Abklingzeit für neue Mitglieder, bevor sie zählen können",
            fr: "Temps de recharge pour les nouveaux membres avant qu'ils ne puissent compter",
            ru: "Время отката для новых участников, прежде чем они смогут посчитать",
            ja: "カウントできるようになる前の新しいメンバーのクールダウン",
            "es-ES": "Tiempo de espera para nuevos miembros antes de que puedan contar",
        },
        options: {
            timeout: {
                desc: "Cooldown in minutes or 0 to disable (default: 60)",
                translations: {
                    de: "Abklingzeit in Minuten oder 0 zum Deaktivieren (Standard: 60)",
                    fr: "Temps de recharge en minutes ou 0 pour désactiver (par défaut: 60)",
                    ru: "Время отката в минутах или 0 для отключения (по умолчанию: 60)",
                    ja: "クールダウン（分単位）または0を無効にする（デフォルト：60）",
                    "es-ES": "Tiempo de espera en minutos o 0 para desactivar (predeterminado: 60)",
                },
            },
        },
    },
    timeout_increment: {
        desc: "Factor to increment the timeout for losers.",
        translations: {
            de: "Faktor, um das Time-Out für Verlierer zu erhöhen.",
            fr: "Facteur pour incrémenter le délai d'attente pour les perdants.",
            ru: "Фактор для увеличения тайм-аута для проигравших.",
            ja: "敗者のタイムアウトを増やすための要因。",
            "es-ES": "Factor para incrementar el tiempo de espera para los perdedores.",
        },
        options: {
            factor: {
                desc: "1 = no increment, 2 = double the timeout on each fail, etc.",
                translations: {
                    de: "1 = kein Inkrement, 2 = Timeout bei jedem Fehler verdoppeln, etc.",
                    fr: "1 = pas d'incrément, 2 = doubler le délai d'attente à chaque échec, etc.",
                    ru: "1 = без увеличения, 2 = удвоить время ожидания при каждом сбое и т. д.",
                    ja: "1 =インクリメントなし、2 =失敗ごとにタイムアウトを2倍にするなど。",
                    "es-ES": "1 = sin incremento, 2 = duplicar el tiempo de espera en cada error, etc.",
                },
            },
        },
    },
    global_stats: {
        desc: "View your servers rank on the global leaderboard.",
        translations: {
            de: "Zeige deinen Server-Rang auf der globalen Bestenliste.",
            fr: "Afficher le classement de votre serveur sur le classement mondial.",
            ru: "Просмотреть ранг вашего сервера в глобальном рейтинге.",
            ja: "グローバルリーダーボードでサーバーのランクを表示します。",
            "es-ES": "Ver la clasificación de tu servidor en la clasificación global.",
        },
        options: {
            type: {
                desc: "The type of stats to show",
                translations: {
                    de: "Der Typ der Statistiken, die angezeigt werden sollen",
                    fr: "Le type de statistiques à afficher",
                    ru: "Тип статистики для отображения",
                    ja: "表示する統計のタイプ",
                    "es-ES": "El tipo de estadísticas para mostrar",
                },
                choices: {
                    current: {
                        desc: "Current count",
                        translations: {
                            de: "Aktuelle Zählung",
                            fr: "Compte actuel",
                            ru: "Текущий счет",
                            ja: "現在のカウント",
                            "es-ES": "Recuento actual",
                        },
                    },
                    best: {
                        desc: "Best count",
                        translations: {
                            de: "Beste Zählung",
                            fr: "Meilleur compte",
                            ru: "Лучший счет",
                            ja: "最高カウント",
                            "es-ES": "Mejor recuento",
                        },
                    },
                },
            },
        },
    },
    vote: {
        desc: "If you enjoy the bot, please consider voting for it!",
        translations: {
            de: "Wenn dir der Bot gefällt, bitte vote für ihn!",
            fr: "Si vous aimez le bot, pensez à voter pour lui !",
            ru: "Если вам нравится бот, пожалуйста, проголосуйте за него!",
            ja: "ボットが気に入ったら、投票してください！",
            "es-ES": "Si te gusta el bot, ¡considera votar por él!",
        },
    },
    math_fact: {
        desc: "Get a random math fact.",
        translations: {
            de: "Erhalte einen zufälligen Mathe-Fakt (auf Englisch)",
            fr: "Obtenez un fait mathématique aléatoire (en anglais)",
            ru: "Получить случайный математический факт (на английском языке)",
            ja: "ランダムな数学の事実を取得します（英語）",
            "es-ES": "Obtenga un hecho matemático aleatorio (en inglés)",
        },
    },
    best: {
        desc: "Show the best count of the server so far.",
        translations: {
            de: "Zeige die beste Zählung des Servers bisher.",
            fr: "Afficher le meilleur compte du serveur jusqu'à présent.",
            ru: "Показать лучший счет сервера до сих пор.",
            ja: "これまでのサーバーの最高カウントを表示します。",
            "es-ES": "Muestra el mejor recuento del servidor hasta ahora.",
        },
    },
    ban_user: {
        desc: "Ban a user from counting.",
        translations: {
            de: "Verbiete einem Benutzer das Zählen.",
            fr: "Interdire à un utilisateur de compter.",
            ru: "Запретить пользователю считать.",
            ja: "ユーザーのカウントを禁止します。",
            "es-ES": "Prohibir a un usuario contar.",
        },
        options: {
            user: {
                desc: "The user to ban",
                translations: {
                    de: "Der zu bannende Benutzer",
                    fr: "L'utilisateur à bannir",
                    ru: "Пользователь для бана",
                    ja: "禁止するユーザー",
                    "es-ES": "El usuario a bloquear",
                },
            },
        },
    },
    unban_user: {
        desc: "Unban a user from counting.",
        translations: {
            de: "Erlaube einem Benutzer das Zählen wieder.",
            fr: "Débannir un utilisateur de compter.",
            ru: "Разбанить пользователя для подсчета.",
            ja: "ユーザーのカウントを解除します。",
            "es-ES": "Desbloquear a un usuario para contar.",
        },
        options: {
            user: {
                desc: "The user to unban",
                translations: {
                    de: "Der zu entsperrende Benutzer",
                    fr: "L'utilisateur à débannir",
                    ru: "Пользователь для разбана",
                    ja: "禁止を解除するユーザー",
                    "es-ES": "El usuario a desbloquear",
                },
            },
        },
    },
    last_count: {
        desc: "Show the last count of the server as number.",
        translations: {
            de: "Zeige die letzte Zählung des Servers als Zahl.",
            fr: "Afficher le dernier compte du serveur en tant que nombre.",
            ru: "Показать последний счет сервера как число.",
            ja: "サーバーの最後のカウントを数値として表示します。",
            "es-ES": "Muestra el último recuento del servidor como número.",
        },
    },
    pin_highscore: {
        desc: "Pin the highscore to the channel.",
        translations: {
            de: "Pinne den Highscore in den Kanal.",
            fr: "Épingler le meilleur score dans le canal.",
            ru: "Закрепить рекорд в канале.",
            ja: "ハイスコアをチャンネルにピン留めします。",
            "es-ES": "Fijar la puntuación más alta en el canal.",
        },
        options: {
            enabled: {
                desc: "Enable or disable pinning",
                translations: {
                    de: "Aktiviere oder deaktiviere das Pinnen",
                    fr: "Activer ou désactiver l'épinglage",
                    ru: "Включить или отключить закрепление",
                    ja: "ピン留めを有効または無効にする",
                    "es-ES": "Habilitar o deshabilitar el fijado",
                },
            },
        },
    },
    tex: {
        desc: "Render a LaTeX expression",
        translations: {
            de: "Rendere einen LaTeX-Ausdruck",
            fr: "Rendre une expression LaTeX",
            ru: "Отобразить выражение LaTeX",
            ja: "LaTeX式をレンダリングする",
            "es-ES": "Renderizar una expresión LaTeX",
        },
        options: {
            expression: {
                desc: "The LaTeX expression to render",
                translations: {
                    de: "Der zu rendernde LaTeX-Ausdruck",
                    fr: "L'expression LaTeX à rendre",
                    ru: "Выражение LaTeX для отображения",
                    ja: "レンダリングするLaTeX式",
                    "es-ES": "La expresión LaTeX a renderizar",
                },
            },
        },
    },
    ask: {
        desc: "Ask a question to Wolfram Alpha",
        translations: {
            de: "Stelle eine Frage an Wolfram Alpha",
            fr: "Poser une question à Wolfram Alpha",
            ru: "Задать вопрос Wolfram Alpha",
            ja: "Wolfram Alphaに質問する",
            "es-ES": "Hacer una pregunta a Wolfram Alpha",
        },
        options: {
            question: {
                desc: "The question to ask",
                translations: {
                    de: "Die zu stellende Frage",
                    fr: "La question à poser",
                    ru: "Вопрос, который нужно задать",
                    ja: "質問する内容",
                    "es-ES": "La pregunta a hacer",
                },
            },
        },
    },
    run: {
        desc: "Run code",
        translations: {
            de: "Code ausführen",
            fr: "Exécuter le code",
            ru: "Запустить код",
            ja: "コードを実行する",
            "es-ES": "Ejecutar código",
        },
        options: {
            list_languages: {
                desc: "List all available languages",
                translations: {
                    de: "Liste alle verfügbaren Sprachen auf",
                    fr: "Lister toutes les langues disponibles",
                    ru: "Список всех доступных языков",
                    ja: "利用可能なすべての言語をリストする",
                    "es-ES": "Enumerar todos los idiomas disponibles",
                },
            },
        },
    },
    rounding: {
        desc: "Enable/Disable rounding of numbers.",
        translations: {
            de: "Aktiviere/Deaktiviere das Runden von Zahlen.",
            fr: "Activer/Désactiver l'arrondi des nombres.",
            ru: "Включить/Отключить округление чисел.",
            ja: "数値の丸めを有効/無効にする。",
            "es-ES": "Habilitar/Deshabilitar el redondeo de números.",
        },
        options: {
            enabled: {
                desc: "Enable or disable rounding",
                translations: {
                    de: "Aktiviere oder deaktiviere das Runden",
                    fr: "Activer ou désactiver l'arrondi",
                    ru: "Включить или отключить округление",
                    ja: "丸めを有効または無効にする",
                    "es-ES": "Habilitar o deshabilitar el redondeo",
                },
            },
        },
    },
    list_bans: {
        desc: "List all banned users.",
        translations: {
            de: "Liste alle gebannten Benutzer auf.",
            fr: "Lister tous les utilisateurs bannis.",
            ru: "Список всех забаненных пользователей.",
            ja: "禁止されたすべてのユーザーをリストします。",
            "es-ES": "Enumerar todos los usuarios bloqueados.",
        },
    },
    set_loser_role: {
        desc: "Set the loser role.",
        translations: {
            de: "Setze die Verlierer-Rolle.",
            fr: "Définir le rôle de perdant.",
            ru: "Установить роль проигравшего.",
            ja: "敗者の役割を設定します。",
            "es-ES": "Establecer el rol de perdedor.",
        },
        options: {
            role: {
                desc: "The role to set",
                translations: {
                    de: "Die zu setzende Rolle",
                    fr: "Le rôle à définir",
                    ru: "Роль для установки",
                    ja: "設定する役割",
                    "es-ES": "El rol a establecer",
                },
            },
            duration: {
                desc: "Duration of the role in hours",
                translations: {
                    de: "Dauer der Rolle in Stunden",
                    fr: "Durée du rôle en heures",
                    ru: "Продолжительность роли в часах",
                    ja: "役割の期間",
                    "es-ES": "Duración del rol en horas",
                },
            },
        },
    },
    unset_loser_role: {
        desc: "Unset the loser role.",
        translations: {
            de: "Entferne die Verlierer-Rolle.",
            fr: "Désactiver le rôle de perdant.",
            ru: "Отменить роль проигравшего.",
            ja: "敗者の役割を解除します。",
            "es-ES": "Deshabilitar el rol de perdedor.",
        },
    },
    set_last_count: {
        desc: "Set the last count of the server.",
        translations: {
            de: "Setze die letzte Zählung des Servers.",
            fr: "Définir le dernier compte du serveur.",
            ru: "Установить последний счет сервера.",
            ja: "サーバーの最後のカウントを設定します。",
            "es-ES": "Establecer el último recuento del servidor.",
        },
        options: {
            count: {
                desc: "The count to set",
                translations: {
                    de: "Die zu setzende Zählung",
                    fr: "Le compte à définir",
                    ru: "Счет для установки",
                    ja: "設定するカウント",
                    "es-ES": "El recuento a establecer",
                },
            },
        },
    },
};

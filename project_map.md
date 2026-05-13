# QUESTPAUSE Sentinel — Project Map (Stage 12)

```
questpause-sentinel/
├── .env.example                         # Environment variable template
├── .gitignore                           # Git ignore rules
├── package.json                         # Dependencies and scripts
├── README.md                            # Project documentation
├── DEPLOY.md                            # Oracle VM deployment guide
├── project_map.md                       # This file
├── scripts/
│   └── deploy-commands.js               # Slash command registration
├── src/
│   ├── index.js                         # Entry point
│   ├── events/
│   │   ├── ready.js                     # Bot ready event
│   │   ├── interactionCreate.js         # Slash command handler
│   │   └── messageCreate.js             # Keyword guard + persona triggers
│   ├── commands/
│   │   ├── sentinelStatus.js            # /sentinel-status
│   │   ├── reportPlayer.js              # /report-player
│   │   ├── logIncident.js               # /log-incident (admin)
│   │   ├── playerHistory.js             # /player-history
│   │   ├── resolveIncident.js           # /resolve-incident (admin)
│   │   ├── addWarning.js                # /add-warning (admin)
│   │   ├── resolveWarning.js            # /resolve-warning (admin)
│   │   ├── resolveReport.js             # /resolve-report (admin)
│   │   ├── watchPlayer.js               # /watch-player (admin)
│   │   └── unwatchPlayer.js             # /unwatch-player (admin)
│   ├── modules/
│   │   └── moderation/
│   │       ├── incidentLogger.js        # Incident CRUD logic
│   │       ├── warningLogger.js         # Warning CRUD logic
│   │       ├── reportLogger.js          # Report CRUD logic
│   │       ├── watchlistLogger.js       # Watchlist CRUD logic
│   │       ├── keywordGuard.js          # Serious keyword detection
│   │       └── alerts.js                # Admin alert sender
│   ├── personas/
│   │   ├── personaRouter.js             # Trigger matching + reply building
│   │   └── triggerReplies.js            # Cooldown + env-check wrapper
│   ├── storage/
│   │   ├── storeInterface.js            # Abstract storage interface
│   │   ├── jsonStore.js                 # JSON file implementation
│   │   └── data/
│   │       ├── .gitkeep
│   │       ├── incidents.json           # Incident records
│   │       ├── warnings.json            # Warning records
│   │       ├── reports.json             # Player report records
│   │       └── watchlist.json           # Player watchlist records
│   ├── config/
│   │   ├── index.js                     # Version and environment config
│   │   ├── keywords.js                  # Serious keyword list
│   │   ├── channels.js                  # Channel allow/block config
│   │   ├── channelGames.js              # Channel-to-game mapping
│   │   ├── personas.js                  # Game persona definitions
│   │   └── triggers.js                  # Harmless trigger keywords + replies
│   └── utils/
│       └── logger.js                    # Logging utility
```

## Stage 7 Additions

- `/report-player` command (public) — players can submit reports for admin review
- `reportLogger.js` — report CRUD with sequential QP-REP-XXXX IDs
- Reports saved to `reports.json` (gitignored)
- Admin alert sent to `SENTINEL_REPORT_CHANNEL_ID` if configured
- No automatic punishments — human admins review and decide

## Stage 8 Additions

- `/resolve-report` command (admin) — resolve open player reports with outcome choice and resolution notes
- `resolveReport()` added to `reportLogger.js` — case-insensitive ID lookup, updates report status to Resolved
- Outcome choices: No Action, Duplicate, Evidence Insufficient, Resolved Informally, Warning Issued, Converted To Incident
- Optional `linked-incident-id` field to associate resolved report with an existing incident
- No automatic incident or warning creation — human admins decide separately

## Stage 9 Additions

- `/watch-player` command (admin) — add a player to the watchlist with game, reason, and severity
- `/unwatch-player` command (admin) — remove a player from the watchlist with removal reason
- `watchlistLogger.js` — watchlist CRUD with sequential QP-WATCH-XXXX IDs
- Watchlist saved to `watchlist.json` (gitignored via existing `src/storage/data/*.json` pattern)
- `/player-history` now shows Active Watchlist count and latest 5 watchlist entries
- Watch record fields: id, player, game, reason, severity, status (Active/Removed), createdBy, createdAt, removedBy, removedAt, removalReason
- Game choices: Valheim, Project Zomboid, ICARUS, Windrose, Minecraft, 7 Days to Die, Discord, Network
- Severity choices: Low, Medium, High, Critical

## Stage 10 Additions

- Serious Keyword Guard — `keywordGuard.js` monitors all guild text messages for 21 serious keywords
- `messageCreate.js` event handler wires keyword detection into the bot's event pipeline
- `alerts.js` — sends admin alert embeds to `SENTINEL_ALERT_CHANNEL_ID` if configured
- `config/keywords.js` — centralized keyword list and cooldown configuration
- Cooldown protection: 10-minute cooldown per (channel + keyword) and per author to prevent spam alerts
- Admin alert embed includes: trigger keyword, author, channel, message link, message excerpt, timestamp, and recommended action steps
- No automatic punishment, no public reply, no incident/warning creation — human admins review and decide
- Bot ignores DMs and other bot messages
- Added `GuildMessages` and `MessageContent` intents to client

## Stage 11 Additions

- `config/channels.js` — parses `SENTINEL_MONITORED_CHANNEL_IDS`, `SENTINEL_BLOCKED_CHANNEL_IDS`, `SENTINEL_BLOCKED_CATEGORY_IDS` env vars into Sets
- `keywordGuard.js` now filters messages against channel allow/block lists before keyword scanning
- If `SENTINEL_MONITORED_CHANNEL_IDS` is set, Sentinel monitors **only** those channels
- If `SENTINEL_MONITORED_CHANNEL_IDS` is empty, all guild text channels are eligible (minus blocked)
- `SENTINEL_ALERT_CHANNEL_ID` and `SENTINEL_REPORT_CHANNEL_ID` are always excluded from monitoring
- Startup logs channel config summary: monitored count, blocked channel count, blocked category count
- Empty env vars are handled gracefully — no crashes

## Stage 12 Additions

- Game Personas — 6 game-themed personas with personality replies to harmless trigger keywords
- `config/personas.js` — defines 6 personas (Knox Radio, The Old Raven, Orbital Handler, The Quartermaster, The Block Keeper, Bunker Broadcast)
- `config/triggers.js` — 30+ harmless trigger keywords across 6 games, each with 3 varied reply options
- `config/channelGames.js` — parses `*_CHANNEL_IDS` env vars into channelId→gameName map
- `modules/personas/personaRouter.js` — accepts `channelId` param; if mapped to a game, only that game's triggers are checked; unmapped channels fall back to any-game matching
- `modules/personas/triggerReplies.js` — passes `message.channel.id` to `matchTrigger`
- `messageCreate.js` now calls both `keywordGuard.checkMessage()` and `triggerReplies.checkForTrigger()` in sequence
- Serious keyword guard takes priority — if a serious keyword is present, persona reply is suppressed
- Respects Stage 11 channel allow/block config, ignores bots and DMs
- Controlled by `ENABLE_PERSONA_REPLIES=true`, `PERSONA_REPLY_COOLDOWN_MINUTES=15`, `PERSONA_PLAYER_COOLDOWN_MINUTES=30`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |
| `SENTINEL_REPORT_CHANNEL_ID` | Channel ID for report alerts (optional) |
| `SENTINEL_ALERT_CHANNEL_ID` | Channel ID for keyword guard alerts (optional) |
| `SENTINEL_MONITORED_CHANNEL_IDS` | Comma-separated channel IDs to monitor exclusively (optional) |
| `SENTINEL_BLOCKED_CHANNEL_IDS` | Comma-separated channel IDs to ignore (optional) |
| `SENTINEL_BLOCKED_CATEGORY_IDS` | Comma-separated category IDs to ignore (optional) |
| `ENABLE_PERSONA_REPLIES` | Enable game persona replies (`true`/`false`, optional) |
| `PERSONA_REPLY_COOLDOWN_MINUTES` | Per-channel cooldown for persona replies (default 15) |
| `PERSONA_PLAYER_COOLDOWN_MINUTES` | Per-player cooldown for persona replies (default 30) |
| `VALHEIM_CHANNEL_IDS` | Comma-separated channel IDs for Valheim persona (optional) |
| `PROJECT_ZOMBOID_CHANNEL_IDS` | Comma-separated channel IDs for Project Zomboid persona (optional) |
| `ICARUS_CHANNEL_IDS` | Comma-separated channel IDs for ICARUS persona (optional) |
| `WINDROSE_CHANNEL_IDS` | Comma-separated channel IDs for Windrose persona (optional) |
| `MINECRAFT_CHANNEL_IDS` | Comma-separated channel IDs for Minecraft persona (optional) |
| `SEVEN_DAYS_TO_DIE_CHANNEL_IDS` | Comma-separated channel IDs for 7 Days to Die persona (optional) |

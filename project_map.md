# QUESTPAUSE Sentinel — Project Map (Stage 10)

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
│   │   └── messageCreate.js             # Keyword guard monitor
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
│   │   └── keywords.js                  # Serious keyword list
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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |
| `SENTINEL_REPORT_CHANNEL_ID` | Channel ID for report alerts (optional) |
| `SENTINEL_ALERT_CHANNEL_ID` | Channel ID for keyword guard alerts (optional) |

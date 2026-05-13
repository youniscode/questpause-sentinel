# QUESTPAUSE Sentinel — Project Map (Stage 9)

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
│   │   └── interactionCreate.js         # Slash command handler
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
│   │       └── watchlistLogger.js       # Watchlist CRUD logic
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
│   │   └── index.js                     # Version and environment config
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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |
| `SENTINEL_REPORT_CHANNEL_ID` | Channel ID for report alerts (optional) |

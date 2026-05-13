# QUESTPAUSE Sentinel — Project Map (Stage 8)

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
│   │   └── resolveReport.js             # /resolve-report (admin)
│   ├── modules/
│   │   └── moderation/
│   │       ├── incidentLogger.js        # Incident CRUD logic
│   │       ├── warningLogger.js         # Warning CRUD logic
│   │       └── reportLogger.js          # Report CRUD logic
│   ├── storage/
│   │   ├── storeInterface.js            # Abstract storage interface
│   │   ├── jsonStore.js                 # JSON file implementation
│   │   └── data/
│   │       ├── .gitkeep
│   │       ├── incidents.json           # Incident records
│   │       ├── warnings.json            # Warning records
│   │       └── reports.json             # Player report records
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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |
| `SENTINEL_REPORT_CHANNEL_ID` | Channel ID for report alerts (optional) |

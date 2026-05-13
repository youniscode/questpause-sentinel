# QUESTPAUSE Sentinel — Project Map (Stage 5)

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
│   │   ├── logIncident.js               # /log-incident (admin)
│   │   ├── playerHistory.js             # /player-history
│   │   ├── resolveIncident.js           # /resolve-incident (admin)
│   │   └── addWarning.js                # /add-warning (admin)
│   ├── modules/
│   │   └── moderation/
│   │       ├── incidentLogger.js        # Incident CRUD logic
│   │       └── warningLogger.js         # Warning CRUD logic
│   ├── storage/
│   │   ├── storeInterface.js            # Abstract storage interface
│   │   ├── jsonStore.js                 # JSON file implementation
│   │   └── data/
│   │       ├── .gitkeep
│   │       ├── incidents.json           # Incident records
│   │       └── warnings.json            # Warning records
│   ├── config/
│   │   └── index.js                     # Version and environment config
│   └── utils/
│       └── logger.js                    # Logging utility
```

## Stage 5 Additions

- `/add-warning` admin command — issue warnings with QP-WARN-XXXX ID format
- `warningLogger.js` — warning CRUD with sequential IDs and status tracking
- Warnings added to jsonStore collections (auto-creates `warnings.json`)
- `/player-history` now shows incidents and warnings side by side (latest 5 each)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |

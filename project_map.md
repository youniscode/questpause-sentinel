# QUESTPAUSE Sentinel — Project Map (Stage 4)

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
│   │   └── resolveIncident.js           # /resolve-incident (admin)
│   ├── modules/
│   │   └── moderation/
│   │       └── incidentLogger.js        # Incident CRUD logic
│   ├── storage/
│   │   ├── storeInterface.js            # Abstract storage interface
│   │   ├── jsonStore.js                 # JSON file implementation
│   │   └── data/
│   │       ├── .gitkeep
│   │       └── incidents.json           # Incident records
│   ├── config/
│   │   └── index.js                     # Version and environment config
│   └── utils/
│       └── logger.js                    # Logging utility
```

## Stage 4 Additions

- `/resolve-incident` admin command — resolve open incidents with resolution notes
- Case-insensitive ID lookup, empty/duplicate/not-found error handling
- `resolveIncident()` function in incidentLogger with status, timestamp, and attribution

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |

# QUESTPAUSE Sentinel — Project Map (Foundation)

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
│   │   └── sentinelStatus.js            # /sentinel-status
│   ├── config/
│   │   └── index.js                     # Version and environment config
│   └── utils/
│       └── logger.js                    # Logging utility
```

## Foundation State

Current deployment includes only the `/sentinel-status` command.
Persona system, moderation, storage, and remaining commands are planned for future iterations.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Guild ID for dev (empty = global commands) |

# QUESTPAUSE Sentinel

Network safety, moderation, conflict tracking, player report, and personality bot for the QUESTPAUSE Network.

## Principles

- No automatic punishment
- No automatic bans
- No automatic revoke
- No public accusations
- The bot detects, logs, alerts, and suggests — human admins decide

## Current Commands (Stage 6)

| Command | Description | Admin |
|---------|-------------|-------|
| `/sentinel-status` | Display Sentinel bot status and stats | No |
| `/log-incident` | Log a new incident | Yes |
| `/player-history` | View incident and warning history for a player | No |
| `/resolve-incident` | Resolve an open incident | Yes |
| `/add-warning` | Issue a warning to a player | Yes |
| `/resolve-warning` | Resolve an active warning | Yes |

## Storage

Data is stored as JSON files under `src/storage/data/`. The storage layer uses an abstract interface (`src/storage/storeInterface.js`) designed to be swapped for SQLite in a future stage without changing business logic.

Current collections:
- `incidents.json` — incident records
- `warnings.json` — warning records

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`
3. Fill in your Discord credentials:
   - `DISCORD_TOKEN` — bot token from Discord Developer Portal
   - `DISCORD_CLIENT_ID` — application client ID
   - `DISCORD_GUILD_ID` — set to your dev server ID for fast guild command deployment (leave empty for global commands)
4. `npm run deploy-commands` — register slash commands with Discord
5. `npm start` — launch the bot

## Architecture

```
src/
├── index.js                         # Entry point
├── events/
│   ├── ready.js                     # Bot ready event
│   └── interactionCreate.js         # Slash command handler
├── commands/
│   ├── sentinelStatus.js            # /sentinel-status
│   ├── logIncident.js               # /log-incident (admin)
│   ├── playerHistory.js             # /player-history
│   ├── resolveIncident.js           # /resolve-incident (admin)
│   ├── addWarning.js                # /add-warning (admin)
│   └── resolveWarning.js            # /resolve-warning (admin)
├── modules/
│   └── moderation/
│       ├── incidentLogger.js        # Incident CRUD logic
│       └── warningLogger.js         # Warning CRUD logic
├── storage/
│   ├── storeInterface.js            # Abstract storage interface
│   ├── jsonStore.js                 # JSON file implementation
│   └── data/
│       ├── .gitkeep
│       ├── incidents.json           # Incident records
│       └── warnings.json            # Warning records
├── config/
│   └── index.js                     # Version and environment config
└── utils/
    └── logger.js                    # Logging utility
```

## Development Notes

- Use `DISCORD_GUILD_ID` in `.env` to deploy commands instantly to a specific guild during development (global registration can take up to an hour).
- JSON data files under `src/storage/data/` are gitignored and persist across restarts.
- Do not commit `.env` — it contains your bot token.
- For production deployment on Oracle VM, use PM2 (see `DEPLOY.md`).

## Future Planned Features

The following are planned but not yet active:
- Player reports
- Watchlist
- Serious keyword guard
- Admin alerts
- Game personas
- Trigger replies
- Ambient messages

## Deployment

See [DEPLOY.md](DEPLOY.md) for Oracle VM deployment instructions using PM2.

## License

MIT

# QUESTPAUSE Sentinel

Network safety, moderation, conflict tracking, player report, and personality bot for the QUESTPAUSE Network.

## Principles

- No automatic punishment
- No automatic bans
- No automatic revoke
- No public accusations
- The bot detects, logs, alerts, and suggests — human admins decide

## Current Commands (Stage 11)

| Command | Description | Admin |
|---------|-------------|-------|
| `/sentinel-status` | Display Sentinel bot status and stats | No |
| `/report-player` | Report a player for admin review | No |
| `/log-incident` | Log a new incident | Yes |
| `/player-history` | View incident and warning history for a player | No |
| `/resolve-incident` | Resolve an open incident | Yes |
| `/add-warning` | Issue a warning to a player | Yes |
| `/resolve-warning` | Resolve an active warning | Yes |
| `/resolve-report` | Resolve an open player report | Yes |
| `/watch-player` | Add a player to the watchlist | Yes |
| `/unwatch-player` | Remove a player from the watchlist | Yes |

## Active Systems

| System | Description |
|--------|-------------|
| Keyword Guard | Monitors guild text channels for serious keywords and alerts admins via `SENTINEL_ALERT_CHANNEL_ID` |

## Channel Configuration

Control which channels Sentinel monitors with these optional environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `SENTINEL_MONITORED_CHANNEL_IDS` | Comma-separated list of channel IDs to monitor exclusively | `123,456,789` |
| `SENTINEL_BLOCKED_CHANNEL_IDS` | Comma-separated list of channel IDs to always ignore | `111,222` |
| `SENTINEL_BLOCKED_CATEGORY_IDS` | Comma-separated list of category IDs to always ignore | `333,444` |

Behavior:
- If `SENTINEL_MONITORED_CHANNEL_IDS` is set, Sentinel monitors **only** those channels
- If `SENTINEL_MONITORED_CHANNEL_IDS` is empty, Sentinel monitors all guild text channels except blocked channels/categories
- The alert and report channels (`SENTINEL_ALERT_CHANNEL_ID`, `SENTINEL_REPORT_CHANNEL_ID`) are always excluded
- Bot messages and DMs are always ignored regardless of config
- Leave any variable empty to disable its filtering

## Storage

Data is stored as JSON files under `src/storage/data/`. The storage layer uses an abstract interface (`src/storage/storeInterface.js`) designed to be swapped for SQLite in a future stage without changing business logic.

Current collections:
- `incidents.json` — incident records
- `warnings.json` — warning records
- `reports.json` — player report records
- `watchlist.json` — player watchlist records

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`
3. Fill in your Discord credentials:
   - `DISCORD_TOKEN` — bot token from Discord Developer Portal
   - `DISCORD_CLIENT_ID` — application client ID
   - `DISCORD_GUILD_ID` — set to your dev server ID for fast guild command deployment (leave empty for global commands)
   - `SENTINEL_REPORT_CHANNEL_ID` — channel ID for player report alerts (optional)
   - `SENTINEL_ALERT_CHANNEL_ID` — channel ID for keyword guard alerts (optional)
   - `SENTINEL_MONITORED_CHANNEL_IDS` — comma-separated channel IDs to monitor exclusively (optional)
   - `SENTINEL_BLOCKED_CHANNEL_IDS` — comma-separated channel IDs to ignore (optional)
   - `SENTINEL_BLOCKED_CATEGORY_IDS` — comma-separated category IDs to ignore (optional)
4. `npm run deploy-commands` — register slash commands with Discord
5. `npm start` — launch the bot

## Architecture

```
src/
├── index.js                         # Entry point
├── events/
│   ├── ready.js                     # Bot ready event
│   ├── interactionCreate.js         # Slash command handler
│   └── messageCreate.js             # Keyword guard monitor
├── commands/
│   ├── sentinelStatus.js            # /sentinel-status
│   ├── logIncident.js               # /log-incident (admin)
│   ├── playerHistory.js             # /player-history
│   ├── resolveIncident.js           # /resolve-incident (admin)
│   ├── addWarning.js                # /add-warning (admin)
│   ├── resolveWarning.js            # /resolve-warning (admin)
│   ├── reportPlayer.js              # /report-player
│   ├── resolveReport.js             # /resolve-report (admin)
│   ├── watchPlayer.js               # /watch-player (admin)
│   └── unwatchPlayer.js             # /unwatch-player (admin)
├── modules/
│   └── moderation/
│       ├── incidentLogger.js        # Incident CRUD logic
│       ├── warningLogger.js         # Warning CRUD logic
│       ├── reportLogger.js          # Report CRUD logic
│       ├── watchlistLogger.js       # Watchlist CRUD logic
│       ├── keywordGuard.js          # Serious keyword detection
│       └── alerts.js                # Admin alert sender
├── storage/
│   ├── storeInterface.js            # Abstract storage interface
│   ├── jsonStore.js                 # JSON file implementation
│   └── data/
│       ├── .gitkeep
│       ├── incidents.json           # Incident records
│       ├── warnings.json            # Warning records
│       ├── reports.json             # Player report records
│       └── watchlist.json           # Player watchlist records
├── config/
│   ├── index.js                     # Version and environment config
│   ├── keywords.js                  # Serious keyword list
│   └── channels.js                  # Channel allow/block config
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
- Game personas
- Trigger replies
- Ambient messages

## Deployment

See [DEPLOY.md](DEPLOY.md) for Oracle VM deployment instructions using PM2.

## License

MIT

# QUESTPAUSE Sentinel

Network safety, moderation, conflict tracking, player report, and personality bot for the QUESTPAUSE Network.

## Principles

- No automatic punishment
- No automatic bans
- No automatic revoke
- No public accusations
- The bot detects, logs, alerts, and suggests — human admins decide

## Current Commands

| Command | Description | Admin |
|---------|-------------|-------|
| `/sentinel-status` | Display Sentinel bot status and stats | No |

*Additional commands (player reports, incident logging, warnings, watchlist) coming soon.*

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Discord token and client ID
3. Run `npm install`
4. Run `npm run deploy-commands` to register slash commands
5. Run `npm start` to launch the bot

## Deployment

See [DEPLOY.md](DEPLOY.md) for Oracle VM deployment instructions using PM2.

## Architecture

```
src/
├── index.js                  # Entry point
├── events/                   # Discord event handlers
├── commands/                 # Slash command implementations
├── utils/                    # Logger and utilities
└── config/                   # Configuration (version, environment)
```

## License

MIT

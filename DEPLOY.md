# Deployment Guide — QUESTPAUSE Sentinel on Oracle VM

This guide covers deploying QUESTPAUSE Sentinel to an Oracle Linux/Ubuntu VM with PM2 for 24/7 operation, similar to the existing Questpause Bot.

## Prerequisites

- Oracle VM with Linux (Ubuntu 22.04 or Oracle Linux 8+)
- Node.js 20+ installed
- Git installed
- PM2 installed globally (`npm install -g pm2`)
- A Discord Application created with Bot token and required intents

## Production .env Checklist

All variables from `.env.example` are active in Stage 20. Copy and fill every variable:

```bash
cp .env.example .env
nano .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | **Yes** | Discord bot token |
| `DISCORD_CLIENT_ID` | **Yes** | Discord application client ID |
| `DISCORD_GUILD_ID` | Optional | Guild ID for guild-local commands (leave empty for global) |
| `SENTINEL_REPORT_CHANNEL_ID` | Optional | Channel ID for report admin alerts |
| `SENTINEL_ALERT_CHANNEL_ID` | Optional | Channel ID for keyword guard admin alerts |
| `SENTINEL_MONITORED_CHANNEL_IDS` | Optional | Comma-separated channel IDs to monitor exclusively |
| `SENTINEL_BLOCKED_CHANNEL_IDS` | Optional | Comma-separated channel IDs to ignore |
| `SENTINEL_BLOCKED_CATEGORY_IDS` | Optional | Comma-separated category IDs to ignore |
| `ENABLE_PERSONA_REPLIES` | Optional | `true`/`false` — enable game persona trigger replies |
| `PERSONA_REPLY_COOLDOWN_MINUTES` | Optional | Per-channel cooldown for persona replies (default 15) |
| `PERSONA_PLAYER_COOLDOWN_MINUTES` | Optional | Per-player cooldown for persona replies (default 30) |
| `VALHEIM_CHANNEL_IDS` | Optional | Comma-separated channel IDs for Valheim persona |
| `PROJECT_ZOMBOID_CHANNEL_IDS` | Optional | Comma-separated channel IDs for Project Zomboid persona |
| `ICARUS_CHANNEL_IDS` | Optional | Comma-separated channel IDs for ICARUS persona |
| `WINDROSE_CHANNEL_IDS` | Optional | Comma-separated channel IDs for Windrose persona |
| `MINECRAFT_CHANNEL_IDS` | Optional | Comma-separated channel IDs for Minecraft persona |
| `SEVEN_DAYS_TO_DIE_CHANNEL_IDS` | Optional | Comma-separated channel IDs for 7 Days to Die persona |
| `ENABLE_AMBIENT_PERSONA_MESSAGES` | Optional | `true`/`false` — enable ambient persona messages (default false) |
| `AMBIENT_PERSONA_COOLDOWN_MINUTES` | Optional | Cooldown between ambient messages in minutes (default 240) |

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url> /opt/questpause-sentinel
cd /opt/questpause-sentinel
```

### 2. Install Production Dependencies

```bash
npm install --production
```

### 3. Create and Fill .env

```bash
cp .env.example .env
nano .env
```

Fill in at minimum `DISCORD_TOKEN` and `DISCORD_CLIENT_ID`. Add game channel IDs and enable features as needed.

### 4. Register Slash Commands

This registers all 21 commands with Discord:

```bash
npm run deploy-commands
```

### 5. Start with PM2

```bash
pm2 start src/index.js --name questpause-sentinel
```

### 6. Save PM2 Process List

```bash
pm2 save
```

### 7. Enable PM2 Startup (survives reboot)

```bash
pm2 startup
```

Follow the on-screen instructions to enable the systemd startup script.

### 8. Verify It Is Running

```bash
pm2 status
pm2 logs questpause-sentinel --lines 20
```

## Useful PM2 Commands

```bash
pm2 status                          # Check all process statuses
pm2 restart questpause-sentinel     # Restart the bot
pm2 stop questpause-sentinel        # Stop the bot
pm2 logs questpause-sentinel        # Tail live logs
pm2 logs questpause-sentinel --lines 50   # Show last 50 lines
pm2 monit                           # Monitor CPU/memory usage
pm2 flush                           # Clear all logs
```

## Update Workflow

When pulling new bot changes to production:

```bash
cd /opt/questpause-sentinel
git pull
npm install --production
npm run deploy-commands
pm2 restart questpause-sentinel
```

## Backup Note

All live moderation data is stored as JSON files in:

```
src/storage/data/
```

These files include:
- `incidents.json`
- `warnings.json`
- `reports.json`
- `watchlist.json`
- `personaSettings.json`
- `ambientSettings.json`
- `ambientState.json`

**Before redeploying, migrating, or wiping the server**, back up this directory:

```bash
cp -r src/storage/data /path/to/safe/backup/
```

These files are gitignored and will **not** be in the repository. If you delete the bot directory without backing up, all moderation records are lost.

## File Locations

| Path | Purpose |
|------|---------|
| `/opt/questpause-sentinel` | Bot installation directory |
| `/opt/questpause-sentinel/.env` | Environment config (not in git) |
| `/opt/questpause-sentinel/src/storage/data/` | Live JSON data (not in git) |
| `~/.pm2/logs/questpause-sentinel-*` | PM2 log files |

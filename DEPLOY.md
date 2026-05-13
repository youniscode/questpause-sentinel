# Deployment Guide — QUESTPAUSE Sentinel on Oracle VM

This guide covers deploying the Sentinel bot to an Oracle Linux/Ubuntu VM using PM2.

## Prerequisites

- Oracle VM with Linux (Ubuntu 22.04 or Oracle Linux 8+)
- Node.js 20+ installed
- Git installed
- PM2 installed globally

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url> /opt/questpause-sentinel
cd /opt/questpause-sentinel
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Create Environment File

```bash
cp .env.example .env
nano .env
```

Fill in your Discord bot token and client ID:

```
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=           # Leave empty for global commands
```

### 4. Register Slash Commands

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

### 7. Enable PM2 Startup

```bash
pm2 startup
```

Follow the on-screen instructions to enable the startup script.

### 8. Monitor Logs

```bash
pm2 logs questpause-sentinel
```

## Useful PM2 Commands

```bash
pm2 status                    # Check bot status
pm2 restart questpause-sentinel  # Restart the bot
pm2 stop questpause-sentinel     # Stop the bot
pm2 logs questpause-sentinel     # View logs
pm2 monit                       # Monitor resources
```

## Updating

```bash
cd /opt/questpause-sentinel
git pull
npm install --production
pm2 restart questpause-sentinel
```

## File Storage Notes

Storage is not active in the foundation version.

Future JSON data files will be stored in:

`src/storage/data/`

Planned files:
- incidents.json
- players.json
- warnings.json
- watchlist.json
- cooldowns.json

These files should be gitignored and persisted across restarts.

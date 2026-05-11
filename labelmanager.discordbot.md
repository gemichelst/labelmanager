# labelmanager.discordbot.md

## Purpose

This document describes how a Discord bot can consume data from LabelManager OS and turn it into Discord server features, notifications, dashboards, and automations.

The goal is to let a bot read label data safely and present it in channels, threads, slash commands, scheduled digests, and interactive embeds.

---

## Data Sources the Bot Can Read

A Discord bot can consume LabelManager data through one or more of these technical paths:

### 1. JSON backup export

The webapp can export the full database as a JSON file. A bot or companion service can read this file and transform it into Discord messages, embeds, or reports.

### 2. Shared API bridge

A thin HTTP service can expose selected LabelManager collections as read-only endpoints for the bot.

### 3. Webhook relay

LabelManager can emit event payloads to a custom webhook receiver, which then forwards relevant updates to Discord.

### 4. File watcher / sync job

A bot backend can watch regularly updated backup files or synced JSON exports and rebuild its cache from that source.

---

## Technical Capabilities

### Read-only capabilities

- Read artists, contacts, demos, releases, tracks, events, royalties, payouts, media, notes, automations, and integration logs.
- List recent changes and activity events.
- Show status summaries for A&R, releases, finance, and bookings.
- Build Discord embeds from structured records.
- Render tables, leaderboards, and weekly digests.
- Post alerts for new demos, signed deals, release dates, and payout events.
- Create thread-based discussion around a release, artist, or demo.

### Write-adjacent capabilities through bot actions

The bot should not directly mutate LabelManager data unless a trusted bridge is implemented. If write support is added, it should be limited and explicit:

- Mark items for review.
- Add Discord-originated notes.
- Create task suggestions.
- Queue reminder messages.

### Operational capabilities

- Scheduled sync from exported JSON.
- Incremental caching of collections.
- Deduplication of events and notifications.
- Rate limiting for Discord API calls.
- Role-based visibility in Discord channels.
- Multi-guild configuration.
- Per-channel routing for label teams, artists, and managers.

---

## Recommended Architecture

### Option A: Static export + bot reader

Best for simple deployments.

- LabelManager exports JSON backups.
- A Discord bot service loads the latest export.
- The bot maps records to embeds and posts summaries.

### Option B: Bridge API + bot

Best for continuous updates.

- LabelManager writes to a small backend or exposes a read API.
- The Discord bot queries the API on demand.
- The bot also receives webhook events for instant updates.

### Option C: Event pipeline

Best for live automation.

- LabelManager emits webhook events.
- A relay service validates and stores them.
- Discord bot consumes the event stream and posts updates.

---

## Suggested Data Mapping

### Artists

- Discord command: `/artist <name>`
- Output: profile embed, links, territories, active releases, contact notes.

### Demos

- Discord command: `/demo <id>`
- Output: title, artist, genre, status, rating, comments, latest activity.

### Releases

- Discord command: `/release <title>`
- Output: release status, schedule, tasks, assets, campaign steps.

### Finance

- Discord command: `/finance summary`
- Output: income, expenses, payout queue, recoupment status.

### Events

- Discord command: `/event upcoming`
- Output: next shows, venue, date, settlement state, team notes.

### Royalties

- Discord command: `/royalties artist <name>`
- Output: statements, split totals, due payouts, recent changes.

---

## Event Triggers Worth Exposing

A Discord bot becomes useful when it reacts to these LabelManager moments:

- New demo submitted.
- Demo moved to shortlist.
- Contract signed.
- Release scheduled.
- Release published.
- Payout created.
- Invoice or expense added.
- Event confirmed.
- Task due soon.
- Integration error logged.

Each trigger can become a Discord embed, a thread reply, or a channel message depending on severity.

---

## Suggested Discord UX

### Message types

- Compact status cards for routine updates.
- Rich embeds for releases and demo reviews.
- Thread summaries for active campaigns.
- Weekly digests for label management.
- Private admin alerts for sensitive financial events.

### Channel routing ideas

- `#ar-feed` for demo submissions and review updates.
- `#releases` for release milestones.
- `#finance` for payouts and statements.
- `#events` for bookings and settlements.
- `#ops-log` for integration logs and sync errors.

---

## Security Considerations

- Use read-only access by default.
- Never expose secrets, webhook URLs, or auth tokens in Discord.
- Validate backup files before loading them.
- Sign webhook payloads if possible.
- Restrict sensitive data to admin-only channels.
- Add rate limits and audit logs for every bot action.

---

## Implementation Notes

A practical bot stack could look like this:

- Node.js with discord.js.
- Optional small Express/Fastify bridge.
- JSON parser and schema validation.
- Persistent cache in SQLite, Redis, or flat files.
- Webhook signature verification.
- Scheduled sync worker.

---

## Minimum Bot Feature Set

- `/sync` to refresh from the latest exported data.
- `/artist`, `/demo`, `/release`, `/finance`, `/event`, `/royalties` commands.
- Status alerts for new demos and release milestones.
- Embed templates for label data.
- Admin-only settings for channel mapping.

---

## Ideal Next Step

The most robust path is a small read-only bridge API plus a Discord bot that subscribes to LabelManager webhook events and also falls back to backup JSON sync.

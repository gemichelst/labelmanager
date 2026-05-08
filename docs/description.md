bitte erstelle eine erste produktive Version einer labelManager webApp.
Für eine erste produktive Version stelle diese punkte fertig:
1. Artists & Contacts als solides CRM.
2. Demos & A&R mit Submission-Form, Kanban, Audio-Preview, Ratings.[8][9]
3. Releases & einfache Kampagnen-Timelines (Status + Basis-Task-Templates).[2]
4. Media Library mit Upload, Tagging und Waveform-Player.[13][10]
5. Rollen Admin/Label Manager/A&R/Artist mit Basis-RBAC.[3]

Nutze dazu folgende ausführlicher beschreibung samt Vorgehensweise und technischer beschreibung.

Hier ist ein detailliertes Architektur- und Funktions‑Brainstorming für deine Label‑Manager-Webapp als zentrales „Label OS“. Die eigentliche Tiefe steckt als Markdown-Report im angehängten Dokument; unten die komprimierte, praxisorientierte Übersicht.[1]

## Zielbild der Webapp

Die App soll nicht nur „Daten sammeln“, sondern das komplette Tagesgeschäft eines modernen, unabhängigen Labels in einer Oberfläche abbilden: Demos & A&R, Releases, Artist-Management, Bookings, Finanzen/Royalties und Research.[2][3]

Kernideen:
- Single Source of Truth: Artists, Contacts, Tracks, Releases, Verträge, Events und Media sind relational verknüpft, nicht dupliziert über Excel, Notion und Drive.[3]
- Workflow-first: Alles ist in Pipelines/Timelines organisiert (Demo-Pipeline, Release-Timeline, Booking-Journey), ähnlich spezialisierten Tools wie ReleaseLoop, Labeltrackr, Orphiq.[2][4][3]
- Rollen & Portale: Label-Admin, A&R, Artists, Booking, PR/Marketing und Accounting haben eigene Views und Rechte.[2][3]

## Zentrale Module/Funktionsblöcke

### Artists & Kontakte (Label-CRM)

Ein musik-spezifisches CRM, das Artists, Manager, Booker, Promoter, Blogs, Radios und Distributoren als Kontakte verwaltet.[5][6]

Wichtige Punkte:
- Artist-Profil: Aliasse, Territories, Genres/Tags, Status (Development, Core, Legacy), Plattformlinks (Spotify, Beatport, SoundCloud, Ra.co, IG, TikTok, YouTube). Optional: API-Stats (Monthly Listeners, Follower).[2]
- Beziehungsgraph: Verknüpfungen Artist ↔ Manager ↔ Booking-Agentur ↔ PR-Agentur ↔ Co-Writer etc.[5]
- Historie: Alle Releases, Gigs, Deals, Payouts, Promo-Aktionen und internen Notizen hängen am Artist.[2][7]

### Demo- und Track-Pipeline (A&R)

Eine moderne Demo-Engine nach Vorbild LabelRadar/Soundplate: Demos landen nicht im E‑Mail-Chaos, sondern in einer Pipeline.[8][9][10]

Features:
- Branded Submission Page: Eingebettet auf deiner Label-Website mit Feldern für Artist-Daten, Links/Uploads, Genre, Referenzen, Socials, Territory etc.[3][9]
- Audiohandling: Upload oder Link, automatisierte 20–30 s Previews für schnelles Scannen.[8]
- A&R-Kanban: Spalten „Neu → In Review → Shortlist → Gespräch → Offer → Abgelehnt“ mit Ratings, Sternen, Kommentaren, Mentions.[8][9]
- Auto-Responses: Automatisierte Eingangsbestätigungen und höfliche Standard-Absagen.[9]
- Talent-Tracking: Watchlist für vielversprechende Artists, auch wenn (noch) kein Deal entsteht.[8][10]

### Release Planner & Kampagnen-Modul

Der Release Planner generiert aus einem Release-Datum eine rückwärtsgerichtete Timeline mit Tasks, ähnlich ReleaseLoop/Orphiq.[2][4]

- Release-Entity: Typ (Single/EP/Album/Comp), Katalognummer, Artists, Territory, Distributor, Format (Digital, Vinyl, Bandcamp-only).[2]
- Status: Idea → A&R selected → In Production → Mastered → Distributor Setup → Pre-Save → Released → Post-Campaign.[2][4]
- Smart Task Templates: Unterschiedliche Checklisten für Streaming-Single vs. Club-EP vs. Vinyl (Artwork, Distro-Upload, Spotify Editorial Pitch, Content-Plan, PR-Outreach, DJ-Promo).[2]
- Marketing-Kalender: Layer mit Social-Posts, Playlist-Pitches, Blog-Mails, Ad-Flights, alles relativ zum Release-Datum.[2][4]
- Abhängigkeiten: Wenn Release verschoben wird, werden alle Tasks neu gerechnet.[4]

### Vertrags- und Rechteverwaltung

Ein Contract-Modul nach dem Vorbild von Labeltrackr/Monetunes: zentraler „Contract Vault“.[3][7]

- Vertragsarten: Recording-Deal (Artist/Single/EP/Album), Comp-Deals, Remix-Verträge, Lizenzierungen (In/Out), 360°-Deals, Publishing-Agreements.[7]
- Key-Felder: Beteiligte, Territories, Laufzeit, Optionen, Splits, Advances, Recoupable Expenses.[3][7]
- Status & Alerts: Draft/In Negotiation/Active/Expired, Reminder für Optionen/Enddaten.[7]
- Verknüpfung: Contracts sind mit Artists, Releases und Tracks verbunden, dienen später als Basis für die Royalty-Engine.[3]

### Royalties & Finance

Royalty-Modul ähnlich ReleaseLoop/Monetunes mit artist-facing Portal.[2][7]

- CSV-Import: Sales/Royalties von Distributoren (Spotify/Apple-Bundles, Beatport/Juno, Bandcamp, Vinyl-Vertrieb) per Drag & Drop, Mapping auf Releases/Tracks.[2][7]
- Split-Engine: Berechnung von Shares gemäß Verträgen (Label/Artist, Remixers, Co-Labels etc.).[7]
- Expenses & Recoup: Zuordnung von Promo-/Video-/Tourkosten, Recoup-Status pro Artist/Release.[7]
- Statements & Payouts: Periodische PDF-Statements, optional direkt im Artist-Portal einsehbar.[2][7]

### Booking & Event Management

Für Label-Nights und Artists mit Touring-Fokus: Event-/Gig-Modul à la SystemOne/Planning Beats.[11][12]

- Event-Entity: Typ (Clubnight, Festival, Tour-stop, Showcase), Venue, Location, Promoter, Deal-Typ (Fee, Door-Deal, Hybrid), Status (Inquiry, Option, Confirmed, Settled).[11]
- Routing & Riders: Zugeordnete Artists, Timeslots, Tech-/Hospitality-Rider, Travel, Hotel.[11][12]
- Booking-Pipeline: Inquiry → Offer → Negotiation → Booking Agreement → Advance → Show → Settlement.[11][12]
- Kalender: Gig-Übersicht pro Artist, Territory, Zeitraum.[11]
- Settlement: Verknüpfung zum Finance-Modul (Fees, Agentur-Provision, Reisekosten, Settlement-Reports).[7]

### Media Manager & Player mit Waveform

Eine zentrale Asset Library mit integriertem Wellenform-Player für Audio plus Bilder/Videos.[13][2][10]

- Tagging: Typ (Master, Radio Edit, Extended, STEMS, Instrumental, Artwork, Pressfoto, Logo, Social Asset, Reel, Teaser, Video etc.), Artist, Release, Territory-Freigaben.[2]
- Versionierung: Streaming-Master vs. Club-Master vs. Vinyl-Master.[2]
- Waveform-Player: Scrubbing, Loops, Markierungen (Drop, Break, Intro/Outro), Option zur Lautheits-/Key-Anzeige.[10]
- Promo-Links: Zeitlich begrenzte, optional geschützte Download-/Streaming-Links für DJs, Blogs, Radios.[10][14]
- Externe Storage: Anbindung an Google Drive/Dropbox/S3; in der Webapp liegen Metadaten & Links.[2]

### Kalender, Tasks & Automations

Ein globaler Multi-Layer-Kalender plus Task-System.[2][4]

- Layer: Releases, Promo-Tasks, Bookings, interne Meetings, externe Deadlines (z.B. Festival-Bewerbungen, Editorial-Fristen).[2]
- Tasks: Zuweisung an Team/Artists, Prioritäten, Fälligkeitsdaten, Status.[2]
- Automations: z.B. „Neues Release angelegt → Standard-Checklist anlegen“, „Demo auf ‚Offer‘ → Contract Draft + Notify Label Manager“, „Gig confirmed → Itinerary-Taskset erzeugen“.[2][7]

### Rollen & User Management

Feingranulares RBAC-System für unterschiedliche Gruppen.[2][3]

- Basisrollen: Admin, Label Manager, A&R, Artist, Booking, PR/Marketing, Accounting.[3][8]
- Rechte: Modul- und Datensatz-basiert (z.B. Artist darf nur eigene Releases sehen; A&R sieht Demos, aber keine Finanzen).[3]
- Tenancy: Mehrere Labels/Sub-Labels innerhalb einer Instanz (für späteres Skalieren).

## Research- und Intelligence-Layer

### Markt- & Trendforschung

Integrierte Research-Funktionen, damit du nicht ständig Tools springen musst.[4][14]

- Plattformdaten: Aggregation von öffentlich verfügbaren Kennzahlen (Follower, Monthly Listeners, Charts, Playlist-Platzierungen) für deine Artists.[2][13]
- Blog/Curator-Datenbank: Eingebaute Liste von Blogs, Playlists, Radios mit Genres, Submission-Links, Kontaktregeln – inspiriert von großen Blog-Listen und Plattformen wie SubmitHub/Groover.[15][14]
- Demo-Software-Ökosystem: Verlinkungen/Integrationen zu Tools wie LabelRadar, DropTrack etc. (falls du externe Pipelines mitnutzt).[10][8]

### Release-Intelligenz

Ein optionaler „Brain“-Layer (AI/Analytics) nach Orphiq-Vorbild.[4]

- Auto-Timelines: Vorschläge für realistische Vorläufe je Releasetyp und Ziel (Club-EP vs. Algorythmus-Single).[4][2]
- Best-Practice-Templates: Feintuning der Task-Templates anhand deiner historischen Kampagnendaten (open rates, Streaming-Sprünge, Playlist-Picks).[2]
- Kanalempfehlungen: Heuristik, welche Promo-Mischung sinnvoll ist (Blogs vs. Playlists vs. Social vs. Radio) abhängig von Genre/Artist-Level.[14]

### A&R-Scoring

A&R-Scoring-Modul für Priorisierung der Demo-Flut.[8][10]

- Score: Kombiniert internes Rating, Artist-Historie (eigene Releases, Social), externe Indikatoren (Blog-/Playlist-Historie, Demo-Plattform-Signale).[8][14]
- Pipeline-Stats: Conversion-Analytics (Demos → Shortlist → Offer → Signed) zur Optimierung deines A&R-Prozesses.[10]

## UI/UX-Skizze

### Hauptnavigation

Obere/seitliche Hauptnavigation z.B.:

- Dashboard
- Artists & Contacts
- Demos & A&R
- Releases & Campaigns
- Bookings & Events
- Media Library
- Finance & Royalties
- Research & Insights
- Settings & Users

Dashboard zeigt: neue Demos, anstehende Tasks, kommende Releases, nächste Gigs, Finanz-Snapshot.[2][3]

### 360°-Views

- Artist-View: Overview, Music & Releases, Contracts, Financials, Media.[5][7][2]
- Release-View: Overview, Timeline & Tasks, Assets, Promo, Finance.[2][4][7]
- Event-View: Overview, Itinerary, Documents, Finance.[11][12][7]



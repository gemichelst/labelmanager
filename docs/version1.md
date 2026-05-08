Hier ist eine produktive **erste Version** für deine Label-Manager-WebApp als umsetzbarer MVP-Plan plus technische Blaupause. Ich orientiere mich an deinem Zielbild „Label OS“ und fokussiere exakt auf die fünf Module, die du für die erste produktive Version genannt hast. [drive.google](https://drive.google.com/file/d/1TbKt0NaQY1nki2bFHXdPZyunDA9E5PE0/view?usp=drivesdk)

## Produktziel

Die App sollte als zentrales Arbeitswerkzeug für ein Label funktionieren: Kontakte/Artists, Demos/A&R, Releases/Kampagnen, Media und Rollen/Rechte in einem zusammenhängenden Datenmodell. Für Audio-Uploads und Library-Workflows sind Upload, Batch-Verarbeitung und Playback mit Waveform sinnvoll, weil solche Libraries bereits genau dafür genutzt werden: zentral speichern, hochladen, tracken und schnell abspielen. [help-v2.reelcrafter](https://help-v2.reelcrafter.com/article/153-uploading-audio-to-your-library)

## MVP-Scope

Die produktive erste Version sollte diese fünf Bereiche vollständig abdecken: solides CRM für Artists & Contacts, Demo-Submission mit A&R-Kanban und Audio-Preview/Ratings, Release-Timelines mit Status und Task-Templates, Media Library mit Upload/Tagging/Waveform-Player sowie RBAC mit Admin/Label Manager/A&R/Artist. Das passt auch zu etablierten Workflow-Patterns aus Demo-Review, Audio-Libraries und rollenbasierten Zugriffskonzepten. [labelspark](https://labelspark.com/resources/demo-review-guide)

## Informationsarchitektur

Die Navigation sollte schlicht und workflow-orientiert sein: Dashboard, CRM, Demos & A&R, Releases, Media Library, Users & Roles, Settings. Die App sollte auf einer relationalen Kernstruktur basieren, damit Artists, Contacts, Releases, Tracks, Files, Ratings und Tasks sauber verknüpft statt doppelt gepflegt werden. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_16a7e238-0c16-4e16-9434-3fbb60aeb0ed/c5411c42-c8c1-4a3d-9107-b7126855f086/refactoringjavascript.epub.txt)

## Funktionale Module

### 1. Artists & Contacts CRM
- Artist-Profile mit Alias, Territorien, Genres, Links, Status und Notizen.
- Contacts mit Typen wie Manager, Booker, PR, Distributor, Blog, Radio, Promoter.
- Relationen wie Artist ↔ Manager, Artist ↔ Release, Contact ↔ Company, Contact ↔ Artist.
- Chronik für Interaktionen, Notizen, Follow-ups und Attachments. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_16a7e238-0c16-4e16-9434-3fbb60aeb0ed/c5411c42-c8c1-4a3d-9107-b7126855f086/refactoringjavascript.epub.txt)

### 2. Demos & A&R
- Öffentliche oder eingebettete Submission-Form mit Name, E-Mail, Artist, Genre, Links, Uploads und Kurznotiz.
- Kanban-Spalten: Neu, In Review, Shortlist, Gespräch, Offer, Abgelehnt.
- Audio-Preview direkt in der Card, plus Sterne-/Score-Rating und interne Kommentare.
- Automatische Dankesmail nach Submission und Standard-Antworten für Ablehnungen. [help-v2.reelcrafter](https://help-v2.reelcrafter.com/article/153-uploading-audio-to-your-library)

### 3. Releases & Campaigns
- Release-Entität mit Typ, Katalognummer, Artists, Datum, Territory, Status.
- Timeline wird rückwärts vom Release-Datum erzeugt.
- Basis-Task-Templates pro Releasetyp, z. B. Artwork, Pre-Save, Distributor Upload, Pitch, Social Assets.
- Statuskette: Idea, In Production, Mastered, Setup, Scheduled, Released, Post-Campaign. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_16a7e238-0c16-4e16-9434-3fbb60aeb0ed/c5411c42-c8c1-4a3d-9107-b7126855f086/refactoringjavascript.epub.txt)

### 4. Media Library
- Upload per Drag & Drop und klassischer Dateiauswahl.
- Tagging nach Typ, Artist, Release, Version, Territory, Freigabe.
- Waveform-Player für schnelles Scrubbing und Review.
- Track-Metadaten, Preview-Generierung und klare Vorschau für interne Nutzung. [github](https://github.com/arraypress/waveform-player)

### 5. Rollen & RBAC
- Admin: alles.
- Label Manager: alles außer kritische System-/Billing-Settings.
- A&R: CRM lesen, Demos bewerten, Releases sehen, aber keine Finanzen.
- Artist: nur eigene Releases, eigene Demos, eigene Medien und Freigaben.
- Rechte auf Modul- und Datensatzebene, nicht nur auf Seitenebene. [help.asana](https://help.asana.com/s/article/role-based-access-control-with-custom-roles)

## Empfohlene Architektur

Ich würde das als moderne Full-Stack-App mit klarer Trennung bauen: Frontend, API, Worker, Storage. Für die Domäne ist eine relationale DB der richtige Kern, weil du viele Beziehungen zwischen Artists, Releases, Files, Tasks und Rollen brauchst. Die Medien liegen in S3-kompatiblem Storage, während Previews, Waveforms und Thumbnails asynchron über Worker erzeugt werden. [drive.google](https://drive.google.com/file/d/1UBus1Mss7Y_eJHeDhBcOp27wEpUMyi_3/view?usp=drivesdk)


## Datenmodell

Die ersten Kern-Entities sollten so aussehen:
- `users`
- `roles`
- `artists`
- `contacts`
- `artist_contacts`
- `submissions`
- `submission_reviews`
- `releases`
- `release_tasks`
- `media_assets`
- `media_tags`
- `activity_logs`

Das Wichtigste ist, dass Demo, Release und Media jeweils an Artist/Contact/Release gebunden werden können, damit du später Finanzen, Contracts oder Booking ohne Umbau ergänzen kannst. [drive.google](https://drive.google.com/file/d/1TbKt0NaQY1nki2bFHXdPZyunDA9E5PE0/view?usp=drivesdk)

## UI-Struktur

Ein gutes Produktions-UI wäre:
- Dashboard mit offenen Demos, fälligen Tasks, nächsten Releases.
- CRM mit Listen- und Detailansicht.
- Demos als Kanban plus Detaildrawer.
- Releases mit Timeline-Ansicht.
- Media Library mit Grid, Filterchips und Player.
- Rollenverwaltung mit Nutzerliste und Berechtigungen.
- Globale Suche über Artists, Contacts, Releases und Files. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_16a7e238-0c16-4e16-9434-3fbb60aeb0ed/c5411c42-c8c1-4a3d-9107-b7126855f086/refactoringjavascript.epub.txt)

## Produktionsreife

Für eine erste produktive Version würde ich diese Dinge direkt mitbauen:
- Audit-Log für kritische Aktionen.
- Soft Deletes für wichtige Datensätze.
- Upload-Validierung, Größenlimits und Viren-Scan optional.
- Realtime-Updates für Kanban/Tasks optional.
- Mobile-first UI und schnelle Detailseiten.
- Backups, Migrations, Rollen-Seed und Demo-Daten. [drive.google](https://drive.google.com/file/d/1UBus1Mss7Y_eJHeDhBcOp27wEpUMyi_3/view?usp=drivesdk)

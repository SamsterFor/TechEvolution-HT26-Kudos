# Förklaring av ändringarna

Det här dokumentet förklarar skillnaden mellan upstream-repot:

<https://github.com/ffcg/TechEvolution-HT26-Kudos>

och det här repot:

<https://github.com/SamsterFor/TechEvolution-HT26-Kudos>

## Sammanfattning

Det här repot bygger på upstream-repot och innehåller därefter fem egna commits.

Upstream-repot ligger på commit `ac50635`, medan det här repot ligger på
commit `62da302`.

Upstream innehåller främst React-, TypeScript- och Vite-grunden samt
projektets dokumentation. Det här repot har dessutom fått en första fungerande
version av Kudos-formuläret, validering och lagring i webbläsaren.

## Ändringar commit för commit

### `667135d` – Projektplannering dokumenteras

Den här commiten dokumenterar gruppens beslut och frågor inför utvecklingen.

Ändringar:

- Lade till beslut i `.ai/domain-model.md`.
- Dokumenterade regler för:
  - tomma meddelanden
  - meddelanden som bara består av mellanslag
  - långa meddelanden
  - vad som ska visas när feeden är tom
  - lagring efter en siduppdatering
  - kollegor som inte längre finns i kollegolistan
  - var valideringen ska ligga
- Lade till frågor och antaganden i `docs/01-build.md`.
- Tog bort några `peer`-markeringar från `package-lock.json`.

Den här commiten ändrade främst dokumentation och projektets planering. Den
lade inte till någon ny användarfunktion.

### `d233f17` – added kudos post

Det här är den första större funktionella ändringen. Den ersätter
placeholder-sidan med ett fungerande formulär för att skicka Kudos.

#### `src/App.tsx`

- Lade till en riktig startsida för Kudos.
- Lade till rubriken “Send a kudos”.
- Lade till möjlighet att välja vem som skickar Kudos.
- Kopplade sidan till `useKudos`.
- Lade till `SendKudosForm`.

#### `src/SendKudosForm.tsx`

Formuläret innehåller:

- val av mottagare
- textfält för meddelande
- val av kategori
- teckenräknare
- validering av varje fält
- felmeddelanden
- bekräftelse när en Kudos har skickats
- felmeddelande om lagringen misslyckas

Formuläret:

- tillåter inte tomma meddelanden
- tillåter inte meddelanden som bara består av mellanslag
- begränsar meddelanden till 500 tecken
- visar fel när mottagare eller kategori saknas
- behåller användarens text om lagringen misslyckas

#### `src/kudos.ts`

Lade till den centrala datamodellen för Kudos.

Den innehåller:

- kategorierna:
  - Teamwork
  - Extra mile
  - Mentorship
  - Craft
  - Customer impact
- typen `Kudos`
- typen `KudosDraft`
- gränsen `MAX_MESSAGE_LENGTH` på 500 tecken
- validering av Kudos
- skapande av nya Kudos
- generering av unikt ID
- skapande av tidsstämpel

Kollegorna hämtas från:

```text
data/colleagues.json
```

#### `src/useKudos.ts`

Lade till lagring av Kudos i webbläsarens `localStorage`.

Funktionaliteten:

- sparar poster under nyckeln `kudos`
- läser tidigare sparade poster när sidan laddas
- sorterar posterna med nyast först
- läser lagringen igen innan en ny post sparas
- minskar risken att poster från en annan webbläsarflik skrivs över

#### `src/index.css`

Bytte ut Vite-standardens styling mot en egen layout.

Stylingen innehåller bland annat:

- ljus bakgrund
- kortlayout för formuläret
- färger och typografi
- styling för knappar och formulärfält
- fokusmarkeringar för tangentbordsanvändning
- tydliga felmeddelanden
- responsiv layout för mindre skärmar

### `f2ebb1e` – uppdatera krav från ledningen

Lade till filen `docs/02-evolution.md`.

Den dokumenterar nya krav från ledningen:

- Appen ska kunna visa vilka kollegor som inte har fått någon Kudos på sju
  dagar.
- Översikten ska kunna sorteras, till exempel efter roll.
- Appen ska använda branding som är inspirerad av Forefronts publika webb.

Den här commiten dokumenterar kraven, men implementerar dem inte ännu.

### `e4cabfe` – validering och säkrare lagring

Den här commiten förbättrar hanteringen av sparade Kudos.

#### Förändringar i `src/kudos.ts`

Lade till funktionen `isKudos`.

Den kontrollerar att en sparad post har:

- ett giltigt ID
- en avsändare
- en mottagare
- ett meddelande som inte är tomt
- en giltig kategori
- en giltig tidsstämpel

#### Förändringar i `src/useKudos.ts`

- Trasig JSON i `localStorage` behandlas som ogiltig lagring.
- Felaktiga eller ofullständiga poster accepteras inte.
- Sorteringen görs på en kopia av arrayen i stället för att ändra
  originalarrayen.
- Lagringen och React-state hålls sorterade med nyast först.
- Lagringsnyckeln exporterades som `KUDOS_STORAGE_KEY`.

Det här gör lagringen mer robust och förhindrar att skadade poster används av
appen.

### `62da302` – Added a folder for structuring the project

Den här commiten gör främst en omorganisering av projektet.

Flytten var:

```text
src/SendKudosForm.tsx
```

till:

```text
src/send-kudos/SendKudosForm.tsx
```

Importen i `src/App.tsx` uppdaterades samtidigt.

Ingen funktionell beteendeförändring gjordes. Ändringen gör projektet lättare
att strukturera när fler Kudos-relaterade komponenter läggs till.

## Vad appen kan göra nu

Den nuvarande appen kan:

1. välja vem som skickar en Kudos
2. välja en kollega som mottagare
3. skriva ett meddelande
4. välja en kategori
5. validera formuläret
6. skapa en Kudos med ID och tidsstämpel
7. spara Kudos i `localStorage`
8. läsa tillbaka sparade poster efter en siduppdatering
9. sortera sparade poster med nyast först
10. hantera ogiltiga eller trasiga sparade data

## Viktig begränsning just nu

`useKudos()` sparar posterna och returnerar dem som `kudos`, men
`src/App.tsx` renderar ännu inte själva listan med Kudos.

Det innebär att användaren kan:

1. fylla i formuläret
2. skicka en Kudos
3. få bekräftelsen “Kudos sent!”
4. få posten sparad i `localStorage`

Men den skickade Kudos visas inte ännu som en feed på sidan.

Kravet om att visa kollegor som inte fått Kudos på sju dagar och kravet på
sortering av översikten är också fortfarande bara dokumenterade i
`docs/02-evolution.md`.

## Skillnaden mot upstream

Upstream-repot innehåller:

- React + TypeScript + Vite-grunden
- projektets dokumentation
- domänmodellens grund
- kollegolistan
- en placeholder-sida

Det här repot innehåller dessutom:

- Kudos-domänmodell
- formulär för att skicka Kudos
- validering
- kategorier
- teckenbegränsning
- `localStorage`-persistens
- validering av sparad data
- egen styling
- nya evolutionskrav
- organiserad mappstruktur för formulärkomponenten

Kort sagt har repot gått från en tom React/Vite-grund till en första fungerande
MVP för att skapa och spara Kudos, men själva feeden och översikten återstår.

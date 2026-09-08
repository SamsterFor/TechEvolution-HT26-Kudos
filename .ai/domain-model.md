# Domain model

Required reading before you write a line of code — see `docs/01-build.md`.

Living document. When you decide something — especially answers to "Still
open" below — write it here. An outdated file lies to the next reader and to
their AI tool.

## The entity

The whole app is one entity. A Kudos is a short, public, positive message
from one colleague to another, tagged with a category.

| Field | Meaning | Notes |
| --- | --- | --- |
| `id` | Unique identifier | Generate it, don't derive it from content |
| `from` | Who sent it | A colleague id, see `data/colleagues.json` |
| `to` | Who receives it | A colleague id |
| `message` | The shoutout | Short — decide a max length and enforce it |
| `category` | What kind of praise | One of a fixed set, see below |
| `createdAt` | When it was sent | Store and display however you decide |

## Categories

A closed set, not free text:

- `TEAMWORK` — made the team better, not just the ticket
- `EXTRA_MILE` — went beyond what anyone asked for
- `MENTORSHIP` — made someone else more capable
- `CRAFT` — quality of the work itself
- `CUSTOMER_IMPACT` — the client felt the difference

## People

Mock data only — `data/colleagues.json`, same list for every team. No
sign-up, no login, no profile. "The current user" is whoever is selected in
the UI. Don't build user management.

## Product rules

From the brief. Build them as specified.

- **Self-kudos are a feature, not a bug.** People under-report their own
  wins. Posting a kudos to yourself is allowed, and it appears like any other. No need to bring this up, the developers are aware of it.
- **A kudos is immutable once sent.** No editing.
- **The feed is newest first.** Always.
- **No limit on how many kudos one person can send.**

## Still open — yours to decide

There's no single right answer to any of these. There is a wrong answer:
"we never thought about it." Write your answer and reason here as you settle
each one, or log it under Decisions below.

- Can `message` be empty? Whitespace only? Very long?
- What does the feed show when it's empty?
- Does anything survive a page refresh — and if so, how?
- If a kudos references a colleague no longer in the list, what happens?
- Where does validation live, and is it in one place or several?
- How do you keep things fast as the feed grows — recompute on every render,
  or keep a running total somewhere?

## Deliberately out of scope

Authentication. A backend. A database. Notifications. Editing a sent kudos.
Comment threads. Rich text. Image uploads. If you're building any of these,
you've drifted.

## Decisions

Short entries as you build — not documentation, just the call and the reason:

- Can `message` be empty? Nej, antingen förvalt eller eget meddelande. För att det blir för vagt och tar bort sytet av en hyllning.
- Whitespace only? Nej, det behöver finnas ett meddelande av något slag. För att det blir för vagt och tar bort sytet av en hyllning att inte ha ett meddelande till.
- Very long? Längden beror på utseende, men inte för lång.
  Send-form implementation: maximum 500 characters, enforced in the field and before sending, to keep kudos short. Leading and trailing whitespace is trimmed when saved.
- What does the feed show when it's empty? ett informativt meddelande. För att det underlättar agerande för användaren.

- Does anything survive a page refresh — and if so, how?
För att skydda användarens arbete vid refresh bör poster sparas som minst i localStorage. Eventuellt Cookies.
- If a kudos references a colleague no longer in the list, what happens?
(Eventuellt markera raden/användaren). Ingenting händer i första stadiet då inlägg redan finns. För att hålla kvar en historik och för att det är den enklaste lösningen med tanke på tidsramar.
- Where does validation live, and is it in one place or several?
Både individuellt per fält och en för hela posten innan man skickar. Samt för radering av en befintlig post. För att det är en bra standard.
- How do you keep things fast as the feed grows — recompute on every render,
  or keep a running total somewhere?
Paus  

We chose ___ because ___.

### Implemented decisions

The following decisions are now reflected in the implementation:

- `message` cannot be empty or contain only whitespace. A Kudos should always
  contain an actual message.
- A message can contain a maximum of 500 characters. The limit is enforced
  both by the form field and by validation before a Kudos is created.
- Leading and trailing whitespace is trimmed before a Kudos is saved.
- The sender and recipient are selected from `data/colleagues.json`. The app
  stores colleague IDs rather than display names.
- Categories are a closed set: `TEAMWORK`, `EXTRA_MILE`, `MENTORSHIP`, `CRAFT`
  and `CUSTOMER_IMPACT`. Users cannot create custom categories.
- A Kudos contains a sender, recipient, message, category, unique ID and
  creation timestamp. The ID and timestamp are generated when the Kudos is
  sent.
- Validation is shared in `src/kudos.ts` through `validateKudos` and
  `createKudos`. The form also displays field-level errors after interaction.
- Sent Kudos are stored in browser `localStorage` under the key `kudos`. This
  allows data to survive a page refresh without a backend or database.
- Stored data is validated when it is read. Invalid JSON or records that do
  not match the Kudos model are treated as invalid storage.
- Stored Kudos are sorted newest first. Sorting is performed on a copy so the
  loaded array is not mutated.
- `localStorage` is read again before saving a new Kudos. This helps preserve
  Kudos that may have been sent from another browser tab.
- The visible feed and overview have not been implemented yet. The decisions
  about an empty feed, the seven-day overview and overview sorting therefore
  remain future work..

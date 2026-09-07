# Session 1 — Build

**Monday 14:30–16:30 · in groups of 3–4**

Goal: a working MVP. That's the whole target — no mandatory extra feature.

## Before anyone opens an editor (10 min, whole group)

Read `.ai/domain-model.md` together, out loud. Skim `.ai/architecture.md`
for the shape — no backend, and the stack is already picked for you.

Then write down, separately:

1. **Questions** you have.
- Menas 'closed set' att både kategori-namnet och beskrivningen ska visas för en post eller är beskrivningen en förklaring för oss utvecklare?

2. **Assumptions** you're making instead of asking.
- Kan förklaring av kategori fyllas i som text och sedan lämna utrymme för användaren att fylla i en egen text?
3. **What's already decided** — the product rules and fixed fields in
   `.ai/domain-model.md`, so you don't reopen them.

Then start.

## MVP (everyone builds this)

1. **Send a kudos.** A form with: pick a recipient from the mock colleague list,
   write a message, choose a category. Sending clears the form. The recipient
   list includes the current user — self-kudos are part of the product, see
   `.ai/domain-model.md`.
2. **See the feed.** All kudos, newest first, each showing who sent it, who got
   it, the message, the category and when.

That is it. If both work and you can demo them, you have passed the MVP bar.

## Extra feature — only if you finish early

A working MVP you can defend beats an extra feature you can't. Pick at most
one, and only once the MVP works end to end. **Coordinate with the other
groups so you all pick something different** — tomorrow you present to
another team, and it is much more interesting if your app does something
theirs did not.

- **Reactions.** A 👏 counter on each kudos. Clicking adds one. Keep it simple —
  a single number on the kudos, no need to track who clapped. It is applause,
  not a vote.
- **Filtering.** Filter the feed by recipient, sender, or category.
- **Leaderboard.** Who has received the most kudos.
- **Something you thought of.** Clear it with a facilitator first — the bar is
  that it fits in the time and touches the data model.

When you're deciding where code goes or how state should flow, point your AI
tool at `.ai/architecture.md` specifically, rather than your whole `.ai/`
folder — practice handing an agent the one file that's actually relevant.

## Setting up

**Fork this repo first.** Your group works in your own fork and pushes there —
one fork per group, not per person. Whoever forks it adds the rest of the group
as collaborators, so everybody can push.

The stack is given: React + TypeScript (Vite), already scaffolded in `src/`.
`npm install && npm run dev` and you are running — what you get is a placeholder
heading and nothing else. Build the Kudos Wall on top of it. Use
`data/colleagues.json` for the colleague list — it is the same for every group,
which makes tomorrow's comparisons fair.

## As you go

Log 2–3 decisions in `.ai/domain-model.md` under **Decisions** — just the
call and the reason, e.g. "We chose to persist to localStorage because losing
the feed on refresh felt broken." Not documentation, a trail.

Partway through, a facilitator will stop the room and ask what you chose not
to build, and what AI suggested that you said no to. Be ready to answer.

## Done means

- [ ] It runs from a clean clone, following your own README
- [ ] MVP works: you can send a kudos and see it in the feed
- [ ] `.ai/domain-model.md` has your answers to "Still open" and 2–3
      Decisions
- [ ] The README still matches how your app actually runs
- [ ] The product rules in `domain-model.md` are implemented as written
- [ ] Everyone in the group can explain every part of it — not just the
      person who wrote it
- [ ] Committed and pushed

## Two hours goes fast

Get the MVP working end to end before you make anything look good. A working ugly
feed beats a beautiful form that does not submit.

# Walkthrough script — English (5 minutes)

Only the game on screen, no code. It follows the brief's list, item by item:
"Demonstrate the core interaction, progression or ending, CTA, restart, and one important edge case. Talk through your key decisions, advertiser connection, time spent, tools and reused work, testing, limitations, and the most important changes you made."

The lines marked `>` are what you say. **Do** is what you do in the game. Not part of the ZIP.

## Setup

- Start the server (`python -m http.server 8000`) and open `http://localhost:8000/`.
- DevTools in device mode at 390x844, with the Console tab visible. Sound on. Page freshly loaded.
- Have one other browser tab open, for the hidden-tab demo.

---

# Part 1 — Demonstrate · 0:00 to 2:20

## 1 · Intro — 0:00 to 0:15

**Do:** nothing yet. The "How to play" tutorial is on screen.

> Hi, I'm Davy, and this is Scrambly Merge, a playable I made for Scrambly. I'll show you the game first, and then I'll talk about how I made it.

## 2 · Core interaction — 0:15 to 0:45

**Do:** click Play. Drop a few balls and make a merge. Tap the Next bubble once (swap). Press Shake once.

> So here's how it plays. I drag to aim, and I let go to drop. Two equal balls turn into the next one. There are eight levels, and the last one is the Scrambly coin.
>
> I can tap Next to swap my ball. And if I get stuck, Shake kicks everything around.

## 3 · Progression — 0:45 to 1:15

**Do:** reach the Discover step (and Play, if possible). Point at the banner, the track and the balance.

> The game has three steps: Discover, Play and Redeem. When I get to a step, a banner shows up and explains it. The bar at the top lights up, and my balance goes up.
>
> I also get one more Shake. So I play, I get a reward, and I use it in the game.

## 4 · Ending and CTA — 1:15 to 1:45

**Do:** reach the end screen (a win, or a loss if the win does not come). Click "Explore Scrambly" with the console visible.

> The game can end in two ways. Either I reach the coin, or a ball stays above this line for two seconds. Both endings show the same card, with the steps I reached.
>
> Now watch the console when I click the CTA. I get a local message, the click is logged, and the page doesn't go anywhere.

## 5 · Restart — 1:45 to 2:00

**Do:** click "Play again", then the Restart button two or three times.

> Let me restart a few times. The button is always there, and every restart is a clean start. Nothing is left from the last game.

## 6 · Edge case: the hidden tab — 2:00 to 2:20

**Do:** drop a ball, switch to the other tab for a few seconds, come back.

> And here's my edge case: the hidden tab. That happens all the time with ads. I switch tabs, the game stops, the sound stops. And when I come back, there's no time jump. It just continues.

---

# Part 2 — Talk through · 2:20 to 5:00

**Do:** keep the game on screen. Play slowly while you talk, or leave it on the first screen after a restart.

## 7 · Key decisions — 2:20 to 2:55

> Now, my key decisions. First, the mechanic. I picked a merge game because everybody gets it in a few seconds, and that left me time to polish.
>
> Second, the tech. I usually work in Unity, making WebGL casino games. But for an ad, I wanted something small that opens fast. So this is plain JavaScript and Canvas, with no engine and no build step. The whole thing is about two megabytes.
>
> And third, both endings show the CTA. So even if you lose, you still get the invitation.

## 8 · Advertiser connection — 2:55 to 3:20

> About the connection to Scrambly. The product has three steps: discover, play and redeem. A merge game is basically a chain that goes up. So I put those three steps on the chain, and the game explains each one when you get there.
>
> The balance always says "Demo balance". No real money, and no promise of earnings.

## 9 · Time, tools and reused work — 3:20 to 3:50

> I spent about four hours on this. One thing you should know: the first hour of my process recording got corrupted. That hour was the concept and the project setup, and the result is in the repo.
>
> For tools, I worked with Claude Code. The AI gave me a plan and a first draft, and I reviewed and tested every change. I reused Matter.js for the physics, the Fredoka font, the fox from the Scrambly kit, and two audio files from Pixabay. The balls and the other sounds are made in code.

## 10 · Testing and limitations — 3:50 to 4:15

> I tested on desktop, in DevTools device mode at the two portrait sizes, and on a real iPhone. I checked the win, the loss, the CTA, the restarts, the hidden tab and the mute button.
>
> Some limitations. It's portrait only, so a phone held sideways gets a rotate message. The tutorial shows only once. And I didn't test Android or Firefox.

## 11 · Most important changes — 4:15 to 4:50

> And the most important changes. The first version worked, but honestly, it looked plain and it was too simple.
>
> So I did a visual pass: a new jar, new ball colors, and better game feel. The physics felt sticky, so now the balls slide and squash a little when they hit.
>
> Then I added swap, shake and the combo bonus, to give the player more to do. And I added sound, music and the tutorial.
>
> I also fixed two things I found while playing. The danger line was flashing on every drop. And sometimes the game opened with a blank screen. The AI said it was the browser cache, but I found the real error in the console.

## 12 · Closing: thinking in Unity — 4:50 to 5:15

> One last thing. This stack was new for me, so I had to connect everything to what I know from Unity.
>
> The game loop here is my Update and FixedUpdate. Restart is like reloading the scene. The hidden tab is like OnApplicationPause. And the merge follows a rule I learned in Unity: never change the world inside a collision callback.
>
> So the tools were new, but the thinking was the same. And that's how I got this done in four hours.
>
> That's it. Thanks for watching!

---

## Checklist against the brief

| The brief asks for | Block |
|---|---|
| Core interaction | 2 |
| Progression or ending | 3 and 4 |
| CTA | 4 |
| Restart | 5 |
| One important edge case | 6 |
| Key decisions | 7 |
| Advertiser connection | 8 (and shown in 3) |
| Time spent | 9 |
| Tools and reused work | 9 |
| Testing | 10 |
| Limitations | 10 |
| Most important changes | 11 |
| (extra) How Unity experience guided the work | 12 |

## Before recording

- **Read it aloud, do not memorize it.** Use each block as a list of topics and say it your way.
- **Rehearse with a timer.** Part 1 should end near 2:20. The ending takes the most time: after showing Discover, stack balls above the line on purpose and finish with the loss. The card and the CTA are the same as in a win.
- **To reach Discover quickly:** the first six drops are always small balls, so pairs can be stacked right away.
- **Statements to confirm**, because I inferred them: "I wanted something small that opens fast" as your reason for not using Unity, "about four hours" (the day's commits run from 10:26 to 15:03), and the testing list in block 10, which must match what you really checked.

# Note Taking App

A simple app to help you make notes with no distractions.

I built this app from scratch in vanilla JavaScript, without frameworks or libraries, to really understand how the DOM, events and browser storage work together. Notes save automatically as you type, get their own colour, and stay there after a reload.

## Features

- Add a new note with the ➕ button
- Type directly into each note (up to 500 characters)
- Notes save automatically while you type
- Every new note gets a random light colour
- Change a note's colour with its 🎨 button (picks a new random colour)
- Delete a single note with its **x** button
- Remove all notes at once
- Notes and their colours persist after a page reload (`localStorage`)
- Note text is displayed safely as plain text, never as HTML

## How to run

1. Download or clone the project.
2. Open the folder in VS Code and start it with the **Live Server** extension (or any other local server, for example `npx serve`).

Nothing needs to be installed for the app itself. A local server is needed because `script.js` is loaded as a JavaScript module (`type="module"`) so it can import `colors.js`. Browsers block modules when `index.html` is opened directly from the file system (`file://`).

## Project structure

```
index.html   – page structure (title, ➕ button, notes container, remove-all button, footer)
styles.css   – layout and styling
script.js    – all app logic (loaded as a module)
colors.js    – the list of 50 note colours, exported as `colors`
cloudy.svg   – favicon
```

## How it works

The app follows one simple rule: **`notesArray` is the single source of truth, and the page is drawn from it.**

```
user action ──► change notesArray ──► saveNotesToLocalStorage() ──► renderTheNotes()
                                                                        │
                       page reload ──► load notesArray from localStorage ┘
```

### Data

Each note is an object stored in `notesArray`:

```js
{ id: 1760612345678, text: "Buy milk", color: "lightblue" }
```

The `id` comes from `Date.now()`, so ids never repeat, even after a reload.

The `color` is one of the 50 light CSS colour names in `colors.js` (for example `lightpink`, `khaki`, `powderblue`). It is picked at random with `Math.floor(Math.random() * colors.length)`. Because the colour is saved inside the note object, it is stored in `localStorage` together with the text. Notes created before this feature have no `color`, so they keep the default style from the CSS.

### Main functions

| Function                    | What it does                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `getRandomId()`             | Returns a unique id based on the current timestamp                                          |
| `pushToNotesArray()`        | Adds a new empty note with a random colour to `notesArray` and saves it                     |
| `saveNotesToLocalStorage()` | Writes `notesArray` to `localStorage` as JSON                                               |
| `renderTheNotes()`          | Builds the HTML for every note, applies each note's colour and attaches the event listeners |

### Events

- **➕ click**: `pushToNotesArray()`, then `renderTheNotes()`
- **Typing in a note**: copies `textarea.value` into `note.text` and saves
- **🎨 click**: picks a new random colour, saves it to `note.color`, sets the note's `backgroundColor` and saves
- **x click**: removes the note's element, removes it from `notesArray` with `findIndex` + `splice`, and saves
- **Remove all notes**: empties `notesArray`, removes the `myNotes` key from `localStorage` and clears the page
- **Page load**: `notesArray` is loaded from `localStorage`, and `renderTheNotes()` is called once at the bottom of the script

### Layout

Each note has two small buttons in its top-right corner: 🎨 for colour and **x** for delete. Both are positioned with `position: absolute` above the textarea. The textarea background is now `transparent`, so the colour set on the note `div` shows through.

The ➕ button and the notes container are wrapped in a `.notes_board` flex container. `.all_notes` uses `display: contents`, so each note sits in the same row as the ➕ button and wraps onto new lines.

## Things I learned

- Whitespace inside `<textarea>...</textarea>` becomes part of its value.
- Event listeners receive the event object as their argument, not your own data.
- `querySelector` needs `#` for ids, and CSS id selectors can't start with a digit.
- Where a variable is declared (scope) decides whether it remembers its value.
- Delaying a save (debouncing) can make the page and the data get out of sync.
- A render function should only draw the data, not change it.
- Putting user text into `innerHTML` lets the browser read it as HTML. Setting `.value` is safe.
- `import`/`export` only work in a `<script type="module">`, and modules need a local server instead of `file://`.
- Saving extra data (like a colour) on the note object means `localStorage` remembers it automatically.

## Use of AI

I used AI (Perplexity Computer) as a debugging partner and tutor while building this app. I wrote the code myself and found the bugs by testing. I used AI to understand why things went wrong and how to fix them. Below is every time I used it.

| #   | Problem                                                         | What the AI did                                                                                                                                                                                                                                     | How much it helped                                                                                  |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | `note.text` filled up with `\t\t\t` tabs                        | I asked for **no answer, only a hint**. The AI made an interactive step-by-step visualisation of my code that showed the whitespace and pointed to the textarea lines.                                                                              | **Medium.** I found and fixed the bug myself, by removing the whitespace between the textarea tags. |
| 2   | Deleting a single note didn't work                              | Explained the problems: `x` used before it was defined, the listener being outside the `forEach`, the event object vs. `note`, the missing `#` in the selector, removing only the button, and `noteObj` being out of scope. It gave corrected code. | **High.** This was the biggest fix.                                                                 |
| 3   | Unsure whether the fix covered the whole function               | Showed the complete corrected `renderTheNotes()` and listed what changed.                                                                                                                                                                           | **Medium.** It helped me see how the pieces fit together.                                           |
| 4   | Where to put `let typingTimer;`                                 | Explained scope: the variable must be outside the `input` listener, or it is reset on every keystroke.                                                                                                                                              | **Medium.** A concept explanation, not just a fix.                                                  |
| 5   | Adding a note sometimes emptied another note (I found this bug) | Explained that the 500 ms delay meant `notesArray` wasn't updated yet when the notes were re-rendered. Suggested saving right away and a quick test to confirm.                                                                                     | **High.** I would not have guessed this cause easily.                                               |
| 6   | Random ids could repeat                                         | Suggested replacing `Math.random()` with `Date.now()` or a counter.                                                                                                                                                                                 | **Low–medium.** A small change, which I made myself.                                                |
| 7   | Adding `localStorage`                                           | Explained where loading, saving and clearing each go. Suggested a `saveNotes()` helper and `removeItem` instead of `clear()`. Also suggested taking `pushToNotesArray()` out of `renderTheNotes()`.                                                 | **High.** It helped me plan the structure.                                                          |
| 8   | Why call `renderTheNotes()` at the bottom                       | Explained that the script runs once from top to bottom on page load, and that `let`/`const` variables must exist before they are used.                                                                                                              | **Medium.** A concept explanation.                                                                  |
| 9   | Every reload added a new note                                   | Pointed out that `pushToNotesArray()` was still inside `renderTheNotes()`. Also noticed that typing and deleting were not saved.                                                                                                                    | **High.** It found two more bugs I hadn't noticed yet.                                              |
| 10  | Code review of the final version                                | Found an HTML-injection edge case: typing `</textarea>` broke the note. I tested it, and the AI explained what I was seeing, then why `textarea.value = note.text` is the opposite direction from my saving line.                                   | **High.** A real bug I didn't know about.                                                           |
| 11  | Notes appeared on a new line below the ➕ button                | Explained block elements and suggested a flex wrapper with `display: contents`.                                                                                                                                                                     | **Medium.** A layout explanation and CSS.                                                           |
| 12  | This README                                                     | The AI drafted this README from my final code, and I reviewed it.                                                                                                                                                                                   | **Medium.** It saved time on writing.                                                               |
| 13  | Updating this README for note colours                           | The AI read the changes on my colour branch and updated the README (features, data, events, how to run).                                                                                                                                            | **Medium.** It saved time on writing.                                                               |

**Overall:** AI helped most with **debugging and explaining concepts** (scope, events, timing, `localStorage`, HTML safety). It helped less with writing the app itself. The structure, features and most of the code are mine. I tested every suggestion myself before keeping it.

## Possible improvements

- Edit and delete confirmation, so a note isn't deleted by accident
- Let the user choose a colour from a palette instead of a random one
- Note titles
- Sort notes by date

## Author

Margarita Nikulina © 2026 · [Visit my website](https://rita-est-burrito.netlify.app/)

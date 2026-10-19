import { colors } from "./colors.js";

// suggestion to update the variable names to be clearer for example removeAllNotesButton
const addNewNote = document.getElementById("add_new_note");
const allNotes = document.getElementById("all_notes");
const removeAllNotes = document.getElementById("remove_all_notes");

// "myNotes" could be extracted as a const since it's reused throughout
// localStorage.getItem stored as a variable since it's used twice
//an array of objects that stores all the note content and the note id as the key
let notesArray = localStorage.getItem("myNotes")
	? JSON.parse(localStorage.getItem("myNotes"))
	: [];

//push the changed notes array to local storage
function saveNotesToLocalStorage() {
	localStorage.setItem("myNotes", JSON.stringify(notesArray));
}

addNewNote.addEventListener("click", function () {
	pushToNotesArray();
	renderTheNotes();
});

// redundant function
//generates an id for a note taking the unix timestamp
function getRandomId() {
	let number = Date.now();
	return number;
}

//pushes the new note object into notesArray
function pushToNotesArray() { // name the function what it does, for example createNote, rather than what happens internally
	const noteId = getRandomId(); // unix could potentially not be unique if created at the same millisecond, recommend using randomUUID()
	const noteObj = {
		id: noteId,
		text: "",
		color: colors[Math.floor(Math.random() * colors.length)],
	};
	notesArray.push(noteObj);
	saveNotesToLocalStorage();
}

function renderTheNotes() {
	let noteDiv = ""; // clearer name would be notesMarkup or notesHTML
	if (notesArray.length > 0) { // if is redundant, notes exist render them, if not clear the interface
		notesArray.forEach(function (note) {
			noteDiv += `
                <div class="note" id="note-${note.id}">
                    <button class="close" id="remove-note-${note.id}">x</button>
					<button class="color" id="color-note-${note.id}">🎨</button>	
                    <textarea maxlength="500" id="note-text-area-${note.id}" class="note_textarea" placeholder="New note"></textarea>
                </div>
            `;
		});
		allNotes.innerHTML = noteDiv;

		notesArray.forEach(function (note) {
			const noteTextarea = document.querySelector(`#note-text-area-${note.id}`);
			const closeBtn = document.querySelector(`#remove-note-${note.id}`);
			const colorBtn = document.querySelector(`#color-note-${note.id}`);
			const noteElement = document.querySelector(`#note-${note.id}`); // the note div

			noteTextarea.value = note.text;
			noteElement.style.backgroundColor = note.color || "";
			//listen for typing and save the data into the array and Local storage
			noteTextarea.addEventListener("input", function () {
				note.text = noteTextarea.value;
				saveNotesToLocalStorage();
			});

			//deletes one specific note
			closeBtn.addEventListener("click", function () {
				closeBtn.parentElement.remove(); // instead of removing from the DOM and the array only remove from the array and re-render the ui, that way theres only one source of truth
				const index = notesArray.findIndex((n) => n.id === note.id);
				notesArray.splice(index, 1);
				saveNotesToLocalStorage();
			});

			colorBtn.addEventListener("click", function () {
				let randomColor = Math.floor(Math.random() * colors.length);
				if (colors[randomColor] !== note.color) {
					note.color = colors[randomColor];
					noteElement.style.backgroundColor = colors[randomColor];
					saveNotesToLocalStorage();
				} else {
					console.log("same color as before");
				}
			});
		});
		console.log(notesArray);
	}
}

//removes all notes
removeAllNotes.addEventListener("click", function () {
	//clears the array
	notesArray = [];

	//clears Local Storage
	localStorage.removeItem("myNotes");

	//clears all notes html elements
	allNotes.innerHTML = "";
});

renderTheNotes();

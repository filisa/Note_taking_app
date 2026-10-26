import { colors } from "./colors.js";

const addNewNoteButton = document.getElementById("add_new_note_btn");
const allNotesDiv = document.getElementById("all_notes");
const removeAllNotesButton = document.getElementById("remove_all_notes_btn");

//an array of objects that stores all the note content and the note id as the key. <-THIS ONE I DON't understand:(
const notesFromTheLocalStorage = localStorage.getItem("myNotes");
let notesArray = [];
notesArray = notesFromTheLocalStorage
	? JSON.parse(notesFromTheLocalStorage)
	: [];
console.log(notesArray);
//push the changed notes array to local storage
function saveNotesToLocalStorage() {
	localStorage.setItem("myNotes", JSON.stringify(notesArray));
}

addNewNoteButton.addEventListener("click", function () {
	createNote();
	renderTheNotes();
});

//pushes the new note object into notesArray and saves to Local storage too
function createNote() {
	// line below generates a random UUID using cryptographically secure random number generator. Wow. nice.
	const noteId = crypto.randomUUID();
	const noteObj = {
		id: noteId,
		text: "",
		color: colors[Math.floor(Math.random() * colors.length)],
	};
	notesArray.push(noteObj);
	saveNotesToLocalStorage();
}

function renderTheNotes() {
	let notesHTML = "";
	if (notesArray.length > 0) {
		notesArray.forEach(function (note) {
			notesHTML += `
                <div class="note" id="note-${note.id}">
                    <button class="close" id="remove-note-${note.id}">x</button>
					<button class="color" id="color-note-${note.id}">🎨</button>	
                    <textarea maxlength="500" id="note-text-area-${note.id}" class="note_textarea" placeholder="New note"></textarea>
                </div>
            `;
		});
		allNotesDiv.innerHTML = notesHTML;

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

			//deletes one specific note and re-renders all the notes again
			closeBtn.addEventListener("click", function () {
				const index = notesArray.findIndex((n) => n.id === note.id);
				notesArray.splice(index, 1);
				renderTheNotes();
				saveNotesToLocalStorage();
			});

			colorBtn.addEventListener("click", function () {
				const randomColor = Math.floor(Math.random() * colors.length);
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
	} else {
		//clears the array
		notesArray = [];

		//clears Local Storage
		localStorage.removeItem("myNotes");

		//clears all notes html elements
		allNotesDiv.innerHTML = "";
	}
}

//removes all notes
removeAllNotesButton.addEventListener("click", function () {
	//clears the array
	notesArray = [];

	//clears Local Storage
	localStorage.removeItem("myNotes");

	//clears all notes html elements
	allNotesDiv.innerHTML = "";
});

renderTheNotes();

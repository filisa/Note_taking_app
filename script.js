const addNewNote = document.getElementById("add_new_note");
const allNotes = document.getElementById("all_notes");
const removeAllNotes = document.getElementById("remove_all_notes");

//an array of objects that stores all the note content and the note id as the key
let notesArray = localStorage.getItem("myNotes")
	? JSON.parse(localStorage.getItem("myNotes"))
	: [];

//push the changed notes array to local storage
function saveNotesToLocalStorage() {
	localStorage.setItem("myNotes", JSON.stringify(notesArray));
	console.log(localStorage.myNotes);
}

addNewNote.addEventListener("click", function () {
	pushToNotesArray();
	renderTheNotes();
});

//generates an id for a note taking the unix timestamp
function getRandomId() {
	let number = Date.now();
	return number;
}

//pushes the new note object into notesArray
function pushToNotesArray() {
	const noteId = getRandomId();
	const noteObj = { id: noteId, text: "" };
	notesArray.push(noteObj);
	console.log(notesArray);
	saveNotesToLocalStorage();
}

function renderTheNotes() {
	let noteDiv = "";
	if (notesArray.length > 0) {
		notesArray.forEach(function (note) {
			noteDiv += `
                <div class="note" id="note-${note.id}">
                    <button class="close" id="remove-note-${note.id}">x</button>
                    <textarea maxlength="500" id="note-text-area-${note.id}" class="note_textarea" placeholder="New note"></textarea>
                </div>
            `;
		});
		allNotes.innerHTML = noteDiv;

		notesArray.forEach(function (note) {
			const noteTextarea = document.querySelector(`#note-text-area-${note.id}`);
			const closeBtn = document.querySelector(`#remove-note-${note.id}`);

			noteTextarea.value = note.text;
			//listen for typing and save the data into the array and Local storage
			noteTextarea.addEventListener("input", function () {
				note.text = noteTextarea.value;
				console.log(notesArray);
				saveNotesToLocalStorage();
			});

			//deletes one specific note
			closeBtn.addEventListener("click", function () {
				closeBtn.parentElement.remove();
				const index = notesArray.findIndex((n) => n.id === note.id);
				notesArray.splice(index, 1);
				console.log(notesArray);
				saveNotesToLocalStorage();
			});
		});
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
	//check for me
	console.log(notesArray);
});

renderTheNotes();

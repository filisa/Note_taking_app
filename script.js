const addNewNote = document.getElementById("add_new_note");
const allNotes = document.getElementById("all_notes");
const removeAllNotes = document.getElementById("remove_all_notes");

//an array of objects that stores all the note content and the note id as the key
let notesArray = [];

// let NotesFromLocalStorage = JSON.parse(localStorage.getItem("My notes"));

function renderTheNotes() {
	//each note is a div
	const note = document.createElement("div");
	allNotes.appendChild(note);
	const noteId = getRandomId();
	note.setAttribute("id", noteId);
	note.setAttribute("class", "note");

	//inside the div there is textarea where you can write
	const textarea = document.createElement("textarea");
	textarea.placeholder = "New note";
	note.appendChild(textarea);
	textarea.setAttribute("class", "note_textarea");
	textarea.setAttribute("id", "noteTextarea");
	textarea.setAttribute("maxlength", 500);

	//push a new object into an array as soon an the note is created
	const noteObj = { id: noteId, text: "" };
	notesArray.push(noteObj);

	//add the new object into localstorage
	// localStorage.setItem("My notes", JSON.stringify(notesArray));
	// console.log(localStorage);

	let typingTimer;
	//push the content of the note into the array 500 ms after the user finishes typing
	textarea.addEventListener("input", function () {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(function () {
			noteObj.text = textarea.value;
			console.log(notesArray);
		}, 500);
	});

	//inside the div there is a button X to delete the note
	const x = document.createElement("button");
	x.textContent = "x";
	x.setAttribute("class", "close");
	note.appendChild(x);

	//deletes one specific note
	x.addEventListener("click", function () {
		note.remove();
		const specificNote = notesArray.indexOf(noteObj);
		notesArray.splice(specificNote, 1);
		console.log(notesArray);
	});
}

renderTheNotes();

//adds a new note
addNewNote.addEventListener("click", function () {
	renderTheNotes();
});

//removes all notes
removeAllNotes.addEventListener("click", function () {
	const note = document.querySelectorAll(".note");
	if (notesArray.length != 0) {
		note.forEach(function (oneNote) {
			oneNote.remove();
		});
		//clears the array
		notesArray.length = 0;
		console.log(notesArray);
		//clears localStorage
		// localStorage.clear();
	} else {
		console.log("nothing to delete");
	}
});

//generates a random ID for a note
function getRandomId() {
	const number = Math.floor(Math.random() * 1000);
	return number;
}

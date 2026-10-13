const thisDivContainsNotes = document.getElementById("this_div_contains_notes")
const addNewNote = document.getElementById("add_new_note")
const oneNote = document.getElementById("one_note")

function renderTheNotes() {
    const x = document.createElement('p');
    x.textContent = 'x';
    oneNote.appendChild(x);
    x.setAttribute("id", "close")

    const newNote = document.createElement('textarea');
    newNote.placeholder = 'New note';
    oneNote.appendChild(newNote);
    newNote.setAttribute("id", "note")

}

addNewNote.addEventListener("click", function(){
    renderTheNotes()
})


//what next: set the text area height and width so I cannot resize the notes
//make so that the new notes add in a row, not a wierd column 
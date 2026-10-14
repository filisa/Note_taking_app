const addNewNote = document.getElementById("add_new_note")
const allNotes = document.getElementById("all_notes")
const removeAllNotes = document.getElementById("remove_all_notes")

function renderTheNotes() {
    const note = document.createElement('div');
    allNotes.appendChild(note);
    note.setAttribute("class", "note")

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'New note';
    note.appendChild(textarea);
    textarea.setAttribute("class", "note_textarea")
    textarea.setAttribute("maxlength", 500)


    const x = document.createElement('button');
    x.textContent = '×';
    x.setAttribute("class", "close");
    note.appendChild(x);
    //deletes one specific note
    x.addEventListener("click", function () {
        note.remove();
})
}


//adds a new note
addNewNote.addEventListener("click", function(){
    renderTheNotes()
})

//removes all notes
removeAllNotes.addEventListener("click", function(){
    const note = document.querySelectorAll(".note");
    note.forEach(function(oneNote){
        oneNote.remove();
    })

})


//what next: set the text area height and width so I cannot resize the notesv
//make so that the new notes add in a row, not a wierd column v
//remove all notes v
//add local storage 
(function () {
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let fid = 0;    // folder id
    let folders = [];
    let fjson = localStorage.getItem("data");
    if (fjson != null && fjson.length > 0) {
        folders = JSON.parse(fjson);
    }

    btnAddFolder.addEventListener("click", addFolder);
    function addFolder() {
        let fname = prompt("Enter a folder's name");
        if (!fname) {    // to avoid making folders when pressed the cancel button on promt
            return;
        }

        fid++;
        addFolderInPage(fname, fid)

        folders.push({
            id: fid,
            name: fname
        })
        persistFoldersToStorage();
    }

    function addFolderInPage(fname, fid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);
        let divName = divFolder.querySelector("[purpose = 'name']");
        divName.innerHTML = fname;
        divFolder.setAttribute("fid", ++fid);   //setting an attribute for div folders
        //          attribute name^     ^attribute value
        // delete karne mein kaam aayega folders ki id


        let spanDelete = divFolder.querySelector("span[action='delete']")
        spanDelete.addEventListener("click", deleteFolder)

        let spanEdit = divFolder.querySelector("span[action='edit']")
        spanEdit.addEventListener("click", editFolder)

        divContainer.appendChild(divFolder);
    }

    function deleteFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let flagDelete = confirm("Do you want to delete the folder " + divName.innerHTML + "?");
        // confirm returns a true when ok is clicked and false when cancel is clicked

        if (flagDelete == true) {
            divContainer.removeChild(divFolder); // this will remove the folder
            // ye divfolder iss function ke closure mein pada hai
            // this is the same divFolder that contains this particular spanDelete
            // therefore that particular divFolder is deleted

            let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute("fid")));
            folders.slice(idx, 1);
            persistFoldersToStorage();
        }
    }

    function editFolder() {

        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fname = prompt("Enter the new folder name");
        if (!fname) {
            return;
        }

        divName.innerHTML = fname;
        let folder = folders.find(f => f.id == parseInt(divFolder.getAttribute("fid")));
        folder.name = fname;
        persistFoldersToStorage();
    }

    function persistFoldersToStorage() {
        console.log(folders);
        let fjson = JSON.stringify(folders);
        // JSON.stringify makes the java script object into a string, so it can be stored into the local storage


        localStorage.setItem("data", fjson);
    }

    function loadFoldersFromStorage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            folders = JSON.parse(fjson);
            // JSON.parse changes javascript object notations back to an object, so that it can be manipulated and used by the javascript

            folders.forEach(function(f){
                addFolderInPage(f.name, f.id);
            });
        }
    }
    loadFoldersFromStorage();
})();


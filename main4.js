(function () {

    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddTextFile = document.querySelector("#addTextFile");

    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-Bar")
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");

    let divBreadcrumb = document.querySelector("#breadcrumb")
    let aRootPath = divBreadcrumb.querySelector("a[purpose=path]")
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates")
    let resources = [];
    let cfid = -1;  // initially we are at root (which has an id of -1)
    let rid = 0;

    btnAddFolder.addEventListener("click", addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);
    aRootPath.addEventListener("click", viewFolderFromPath);


    // persist - ram, storage
    // validation - unique, non-blank
    function addFolder() {
        let rname = prompt("Enter folder's name");
        if (rname != null) {

            rname = rname.trim();
        }
        if (!rname) {     // empty name validation
            alert("Empty name is not allowed");
            return;
        }
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid)
        if (alreadyExists == true) {      //uniqueness validation
            alert(rname + " is already in use");
            return;
        }
        let pid = cfid
        rid++;
        addFolderHTML(rname, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "folder",
            pid: cfid
        })
        saveToStorage();
    }


    function addTextFile() {
        let rname = prompt("Enter text file's name");
        if (rname != null) {

            rname = rname.trim();
        }
        if (!rname) {     // empty name validation
            alert("Empty name is not allowed");
            return;
        }
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid)
        if (alreadyExists == true) {      //uniqueness validation
            alert(rname + " is already in use");
            return;
        }
        let pid = cfid
        rid++;
        addTextFileHTML(rname, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            isBold: "false",
            isItalic: "false",
            isUnderline: "false",
            bgColor: "#000000",
            textColor: "#FFFFFF",
            fontFamily: "cursive",
            fontSize: 22,
            content: "I am a new file."
        })
        saveToStorage();
    }

    function deleteFolder() {
        // delete all folders inside the folder being deleted
        // delete from HTML, resources, local storage
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");

        let fidTBD = parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML;

        let childrenExists = resources.some(r => r.pid == fidTBD);

        let sure = confirm(`Are you sure you want to delete ${fname}?` + (childrenExists ? ". It also has children" : ""));
        if (!sure) {
            return;
        }

        divContainer.removeChild(divFolder);

        deleteHelper(fidTBD);

        saveToStorage();
    }

    function deleteHelper(fidTBD) {
        let children = resources.filter(r => r.pid == fidTBD);
        for (let i = 0; i < children.length; i++) {
            deleteHelper(children[i].rid);
        }

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx, 1); 0
    }

    function deleteTextFile() {
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");

        let fidTBD = parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm(`Are you sure you want to delete ${fname}?`);
        if (!sure) {
            return;
        }

        divContainer.removeChild(divTextFile);

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx, 1);

        saveToStorage();
    }

    function renameFolder() {
        let nrname = prompt("Enter folder's name");
        if (nrname != null) {
            nrname = nrname.trim();
        }
        if (!nrname) {     // empty name validation
            alert("Empty name is not allowed");
            return;
        }

        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        if (nrname == orname) {
            alert("Please enter a new name.");
            return;
        }
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid)
        if (alreadyExists == true) {      //uniqueness validation
            alert(nrname + " is already in use");
            return;
        }

        divName.innerHTML = nrname;

        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;


        saveToStorage();

    }

    function renameTextFile() {
        let nrname = prompt("Enter folder's name");
        if (nrname != null) {
            nrname = nrname.trim();
        }
        if (!nrname) {     // empty name validation
            alert("Empty name is not allowed");
            return;
        }

        let spanRename = this;
        let divTextFile = spanRename.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divTextFile.getAttribute("rid"));
        if (nrname == orname) {
            alert("Please enter a new name.");
            return;
        }
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid)
        if (alreadyExists == true) {      //uniqueness validation
            alert(nrname + " is already in use");
            return;
        }

        divName.innerHTML = nrname;

        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;


        saveToStorage();
    }

    function viewFolder() {
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");
        let fname = divName.innerHTML;

        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("a[purpose=path]");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        aPath.addEventListener("click", viewFolderFromPath);

        divBreadcrumb.appendChild(aPath);
        cfid = fid;

        divContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }
    }

    function viewFolderFromPath() {
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));
        cfid = fid;

        while (aPath.nextSibling) {
            aPath.parentNode.removeChild(aPath.nextSibling);
        }


        divContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }

    }

    function viewTextFile() {
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]")
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);


        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]")
        let inputUpload = divAppMenuBar.querySelector("[action=upload]")
        let textArea = divAppBody.querySelector("textArea");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        inputUpload.addEventListener("change", uploadNotepad);

        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    }

    function downloadNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu = this.parentNode;

        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);

        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
        aDownload.setAttribute("download", resource.rname + ".json");

        aDownload.click();
    }

    function uploadNotepad() {

    }


    function saveNotepad() {

        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");


        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();
    }

    function makeNotepadBold() {
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        } else if (isPressed == true) {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }
    function makeNotepadItalic() {

        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        } else if (isPressed == true) {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }
    function makeNotepadUnderline() {

        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        } else if (isPressed == true) {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }
    function changeNotepadBGColor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }
    function changeNotepadTextColor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }
    function changeNotepadFontFamily() {
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }
    function changeNotepadFontSize() {
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize;
    }

    function addFolderHTML(rname, rid, pid) {
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let spanRename = divFolder.querySelector("[action=rename]")
        let spanDelete = divFolder.querySelector("[action=delete]")
        let spanView = divFolder.querySelector("[action=view]")
        let divName = divFolder.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        spanRename.addEventListener("click", renameFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", viewFolder);

        divContainer.appendChild(divFolder);
    }
    function addTextFileHTML(rname, rid, pid) {
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true);

        let spanRename = divTextFile.querySelector("[action=rename]")
        let spanDelete = divTextFile.querySelector("[action=delete]")
        let spanView = divTextFile.querySelector("[action=view]")
        let divName = divTextFile.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        spanRename.addEventListener("click", renameTextFile);
        spanDelete.addEventListener("click", deleteTextFile);
        spanView.addEventListener("click", viewTextFile);

        divContainer.appendChild(divTextFile);
    }

    function saveToStorage() {

        let rjson = JSON.stringify(resources);
        // used to convert JSO to a JSON string which can be saved
        localStorage.setItem("data", rjson)
    }

    function loadFromStorage() {
        let rjson = localStorage.getItem("data");
        if (!rjson) {
            return;
        }

        resources = JSON.parse(rjson);
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
            if (resources[i].rid > rid) {
                rid = resources[i].rid;
            }
        }


    }

    loadFromStorage();
})();
// we use IIFEs to prevent namespace pollution
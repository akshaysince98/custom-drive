(function () {

    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divBreadCrumb = document.querySelector("#divBreadCrumb");
    let aRootPath = document.querySelector(".path");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let folders = [];
    let cfid = -1;  //id of the folder in which we are
    let fid = -1;
    
    btnAddFolder.addEventListener("click", addFolder);
    aRootPath.addEventListener("click", navigateBreadCrumb);

    function addFolder() {
        let fname = prompt("Enter folder's name");

        if (!!fname) {

            let exists = folders.some(f => f.name == fname);

            if (exists == false) {
                fid++;
                folders.push({
                    id: fid,
                    name: fname,
                    pid: cfid
                })

                addFolderHTML(fname, fid, cfid);

                saveToStorage();
            } else {
                alert(fname + " already exists")
            }
        } else {
            alert("Please enter a name")
        }

    }

    function editFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let nfname = prompt("Enter folder's name");
        let ofname = divName.innerHTML;

        if (!!nfname) {
            if (nfname != ofname) {

                let exists = folders.filter(f => f.pid == cfid).some(f => f.name == nfname);

                if (exists == false) {
                    let folder = folders.filter(f => f.pid == cfid).find(f => f.name == ofname);
                    folder.name = nfname;

                    divName.innerHTML = nfname

                    saveToStorage();
                } else {
                    alert(nfname + " already exists")
                }
            } else {
                alert("This is old folder name")
            }
        } else {
            alert("Please enter a name")
        }


    }

    function deleteFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidtbd = parseInt(divFolder.getAttribute("fid"));

        let flag = confirm("Are you sure you want to delete " + divName.innerHTML + "?");
        if (flag == true) {

            let exists = folders.some(f => f.pid == fidtbd);
            if(exists == false){

                let fidx = folders.findIndex(f => f.pid == fidtbd);
                // NEEDS CORRECTION
                folders.splice(fidx, 1);
    
                divContainer.removeChild(divFolder);
    
                saveToStorage();
            } else {
                alert("Can't delete. Has Children.");
            }

        }

    }

    function navigateBreadCrumb() {
        let fname = this.innerHTML;
        cfid = parseInt(this.getAttribute("fid"));
        
        divContainer.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderHTML(f.name, f.id, f.pid);
        });

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }

    }

    function viewFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid = parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate = pageTemplates.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = divName.innerHTML;
        aPath.setAttribute("fid", cfid);
        aPath.addEventListener("click", navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderHTML(f.name, f.id, f.pid);
        });
    }

    function addFolderHTML(fname, fid, pid) {
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose='name']");
        let spanEdit = divFolder.querySelector("[action='edit']");
        let spanDelete = divFolder.querySelector("[action='delete']");
        let spanView = divFolder.querySelector("[action='view']");

        divFolder.setAttribute("fid", fid);
        divFolder.setAttribute("pid", pid);

        divName.innerHTML = fname;
        spanEdit.addEventListener("click", editFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", viewFolder);

        divContainer.appendChild(divFolder);

    }

    function saveToStorage() {
        let fjson = JSON.stringify(folders);

        localStorage.setItem("data", fjson);

    }

    function loadFromStorage() {
        let fjson = localStorage.getItem("data");
        if (!!fjson) {
            folders = JSON.parse(fjson);
            folders.forEach(f => {
                if (f.id > fid) {
                    fid = f.id;
                }
                if (f.pid == cfid) {
                    addFolderHTML(f.name, f.id, f.pid);
                }
            });
        }
    }
    loadFromStorage();

})();
function wth() {

    let tbody = document.getElementsByTagName("tbody")[0];
    console.log(tbody)

    let username = "entropystarrover@gmail.com";
    let password = "nebula88helix";

    function createHeader(username, password) {
        let auth = `Basic ${btoa(`${username}:${password}`)}`;
        let headers = {
            'Content-type': 'application/json',
            "Authorization": auth
        };
        return headers;
    }

    let headers = createHeader(username, password);

    let submitDiv = document.getElementById("submitDiv");

    let idLab = document.createElement("label");
    idLab.textContent = "ID";
    let idInp = document.createElement("input");
    idInp.setAttribute("type", "number");

    let fnLab = document.createElement("label");
    fnLab.textContent = "First name";
    let fnInp = document.createElement("input");

    let lnLab = document.createElement("label");
    lnLab.textContent = "Last name";
    let lnInp = document.createElement("input");

    let fnumLab = document.createElement("label");
    fnumLab.textContent = "Faculty number";
    let fnumInp = document.createElement("input");

    let gLab = document.createElement("label");
    gLab.textContent = "Grade";
    let gInp = document.createElement("input");
    gInp.setAttribute("type", "number");
    gInp.setAttribute("step", ".01");

    let submitButton = document.createElement("button");
    submitButton.textContent = "Submit"
    submitButton.addEventListener("click", submit);

    submitDiv.append(idLab, idInp, fnLab, fnInp, lnLab, lnInp, fnumLab, fnumInp, gLab, gInp, submitButton)

    function submit() {
        //get values and create object
        let id = Number(idInp.value);
        let fn = fnInp.value;
        let ln = lnInp.value;
        let facNum = fnumInp.value;
        let grade = Number(gInp.value);

        //check for empty fields
        let values = [id, fn, ln, facNum, grade]
        let inputFieldsAreNotEmpty = true;
        values.forEach(v => {
            if (v.length == 0 || v == " ") {
                inputFieldsAreNotEmpty = false;
            }
        })

        //check if id is number
        let idIsANumber = true;
        if (typeof id != "number") {
            idIsANumber = false;
        }

        //check if grade is valid
        let gradeIsValid = true;
        if (typeof grade != "number" || grade < 2 || grade > 6) {
            gradeIsValid = false;
        }

        //check if facultyNumber is valid
        let facNumIsValid=true;
        let patt=/^\d+$/g;
        if (patt.test(facNum)==false){
            facNumIsValid=false;
        }

        if (inputFieldsAreNotEmpty && idIsANumber && gradeIsValid && facNumIsValid) {
            let newStudent = {
                id,
                fn,
                ln,
                facNum,
                grade
            }

            async function post() {
                try {
                    await fetch("https://baas.kinvey.com/appdata/kid_rkzic96iS/students", {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(newStudent)
                    });
                } catch {
                    alert("oops...")
                }
            }
            post();
            load();
        } else {
            alert("Illegal values! Student entry was not created")
        }
    }


    async function load() {
        tbody.innerHTML="";
        try {
            let result = await fetch("https://baas.kinvey.com/appdata/kid_rkzic96iS/students", {
                headers: headers,
            });
            let arr = await result.json();
            //sort by id
            arr=arr.sort((a,b)=>a.id-b.id)

            //visualise
            arr.forEach(element => {
                let tr = document.createElement("tr");
                let idTd = document.createElement("td");
                idTd.textContent = element.id;
                let fnTd = document.createElement("td");
                fnTd.textContent = element.fn;
                let lnTd = document.createElement("td");
                lnTd.textContent = element.ln;
                let facNumTd = document.createElement("td");
                facNumTd.textContent = element.facNum;
                let gradeTd = document.createElement("td");
                gradeTd.textContent = element.grade;

                tr.append(idTd, fnTd, lnTd, facNumTd, gradeTd);
                tbody.appendChild(tr)
            });

        } catch {
            alert("oops...")
        }

    }
    load();
}

wth();
window.addEventListener("load", () => {
    const canvasContainer = document.querySelector("#canvas-container");
    const pen = document.querySelector("#pen");
    const reset = document.querySelector("#reset-button");
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    updateCanvasSize();

    let labels = [];
    let points = [];
    let letter = "A";

    ctx.strokeStyle = "black";

    let canDraw = true;

    function updateCanvasSize() {
        canvas.height = 500;
        canvas.width = window.innerWidth;
    }

    function savePoint(e) {
        if (!canDraw) return;
        draw(e);

        const newPointId = points.length ;
        const previusPointId = newPointId - 1;

        const point = {
            id: newPointId,
            position: {
                x: e.clientX,
                y: e.clientY
            }
        };

        points.push(point);

        if (points.length > 1 && points[previusPointId] != null) {
            addLineLable(points[newPointId], points[previusPointId])
        }
    }

    function draw(e) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    function closeLines(e) {
        if (e.key == "Enter" || e.key == "Escape") {
            canDraw = false;
            pen.style.fill = "red";
        }
    }

    function createHtmlElement(type, innerTextValue = "") {
        const element = document.createElement(type);

        if (innerTextValue != null && innerTextValue != "") {
            element.innerText = innerTextValue;
        }

        return element;
    }
    
    function updateTable() {
        const tableBody = document.querySelector("#calc-table tbody");
        
        //clear table body
        tableBody.innerHTML = "";

        //append table header
        const headerTr = createHtmlElement("tr");

        const titleOne = createHtmlElement("th", "Točka");
        const titleTwo = createHtmlElement("th", "Dolžina (cm)");
        const titleThree = createHtmlElement("th", "Dolžina skupaj (cm)");

        headerTr.appendChild(titleOne);
        headerTr.appendChild(titleTwo);
        headerTr.appendChild(titleThree);

        tableBody.appendChild(headerTr);
        
        let total = 0;

        labels.forEach((el, i) => {
            total += parseFloat(el.size);

            const tr = createHtmlElement("tr");

            const name = createHtmlElement("td", el.label);
            const value = createHtmlElement("td", el.size);
            const valueAll = createHtmlElement("td", total);

            tr.appendChild(name);
            tr.appendChild(value);
            tr.appendChild(valueAll);

            tableBody.appendChild(tr);
        });

        if (labels.length > 0) {
            const finalTr = createHtmlElement("tr");
            finalTr.classList.add("final");

            const finalName = createHtmlElement("td", "Skupaj");

            const finalValue = createHtmlElement("td", total);
            finalValue.setAttribute("colspan", 2);

            finalTr.appendChild(finalName);
            finalTr.appendChild(finalValue);

            tableBody.appendChild(finalTr);
        }
    }

    function addLineLable(pointA, pointB) {
        const pointAX = pointA.position.x;
        const pointAY = pointA.position.y;

        const pointBX = pointB.position.x;
        const pointBY = pointB.position.y;

        var midX = pointAX + (pointBX - pointAX) * 0.50;
        var midY = pointAY + (pointBY - pointAY) * 0.50;

        const point = document.createElement("div");
        point.setAttribute("letter", letter);
        point.innerText = letter;

        const newLabel = {
            label: letter,
            size: 0
        }

        labels.push(newLabel);

        updateTable();

        //next alphabet
        letter = String.fromCharCode(letter.charCodeAt() + 1);

        point.className = "point";
        point.style.top = (midY - 10) + "px";
        point.style.left = midX + "px";
        
        canvasContainer.appendChild(point);

        point.addEventListener('click', (e) => {
            const clickedLabel = point.getAttribute("letter");

            let value = "";
            value = prompt("Vnesi dolžino v cm");

            if (value != null && value != "") {
                if (!isNaN(value)) {
                    for (var i = 0; i < labels.length; i++) {
                        var lable = labels[i];
                
                        if (lable.label == clickedLabel) {
                            lable.size = value;
                            point.innerText = value;
                            updateTable();
                            break;
                        }
                    };
                }
            }
        });
    }

    function toggleDrawing() {
        canDraw = !canDraw;
        pen.style.fill = canDraw ? "green" : "red";
    }

    function refreshBrowser() {
        location.reload();
    }

    canvas.addEventListener("click", savePoint);
    document.addEventListener("keydown", closeLines);
    pen.addEventListener("click", toggleDrawing);
    reset.addEventListener("click", refreshBrowser);
})
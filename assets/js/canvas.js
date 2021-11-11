function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)


    // отримання контексту для малювання
    const context = canvas.getContext('2d')
    // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();

    let isPaint = false // чи активно малювання
    let points = [] //масив з точками

    // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging,
            color : options.strokeColor,
            size : options.strokeWidth
        })
    }

    // головна функція для малювання
    const redraw = () => {
        //очищуємо  canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        //context.strokeStyle = options.strokeColor;
        context.lineJoin = "round";
        //context.lineWidth = options.strokeWidth;
        let prevPoint = null;
        for (let point of points){
            context.strokeStyle = point.color;
            context.lineWidth = point.size;
            context.beginPath();
            if (point.dragging && prevPoint){
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.stroke();
            prevPoint = point;
        }
    }

    // функції обробники подій миші
    const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY);
        redraw();
    }

    const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true);
            redraw();
        }
    }

    // додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
        isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
        isPaint = false;
    });

    // TOOLBAR
    const toolBar = document.getElementById('toolbar')
    // clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.innerHTML = '<i class="fas fa-eraser"></i>'
    //clearBtn.textContent = 'Clear'

    clearBtn.addEventListener('click', () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        points.length = 0;
    })
    toolBar.insertAdjacentElement('afterbegin', clearBtn)
    
    //Download
    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('btn')
    downloadBtn.innerHTML = '<i class="fas fa-file-export"></i>'
    //downloadBtn.textContent = 'Download'
    downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', downloadBtn)

    //Save
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('btn')
     saveBtn.innerHTML = '<i class="far fa-save"></i>'
    //saveBtn.textContent = 'Save'
    saveBtn.addEventListener('click', () => {
     localStorage.setItem('points', JSON.stringify(points));
     })
     toolBar.insertAdjacentElement('afterbegin', saveBtn)

     //Restore
     const restoreBtn = document.createElement('button');
     restoreBtn.classList.add('btn')
     restoreBtn.innerHTML = '<i class="far fa-window-restore"></i>'
     //restoreBtn.textContent = 'restore'
     restoreBtn.addEventListener('click', () => {
     const raw = localStorage.getItem('points')
     points = JSON.parse(raw)
     redraw();
     })
     toolBar.insertAdjacentElement('afterbegin', restoreBtn)

     //Time
     const timeStampBtn = document.createElement('button');
     timeStampBtn.classList.add('btn')
     timeStampBtn.innerHTML = '<i class="far fa-calendar-times"></i>'
     //timeStampBtn.textContent = 'timeStamp'
     timeStampBtn.addEventListener('click', () => {
     context.fillText(new Date(), 50, 100);
 
     })
     toolBar.insertAdjacentElement('afterbegin', timeStampBtn)

    const sizeElem = document.createElement('input');
    sizeElem.classList.add('defolt')
    sizeElem.addEventListener("change",() =>{
        options.strokeWidth = sizeElem.value
    })
    toolBar.insertAdjacentElement('afterbegin',  sizeElem)

    const backgroundBtn = document.createElement('button');
    backgroundBtn.classList.add('btn')
    backgroundBtn.innerHTML = '<i class="fas fa-images"></i>'
    //backgroundBtn.textContent = 'background'
    backgroundBtn.addEventListener('click', () => {
        const img = new Image;
        img.src =`https://www.fillmurray.com/200/300)`;
        img.onload = () => {
        context.drawImage(img, 0, 0);
        }
    })
    toolBar.insertAdjacentElement('afterbegin', backgroundBtn)

    const colorElem = document.getElementById("color")
    colorElem.addEventListener("change", () =>{
        options.strokeColor = colorElem.value
    } )
}

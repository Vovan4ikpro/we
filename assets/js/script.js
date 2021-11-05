function Slide(index, title, background, link ) {
    this.title = title;
    this.background = background;
    this.link = link;
    this.id = "slide-" + index;
 }
 
 const Slider = {
    current: 0,
    slides: [],
    initSlider: function(slides){
        let index = 0;
        for (let slide of slides){
            this.slides.push(new Slide(index, slide.title, slide.background, slide.link));
            index++;
        }
        this.buildSlider();
    },
    buildSlider: function() {

        let sliderHTML = "";
        for(let slide of this.slides) {
 //зверніть увагу на можливість використання ``,яка дозволяє додавати в string змінні ${}
            sliderHTML +=
                `<div id='${slide.id}' class='singleSlide'
            style='background-image:url(${slide.background});'>
            <div class='slideOverlay'>
            <h2>${slide.title}</h2>
            <a class='link' href='${slide.link}' target='_blank'>Open</a></div></div>`;

        const targetDiv = document.getElementById("slides");

        let btn = document.createElement('button');
        btn.className = 'slides';
        btn.id = 'button-'+slide.id;
        btn.innerHTML = slide.id;    
        btn.addEventListener("click", function(e) {
          Slider.setSlide(slide.id);
        })

        targetDiv.appendChild(btn); 
        }
        
        document.getElementById("slider").innerHTML = sliderHTML;
        document.getElementById("slide-" + this.current).style.left = 0;
    },

    prevSlide: function() {
        let next;
        if (this.current === 0 ) {
            next = this.slides.length - 1;
        } else {
            next = this.current - 1;
        }
 
        document.getElementById("slide-" + next).style.left = "-100%";
        document.getElementById("slide-" + this.current).style.left = 0;
 
        document.getElementById("slide-" + next).setAttribute("class", "singleSlide slideInLeft");
        document.getElementById("slide-" + this.current).setAttribute("class", "singleSlide slideOutRight");
 
        this.current = next;
    },
    nextSlide: function(){
        let next;
        if (this.current === (this.slides.length - 1) ) {
            next = 0;
        } else {
            next = this.current + 1;
        }
 
        document.getElementById("slide-" + next).style.left = "100%";
        document.getElementById("slide-" + this.current).style.left = 0;
 
        document.getElementById("slide-" + next).setAttribute("class", "singleSlide slideInRight");
        document.getElementById("slide-" + this.current).setAttribute("class", "singleSlide slideOutLeft");
 
        this.current = next;
    },

    setSlide: function (id) {
        const nextNumber = Number(id.replace("slide-", ""));
    
        const diff = nextNumber - this.current;
        if(diff === 0) return;
        else if(diff > 0) {
          for (let i = 0; i < diff; i++) {
            Slider.nextSlide();
          }
        } else if (diff < 0) {
          for (let i = 0; i < Math.abs(diff); i++) {
            Slider.prevSlide();
          }
        }
    },
 }


 const leftControl = document.querySelector('.slid-left'); 
 const rightControl = document.querySelector('.slid-right');
 
 leftControl.addEventListener('click', () => {
     Slider.prevSlide();
 })
 
 rightControl.addEventListener('click', () => {
     Slider.nextSlide();
 })
 
const hideContorol = document.querySelector('.slid-hide');
const showControl = document.querySelector('.slid-show');
const slider = document.querySelector('.slider');

hideContorol.addEventListener('click', () => {
    slider.classList.add('hide');
})

showControl.addEventListener('click', () => {
    slider.classList.remove('hide');
})

const startStop = document.querySelector('.slide-startStop');

startStop.addEventListener('click', (event)=>{
    if (event.target.classList.contains('start')){
        event.target.innerHTML = 'Start';
        clearInterval(interval)
    } else {
        event.target.innerHTML = 'Stop';
        interval = setInterval(()=>{
            Slider.nextSlide();
        },1000)
    }
    event.target.classList.toggle('start')
 })
 
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};
const route2 = () => {
    window.history.pushState({}, "", "/");
    handleLocation();
};

const routes = {
    404: "/pages/404.html?v=1.2",
    "/": "/pages/index.html?v=1.2",
    "/okna": "/pages/okna.html?v=1.2",
    "/drzwi": "/pages/drzwi.html?v=1.2",
    "/schody": "/pages/schody.html?v=1.2",
    "/renowacja": "/pages/renowacja.html?v=1.2",
    "/kontakt": "/pages/kontakt.html?v=1.2",
    "/inne": "/pages/inne.html?v=1.2",

};
const generateDynamicGalleryCSS = (galleryId, imagePrefix, imageCount) => {
   let css = '';

    for (let i = 1; i <= imageCount; i++) {
        css += `
            #${galleryId} .img${i} {
                grid-area: img${i};
                background-image: url("../img/${imagePrefix}/img${i}.jpg");
            }
        `;
    }
    css += `#index-gallery-schody{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 10px;
    grid-template-areas: `

    css += `"gallery-p gallery-p gallery-p gallery-p"
    `
    for (let i = 1; i <= imageCount; ) {
        
        css += `"img${i} img${1+i} img${2+i} img${3+i}" 
        `;
        i=i+4;
    }
    css += `;
}`

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];

    window.scrollTo(0, 0);
    try {
        const response = await fetch(route);
        if (!response.ok) throw new Error('Network response was not ok.');
        const html = await response.text();
        
        const mainPageElement = document.getElementById("main-page");
        if (mainPageElement) {
            mainPageElement.innerHTML = html;
            if (path === '/okna') {
                generateDynamicGalleryCSS('index-gallery-okna', 'okna', 0);
                createGallery('index-gallery-okna', 'okna', 0);
            } else if (path === '/drzwi') {
                generateDynamicGalleryCSS('index-gallery-drzwi', 'drzwi', 22);
                createGallery('index-gallery-drzwi', 'drzwi', 22);
            } else if (path === '/schody') {
                generateDynamicGalleryCSS('index-gallery-schody', 'schody', 72);
                createGallery('index-gallery-schody', 'schody', 72);
            }else if (path === '/renowacja') {
                generateDynamicGalleryCSS('index-gallery-renowacja', 'renowacja', 2);
                createGallery('index-gallery-renowacja', 'renowacja', 2);
            }else if (path === '/inne') {
                generateDynamicGalleryCSS('index-gallery-inne', 'inne', 4);
                createGallery('index-gallery-inne', 'inne', 4);
            }
            
           
        } else {
            console.error('Element with id "main-page" not found.');
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    }
   
};
let getLatesOpendImg;
let windowWidth = window.innerWidth;


function makeLoader(container){
    let loader = document.createElement("div");
    loader.setAttribute("class", "img-loader");
    container.appendChild(loader);
    return loader;
}
const handleKeyPress = (imagePrefix) => (event) => {
    if (event.key === "ArrowLeft") {
        changeImg(imagePrefix, 0); // Przechodzi do poprzedniego zdjęcia
    } else if (event.key === "ArrowRight") {
        changeImg(imagePrefix, 1); // Przechodzi do następnego zdjęcia
    }
};
const createNavButton = (container, className, text, onClick, position) => {
    const button = document.createElement("a");
    button.className = className;
    button.id = "img-btn";
    button.onclick = onClick;
    button.style[position] = `150px`;
    button.appendChild(document.createTextNode(text));
    container.appendChild(button);
};

function createGallery(galleryId, imagePrefix, imageCount) {
    
    const galleryContainer = document.getElementById(galleryId);
    
    if (!galleryContainer) return;

    for (let i = 1; i <= imageCount; i++) {
        const imageDiv = document.createElement("div");

        imageDiv.className = `gallery-img img${i}`;
        imageDiv.onclick = () => openImage(imagePrefix,i);
        galleryContainer.appendChild(imageDiv);
    }
}

const openImage = (imagePrefix, index) => {
    const container = document.body;
    const loader = makeLoader(container);

    const newImgWin = document.createElement("div");
    newImgWin.className = "img-window";
    newImgWin.onclick = closeImg;
    container.appendChild(newImgWin);

    const newImg = document.createElement("img");
    newImg.src = `img/${imagePrefix}/img${index}.jpg`;
    newImg.id = "current-img";
    newImgWin.appendChild(newImg);

    getLatesOpendImg = index;
    newImg.onload = () => {
        loader.remove();
        createNavButton(container, "img-btn-prev", "<", () => changeImg(imagePrefix,0), "left");
        createNavButton(container, "img-btn-next", ">", () => changeImg(imagePrefix,1), "right");
        
        document.addEventListener('keydown', handleKeyPress(imagePrefix));
    };
};
function closeImg(){
    document.querySelector(".img-window").remove();
    document.querySelector(".img-btn-next").remove();
    document.querySelector(".img-btn-prev").remove();
    document.removeEventListener('keydown', handleKeyPress);
}

function changeImg(imagePrefix, changeDir){

    const galleryImages = document.querySelectorAll(".gallery-img");
    document.querySelector("#current-img").remove();

    let getImgWin = document.querySelector(".img-window");
    let loader = makeLoader(getImgWin);

    let newImg = document.createElement("img");
    
    let calcNewImg;
    if(changeDir === 1){
        calcNewImg = getLatesOpendImg + 1;
        if(calcNewImg > galleryImages.length){
            calcNewImg = 1;
        }
    }
    else if(changeDir === 0){
        calcNewImg = getLatesOpendImg - 1;
        if(calcNewImg < 1){
            calcNewImg = galleryImages.length;
        }
    }

    newImg.src =`img/${imagePrefix}/img${calcNewImg}.jpg`;
    console.log(newImg.src)
    newImg.id ="current-img";
    getImgWin.appendChild(newImg);

    newImg.onload = function(){

        loader.remove();
        getLatesOpendImg = calcNewImg;
    }
}


window.onpopstate = handleLocation;
window.route = route;

handleLocation();

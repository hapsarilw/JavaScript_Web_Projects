const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
//knowing when all images loaded
let totalImages = 0
//using let because array constanly chan ge
let photoArray = [];

let initialLoad = true;

//Unsplash API
let initialCount = 5;
const apiKey = 'Ae8ZnbQ0e912EXQeozmw9vE8J9YdmPQziyhuDjev1AM';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

function updateAPIUrlWithNewCount(picCount){
    console.log(initialCount);
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`; 
}

//Check if all images were load
//called for each individual image.
function imageLoaded(){    
    imagesLoaded++;
    if(imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;
        //print ready true|false  
        count = 30;
    }
}

// Helper FUnction to Set Attribute on DOM Elements
function setAttributes(element, attributes){
    // key = href title of attributes
    //attributes = object that containing both key and value 
    for(const key in attributes){
        element.setAttribute(key,  attributes[key]);
    }
}

//Create elements for links & photo, Add to DOM
function displayPhotos(){    
    //reset imagesLoaded for infinity scroll
    imagesLoaded = 0;
    //number of value for the amount of object within array
    totalImages = photoArray.length;
    photoArray.forEach((photo) => {      
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        
        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });
        //Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer Element
        // parent added a new child        
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
    
}

// Get photo from unsplash API
async function getPhotos(){
    try {
        const response = await fetch(apiUrl);
        photoArray = await response.json();
        displayPhotos();
        if(isInitialLoad){
            updateAPIUrlWithNewCount(30);   
            isInitialLoad = false;
        }
    } catch (error) {
        // Catch error here
    }
}

//Check to see if scrolling near bottom of page, Load more photos
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready){
        ready = false;
        getPhotos();        
    }
});


getPhotos();
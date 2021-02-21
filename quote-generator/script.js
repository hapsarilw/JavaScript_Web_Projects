const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteButton = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoadingSpinner(){
    loader.hidden = false;
    quoteContainer.hidden = true;
}

//Hide Loading
function removeLoadingSpinner(){
    if(!loader.hideen){
        loader.hidden = true;
        quoteContainer.hidden = false;   
    }
}

//Get quote from API
async function getQuote(){
    /* Add loader before get data of quote*/
    showLoadingSpinner();

    let counter = 0;

    /* create proxy to solve CORS policy */
    const proxyUrl = 'https://radiant-bayou-82449.herokuapp.com/';
    const apiURL = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try{
        /* async -> response & data set after fetch & response process done */
        const response = await fetch(proxyUrl + apiURL); //API call using headers from proxy call
        const data = await response.json(apiURL);
        // If author is blank, add 'Unknown'
        if(data.quoteAuthor === ''){
            authorText.innerText = 'unknown';            
        }
        else{
            authorText.innerText = data.quoteAuthor;
        }

        if(data.quoteText.length > 120 ){
            quoteText.classList.add('long-quote');
        }
        else{
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText; /* dari query POST-> <quoteText> */
        
        //Stop loader, Show Quote
        removeLoadingSpinner();
    }
    catch(error){
        console.log(error);       
    }
}

//Tweet Quote
function tweetQuote(){
    /* GET data from html */
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    /* set link and opened new tab to URL */
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

//Event Listeners
/* Anytime 'click' -> running function */
newQuoteButton.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);


//OnLoad
getQuote();

    
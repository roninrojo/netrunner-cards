const htmlResults = document.querySelector(".results");
const filterId = document.querySelector('#filter_identity');
const filterSet = document.querySelector('#filter_set');


// Objeto / Array donde copiar los resultados para hacer doble filtro
let cardsData = [];

window.onload = () => {
    loadData()
        .then(data => {
            filterId.addEventListener('change', (e)=> cardFilterIds(e,cardsData))
            filterSet.addEventListener('change', (e)=> cardFilterSets(e))
        })
        .catch ( err => console.log(err))
}

const cleanHTML = (el) => { while (el.firstChild) el.firstChild.remove() };

async function loadData() {
    console.log("fecthing... 👀");

    callLoader();
    
    const API = "https://netrunnerdb.com";
    
    const url_cards = "/api/2.0/public/cards";
    
    try {
        const respCards = await fetch(API + url_cards);
        const cards = await respCards.json();
        const { data } = cards;
        const sgCards = data.filter( card  => card.pack_code === "sg" && card.type_code === "identity" )
        const suCards = data.filter( card => card.pack_code === "su21" && card.type_code === "identity")

        const totalCards = [...suCards, ...sgCards];
        cardsData = [...totalCards];

        fillResults(totalCards);

        return totalCards;
    } catch (error) {
        console.log(error);
        
    }
}


function cardFilterIds(e, data) {
    
    const value = Number(e.target.value);

    console.log(data);
    
    switch (value) {

        case 0:
            fillResults(data);
            cardsData = [...data];
            break;

        case 1:
            const runnerCards = data.filter(card => card.side_code === "runner");
            cardsData = [...runnerCards];
            fillResults(runnerCards);
            break;
            
        case 2:
            const corpCards = data.filter(card => card.side_code === "corp");
            cardsData = [...corpCards];
            fillResults(corpCards);
            
            break;
    
        default:
            fillResults(data);
            break;
    }
}

function cardFilterSets(e) {
    const value = Number(e.target.value);
    console.log('cardData: ');
    console.log(cardsData);
    console.log('value: ');
    console.log(value);
    
    switch (value) {
        case 0:
            const bothCards = cardsData.filter(card => card.pack_code === "sg" || card.pack_code === "su21");
            console.log((bothCards));
            
            fillResults(bothCards);
            break;
        case 1:
            const sgCards = cardsData.filter(card => card.pack_code === "sg");
            console.log('sgCards: ');
            console.log(sgCards);
            cardsData = [...sgCards];
            fillResults(sgCards);

            break;
        case 2:
            const suCards = cardsData.filter(card => card.pack_code === "su21");
            console.log('suCards:' + suCards);
            cardsData = [...suCards];
            fillResults(suCards);

            break;

        default:
            fillResults(cardsData);
            break;
    }
    
}

function fillResults(cards) {

    cleanHTML(htmlResults);

    cards.forEach(card => {
        const url_decks_filter = `https://netrunnerdb.com/en/decklists/find?&cards%5B%5D=${card.code}&sort=popularity&packs%5B%5D=su21&packs%5B%5D=sg`;

        //https://static.nrdbassets.com/v1/large/${card.code}.jpg
        const htmlCard = `<picture class="card"><a target="_blank" href="<${url_decks_filter}"><img src="https://static.nrdbassets.com/v1/large/${card.code}.jpg"></a></picture>`;
        htmlResults.innerHTML += htmlCard;

    });
} 

function callLoader() {
    cleanHTML(htmlResults);
    const loader = '<span class="loader"></span>';
    htmlResults.innerHTML = loader;

}


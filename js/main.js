var saveBtn = document.querySelector("button.save");
var saveAllBtn = document.querySelector("button.saveall");
var card = document.querySelector("section");
var cardList = document.querySelector(".cardList");

function saveCard( cb ) {
  html2canvas(card, {
    onrendered: function(canvas) {
      canvas.toBlob(function(blob) {
          saveAs(blob, cardFields.name.innerHTML+".png");
          if (cb){ cb() };
      });
    }
  });
}

saveBtn.onclick = function() {
  saveCard();
}

saveAllBtn.onclick = function() {
  saveAllEachCard( 0 );
}

function saveAllEachCard( thisCard ) {
  setUpCard(thisCard);
  saveCard(() => {
    if ( thisCard < cardData.length-1 ) {
      saveAllEachCard( thisCard+1 );
    }
  });
}

var cardFiles = [ "ability.json", "defensive.json", "offensive.json" ];
var cardData = [];
var downloadedCards = 0;

var xhttp = new XMLHttpRequest();

function getCardData( index ) {
  xhttp.open("GET", "data/"+cardFiles[index], true);
  xhttp.send();
}

getCardData( downloadedCards );

xhttp.onload = function() {
  var thisCardData = JSON.parse( this.responseText );
  cardList.innerHTML += "<li class='category'>" + cardFiles[downloadedCards] + "</li>";

  for (i of thisCardData) {
    cardList.innerHTML += "<li class='card' data-index='"+cardData.length+"'>" + i.name + "</li>";
    cardData.push( i );
  }

  downloadedCards += 1;

  if ( downloadedCards < cardFiles.length ) {
    getCardData( downloadedCards );
  } else {
    updateBehaviour();
  }
};

var cardFields = {
  "name": document.querySelector("div.name"),
  "image": document.querySelector("header"),
  "desc": document.querySelector("main"),
  "reqs": document.querySelector("div.reqs"),
  "time": document.querySelector("div.time")
}

function setUpCard( index ) {
  cardFields.name.innerHTML = cardData[index].name;
  cardFields.desc.innerHTML = cardData[index].desc;
  cardFields.reqs.innerHTML = cardData[index].reqs;
  cardFields.time.innerHTML = cardData[index].time;

  cardFields.image.style.backgroundImage = "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.5) 100%), url('images/"+cardData[index].image+"')"
}

function updateBehaviour() {
  var cardDOMs = document.querySelectorAll("li.card");

  for (cardDOM of cardDOMs) {
    cardDOM.onclick = function() {
      setUpCard( this.dataset.index );
    }
  }
}

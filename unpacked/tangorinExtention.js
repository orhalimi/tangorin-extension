//TODO:
//no results will get only the word
// costum card creation

const entrie = document.getElementsByClassName("entry");
const newline = " \n"; //now line in text area workd only with space
const popup = document.createElement("div");
const body = document.getElementsByTagName("body")[0];
const textarea_counter = 3;
const dataStorage = window.localStorage;

let textareasArr = [];
let popupExist = false;
let entry, searchInput, searchInputWithFurigana, searchInputTranslate;
let sentenceWithoutFurigana, sentenceWithFurigana, sentenceTranslate, kanji_with_pronce;

function createBtns() {
  for (j = 0; j < entrie.length; j++) {
    btn = document.createElement("a");
    btn.className = "entry-menu btn btn-link tangorin-extension";
    i = document.createElement("i");
    i.className = "icon-plus-sign";
    btn.appendChild(i);
    btn.addEventListener("click", getData)
    entrie[j].insertBefore(btn, entrie[j].children[0].nextSibling);
  }
}

function clear_data() {
  searchInput = document.getElementById("searchInput").value;
  searchInputTranslate = sentenceWithoutFurigana = sentenceWithFurigana = sentenceTranslate = "";
  searchInputWithFurigana = searchInput;
}

function kanji_parser(item) {
  /* if got kanji, get it with the furigana
  else get the word only
  kanji - the kanji
  tail - the rest of the word without kanji
  kanji_furigana - the furigana on to pf the word*/

  let full_word, kanji, tail;
  // if it has a kanji
  if (item.getElementsByTagName("ruby")[0]) {
    kanji = item.getElementsByTagName("rb")[0].innerText;
    tail = item.innerText.replace(item.getElementsByTagName("ruby")[0].innerText, "");
    kanji_furigana = item.getElementsByTagName("rt")[0].innerText;
    sentenceWithoutFurigana += kanji + tail;
    if ((kanji + tail) == searchInput) {
      full_word = kanji + tail;
      sentenceWithFurigana += full_word;
    } else {
      sentenceWithFurigana += " " + kanji + "[" + kanji_furigana + "]" + tail;
    }
  } else {
    full_word = item.innerText;
    sentenceWithoutFurigana += full_word;
    sentenceWithFurigana += full_word;
  }
  return full_word;
}

function furiganaParser(kanaItems) {
  // get translate and word hiragana for the asked word
  let all_furigana = "";
  for (i = 0; i < kanaItems.length; i++) {
    let furigana = kanaItems[i].getElementsByTagName("rb")[0].innerText;
    // if search is not kanji we dont need the furigana
    if (furigana == searchInput) {
      continue;
    } else if (i > 0) {
      all_furigana += " · ";
    }
    all_furigana += furigana;
  }
  if (all_furigana != "") {
    searchInputWithFurigana += "[" + all_furigana + "]";
  }
}

function transactionParser(tansaction) {
  for (let i = 0; i < translation.length; i++) {
    searchInputTranslate += translation[i].getElementsByClassName("eng")[0].innerText;
    if (sentenceTranslate.slice(-1) != ";") {
      searchInputTranslate += ";"
    }
  }
}

function getData() {
  clear_data();
  if(!alreadySawTooltip()) {
    MarkTooltipAsSeen();
  }
  popup.style.visibility = "visible";
  entry = this.parentElement;
  if (!searchInput) {
    console.log("please insert something to search");
  } else {
    sentenceTranslate = entry.getElementsByClassName("ex-dd ex-en")[0].innerText;
    let raw_sentence = entry.getElementsByClassName("ex-dt")[0];
    let found_searched_word = false;
    for (i = 0; i < raw_sentence.children.length; i = i + 1) {
      let parsedWord = kanji_parser(raw_sentence.children[i]);
      // get translate and word hiragana for the asked word
      if (!found_searched_word && searchInput == parsedWord) {
        found_searched_word = true;
        raw_sentence.children[i].click();
        setTimeout(function () {
          inlineEntry = entry.getElementsByClassName("inline-entry")[0];
          kanaItems = inlineEntry.getElementsByClassName("kana")[0].getElementsByTagName("ruby");

          //get all hiraganas writing for the specific word
          furiganaParser(kanaItems);

          //get translation
          translation = inlineEntry.getElementsByTagName("dd")[0].getElementsByTagName("ol")[0].children;
          transactionParser(translation);

          //get all kanji objects in the inline word
          let allKanji = inlineEntry.getElementsByClassName("stlh");
          allKanji[0].click();
          setTimeout(getKanjiProncAndMeaning, 1600, allKanji, 0); //1 because starting from the next index
        }, 900);
      }
    }
    setTimeout(printResults, 1500);
    if (!found_searched_word) {
      alert("The searched word wasn't found in the sentence. Not all the results will be shown");
    }
  }
};

function getKanjiProncAndMeaning(allKanji, indexNum) {
  let kanji = allKanji[indexNum].innerText;
  let kanjiPronces = [];
  let kanjiTranslations = [];

  let inlineEntry = entry.getElementsByClassName("inline-entry")[1];
  let proncesBlocks = inlineEntry.getElementsByClassName("kana")[0].getElementsByTagName("ruby");
  let translationBlocks = inlineEntry.getElementsByClassName("k-lng-en")[0].getElementsByTagName("b");

  // get all different procnces
  for (i = 0; i < proncesBlocks.length; i++) {
    let pronce = proncesBlocks[i].getElementsByTagName("rb")[0].innerText.split(".")[0];
    if (!kanjiPronces.includes(pronce)) {
      kanjiPronces.push(pronce);
    }
  }

  // get all trasactions
  for (let i = 0; i < translationBlocks.length; i++) {
    kanjiTranslations.push(translationBlocks[i].innerText);
  }
  textareasArr[2].value += newline + kanji + " - " + kanjiPronces.join("    ") + newline + kanjiTranslations.join(";  ");
  indexNum++;
  if (indexNum < allKanji.length) {
    allKanji[indexNum].click();
    setTimeout(getKanjiProncAndMeaning, 1200, allKanji, indexNum);
  }
}

function printResults() {
  textareasArr[0].value = searchInput + newline + sentenceWithoutFurigana + newline;
  textareasArr[1].value = sentenceWithFurigana;
  textareasArr[2].value = sentenceTranslate + newline +
    searchInputWithFurigana + " - " + searchInputTranslate + newline;

  console.log("searchInput:" + searchInput);
  console.log("searchInput with furigana:" + searchInputWithFurigana);
  console.log("searchInput translate:" + searchInputTranslate);
  console.log("sentence translate:" + sentenceTranslate);
  console.log("without furigana:" + sentenceWithoutFurigana);
  console.log("with furigana:" + sentenceWithFurigana);
}

function createPopup() {
  if (!popupExist) {
    popup.classList.add('ex-popup');
    popup.style.visibility = "hidden";
    createXBtn();
    createTextarea();
    body.appendChild(popup);
    mapTextareas();
    popupExist = true;
  }
}

function createTextarea() {
  [...Array(textarea_counter).keys()].forEach(function (counter) {
    let textarea = document.createElement("textarea");
    textarea.id = "ex-textarea-" + (counter + 1);
    textarea.rows = 5;
    popup.appendChild(textarea);
  });
}

function createXBtn() {
  const removeBtn = document.createElement("a");
  removeBtn.innerHTML = "✖";
  removeBtn.onclick = function () {
    popupExist = false;
    popup.style.visibility = "hidden";
  };
  popup.appendChild(removeBtn);
}

function mapTextareas() {
  [...Array(textarea_counter).keys()].forEach(function (counter) {
    textareasArr.push(document.getElementById("ex-textarea-" + (counter + 1)));
  });
}

function applyTooltip() {

  const firstBtn = document.getElementsByClassName("tangorin-extension")[0];
  firstBtn.setAttribute("data-balloon","Click on the red + button near the desired sentence to start");
  firstBtn.setAttribute("data-balloon-pos","up");
  firstBtn.setAttribute("data-balloon-visible","");

};

function alreadySawTooltip(){
  return dataStorage.getItem("sawTooltip");
}

function MarkTooltipAsSeen(){
  const firstBtn = document.getElementsByClassName("tangorin-extension")[0];
  firstBtn.removeAttribute("data-balloon");
  firstBtn.setAttribute("data-balloon-pos","up");
  firstBtn.setAttribute("data-balloon-visible","");
  dataStorage.setItem("sawTooltip", true);
}

function init() {
  createBtns();
  createPopup();
   !alreadySawTooltip() && applyTooltip();
}

init();
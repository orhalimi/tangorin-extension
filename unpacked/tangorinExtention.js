//no results will get only the word
// make the code cleaner
// create a picture for it in google ext lib

var entrie = document.getElementsByClassName("entry");
var entry;
var searchInput;
var searchInput_with_furigana;
var searchInput_translate;

var sentence_without_furigana;
var sentence_with_furigana;
var sentence_translate;
var kanji_with_pronce;

function set_buttons() {
  for (j = 0; j < entrie.length; j++) {
    btn = document.createElement("button");
    btn.className = "entry-menu btn btn-link tangorin-extension";
    btn.style.color = "red";
    btn.style["margin-top"] = "18px";
    var searchInput_translate = ""
    i = document.createElement("i");
    i.className = "icon-plus-sign";
    btn.appendChild(i);
    btn.addEventListener("click", get_data)
    entrie[j].appendChild(btn);
  }
}

function clear_data() {
  searchInput = document.getElementById("searchInput").value;
  searchInput_translate = "";
  sentence_without_furigana = "";
  sentence_with_furigana = "";
  sentence_translate = "";
  searchInput_with_furigana = searchInput;
}


function kanjiParser(item) {
  /* if got kanji, get it with the furigana
  else get the word only
  kanji - the kanji
  tail - the rest of the word without kanji
  kanji_furigana - the furigana on to pf the word*/
  var full_word;
  var kanji;
  var tail;
  // if it has a kanji
  if (item.getElementsByTagName("ruby")[0]) {
    kanji = item.getElementsByTagName("rb")[0].innerText;
    tail = item.innerText.replace(item.getElementsByTagName("ruby")[0].innerText, "");
    kanji_furigana = item.getElementsByTagName("rt")[0].innerText;
    sentence_without_furigana += kanji + tail;
    if ((kanji + tail) == searchInput) {
      full_word = kanji + tail;
      sentence_with_furigana += full_word;
    } else {
      sentence_with_furigana += " " + kanji + "[" + kanji_furigana + "]" + tail;
    }
  } else {
    full_word = item.innerText;
    sentence_without_furigana += full_word;
    sentence_with_furigana += full_word;
  }
  return full_word;
}


function furiganaParser(kana_items) {
  // get translate and word hiragana for the asked word
  var all_furigana = "";
  for (i = 0; i < kana_items.length; i++) {
    var furigana = kana_items[i].getElementsByTagName("rb")[0].innerText;
    // if search is not kanji we dont need the furigana
    if (furigana == searchInput) {
      continue;
    } else if (i > 0) {
      all_furigana += " · ";
    }
    all_furigana += furigana;
  }
  if (all_furigana != "") {
    searchInput_with_furigana += "[" + all_furigana + "]";
  }
}


function get_data() {
  clear_data();
  entry = this.parentElement;
  if (!searchInput) {
    console.log("please insert something to search");
  } else {
    sentence_translate = entry.getElementsByClassName("ex-dd ex-en")[0].innerText;
    var raw_sentence = entry.getElementsByClassName("ex-dt")[0];
    var found_searched_word = false;
    for (i = 0; i < raw_sentence.children.length; i = i + 1) {
      var parsedWord = kanjiParser(raw_sentence.children[i]);
      // get translate and word hiragana for the asked word
      if (!found_searched_word && searchInput == parsedWord) {
        found_searched_word = true;
        raw_sentence.children[i].click();
        setTimeout(function () {
          inline_entry = entry.getElementsByClassName("inline-entry")[0];
          kana_items = inline_entry.getElementsByClassName("kana")[0].getElementsByTagName("ruby");
          //get all hiraganas writing for the specific word
          furiganaParser(kana_items);
          //get translation
          translation = inline_entry.getElementsByTagName("dd")[0].getElementsByTagName("ol")[0].children;
          for (var i = 0; i < translation.length; i++) {
            searchInput_translate += translation[i].getElementsByClassName("eng")[0].innerText;
            if (sentence_translate.slice(-1) != ";") {
              searchInput_translate += ";"
            }
          }
          var allKanji = inline_entry.getElementsByClassName("stlh");
          allKanji[0].click();
          setTimeout(getKanjiProncAndMeaning, 1600, allKanji, 0);
        }, 900);
      }
    }
    setTimeout(print_results, 1500);
    if (!found_searched_word) {
      alert("The search word wasn't found in the sentence. Not all the results are shown")
    }
  }
};

function getKanjiProncAndMeaning(allKanji, indexNum) {
  var kanji = allKanji[indexNum].innerText;
  var kanji_pronces = [];
  var kanji_translations = [];

  var inline_entry = entry.getElementsByClassName("inline-entry")[1];
  var pronces_blocks = inline_entry.getElementsByClassName("kana")[0].getElementsByTagName("ruby");
  var translation_blocks = inline_entry.getElementsByClassName("k-lng-en")[0].getElementsByTagName("b");

  for (i = 0; i < pronces_blocks.length; i++) {
    var pronce = pronces_blocks[i].getElementsByTagName("rb")[0].innerText.split(".")[0];
    var isAlreadyExsist = false;
    if (!kanji_pronces.includes(pronce)) {
      kanji_pronces.push(pronce);
    }
  }
  for (var i = 0; i < translation_blocks.length; i++) {
    kanji_translations.push(translation_blocks[i].innerText);
  }
  newline = " \n";
  a_textArea.value += newline + kanji + " - " + kanji_pronces.join("    ") + newline + kanji_translations.join(";  ");
  if (indexNum < allKanji.length) {
    indexNum++;
    allKanji[indexNum].click();
    setTimeout(getKanjiProncAndMeaning, 1200, allKanji, indexNum);
  }
}


//post results
function print_results() {
  newline = " \n";
  q_textArea.value = searchInput + newline + sentence_without_furigana + newline + "בלי פוריגנה";
  s_textArea.value = sentence_with_furigana;
  a_textArea.value = sentence_translate + newline +
    searchInput_with_furigana + " - " + searchInput_translate + newline;

  console.log("searchInput:" + searchInput);
  console.log("searchInput with furigana:" + searchInput_with_furigana);
  console.log("searchInput translate:" + searchInput_translate);
  console.log("sentence translate:" + sentence_translate);
  console.log("without furigana:" + sentence_without_furigana);
  console.log("with furigana:" + sentence_with_furigana);

}

function create_textArea(id, row = 3) {
  item = document.createElement("textarea");
  item.id = id;
  item.style.margin = "10px 0px 10px 0px"
  item.cols = 45;
  item.rows = row;
  // left_container.appendChild(item);
  return item;
}

function createDiv(classname, id) {
  item = document.createElement("div");
  item.className = classname;
  item.id = id;
  return item;
}
q_textArea = create_textArea("anki_question");
s_textArea = create_textArea("anki_sentence");
a_textArea = create_textArea("anki_answer", 6);

right_container = createDiv("right-container", "");

right_container.appendChild(createDiv("row", "div1")).appendChild(q_textArea);
right_container.appendChild(createDiv("row", "div2")).appendChild(s_textArea);
right_container.appendChild(createDiv("row", "div3")).appendChild(a_textArea);

document.getElementById("dictPanel").appendChild(right_container);

set_buttons();

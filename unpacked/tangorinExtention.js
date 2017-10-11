//TODO:
//no results will get only the word
// costum card creation

let entrie = document.getElementsByClassName("entry");
let entry, searchInput, searchInput_with_furigana, searchInput_translate;
let sentence_without_furigana, sentence_with_furigana, sentence_translate, kanji_with_pronce;

const newline = " \n"; //now line in text area workd only with space

var popup = document.createElement("div");
var textarea_counter = 3;
var textareas_arr = [];
var popupExist = false;
var body = document.getElementsByTagName("body")[0];

function create_btns() {
  for (j = 0; j < entrie.length; j++) {
    btn = document.createElement("a");
    btn.className = "entry-menu btn btn-link tangorin-extension";
    btn.style.color = "red";
    i = document.createElement("i");
    i.className = "icon-plus-sign";
    btn.appendChild(i);
    btn.style.clear ="both"
    btn.addEventListener("click", get_data)
    entrie[j].insertBefore(btn, entrie[j].children[0].nextSibling);
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

function kanji_parser(item) {
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

function furigana_parser(kana_items) {
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

function tansaction_parser(tansaction) {
  for (var i = 0; i < translation.length; i++) {
    searchInput_translate += translation[i].getElementsByClassName("eng")[0].innerText;
    if (sentence_translate.slice(-1) != ";") {
      searchInput_translate += ";"
    }
  }
}

function get_data() {
  clear_data();
  popup.style.visibility = "visible";
  entry = this.parentElement;
  if (!searchInput) {
    console.log("please insert something to search");
  } else {
    sentence_translate = entry.getElementsByClassName("ex-dd ex-en")[0].innerText;
    var raw_sentence = entry.getElementsByClassName("ex-dt")[0];
    var found_searched_word = false;
    for (i = 0; i < raw_sentence.children.length; i = i + 1) {
      var parsedWord = kanji_parser(raw_sentence.children[i]);
      // get translate and word hiragana for the asked word
      if (!found_searched_word && searchInput == parsedWord) {
        found_searched_word = true;
        raw_sentence.children[i].click();
        setTimeout(function () {
          inline_entry = entry.getElementsByClassName("inline-entry")[0];
          kana_items = inline_entry.getElementsByClassName("kana")[0].getElementsByTagName("ruby");

          //get all hiraganas writing for the specific word
          furigana_parser(kana_items);

          //get translation
          translation = inline_entry.getElementsByTagName("dd")[0].getElementsByTagName("ol")[0].children;
          tansaction_parser(translation);

          //get all kanji objects in the inline word
          var allKanji = inline_entry.getElementsByClassName("stlh");
          allKanji[0].click();
          setTimeout(get_kanji_pronc_and_meaning, 1600, allKanji, 0); //1 because starting from the next index
        }, 900);
      }
    }
    setTimeout(print_results, 1500);
    if (!found_searched_word) {
      alert("The search word wasn't found in the sentence. Not all the results are shown");
    }
  }
};

function get_kanji_pronc_and_meaning(allKanji, indexNum) {
  var kanji = allKanji[indexNum].innerText;
  var kanji_pronces = [];
  var kanji_translations = [];

  var inline_entry = entry.getElementsByClassName("inline-entry")[1];
  var pronces_blocks = inline_entry.getElementsByClassName("kana")[0].getElementsByTagName("ruby");
  var translation_blocks = inline_entry.getElementsByClassName("k-lng-en")[0].getElementsByTagName("b");

  // get all different procnces
  for (i = 0; i < pronces_blocks.length; i++) {
    var pronce = pronces_blocks[i].getElementsByTagName("rb")[0].innerText.split(".")[0];
    if (!kanji_pronces.includes(pronce)) {
      kanji_pronces.push(pronce);
    }
  }

  // get all trasactions
  for (var i = 0; i < translation_blocks.length; i++) {
    kanji_translations.push(translation_blocks[i].innerText);
  }
   textareas_arr[2].value += newline + kanji + " - " + kanji_pronces.join("    ") + newline + kanji_translations.join(";  ");
  indexNum++;
  if (indexNum < allKanji.length) {
    allKanji[indexNum].click();
    setTimeout(get_kanji_pronc_and_meaning, 1200, allKanji, indexNum);
  }
}

function print_results() {
  textareas_arr[0].value = searchInput + newline + sentence_without_furigana + newline + "בלי פוריגנה";
  textareas_arr[1].value = sentence_with_furigana;
  textareas_arr[2].value = sentence_translate + newline +
    searchInput_with_furigana + " - " + searchInput_translate + newline;

  console.log("searchInput:" + searchInput);
  console.log("searchInput with furigana:" + searchInput_with_furigana);
  console.log("searchInput translate:" + searchInput_translate);
  console.log("sentence translate:" + sentence_translate);
  console.log("without furigana:" + sentence_without_furigana);
  console.log("with furigana:" + sentence_with_furigana);
  //chrome.runtime.sendMessage({greeting: "hello"});

}

function create_popup() {
  if (!popupExist) {
    popup.classList.add('ex-popup');
    popup.style.visibility = "hidden";
    create_remove_btn();
    create_textarea();
    body.appendChild(popup);
    map_textareas();
    popupExist = true;
  }
}

function create_textarea() {
  [...Array(textarea_counter).keys()].forEach(function (counter) {
    var textarea = document.createElement("textarea");
    textarea.id = "ex-textarea-" + (counter + 1);
    textarea.rows = 5;
    popup.appendChild(textarea);
  });
}

function create_remove_btn() {
  var remove_btn = document.createElement("a");
  remove_btn.innerHTML = "✖";
  remove_btn.onclick = function () {
    popupExist = false;
    popup.style.visibility = "hidden";
  };
  popup.appendChild(remove_btn);
}

function map_textareas() {
[...Array(textarea_counter).keys()].forEach(function (counter) {
    textareas_arr.push(document.getElementById("ex-textarea-" + (counter + 1)));
  });
}


function init() {
  create_btns();
  create_popup();
}

init();



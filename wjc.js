/*
    "Cheating at Word Jumble Games"

    Remember to always use your powers for good! But not today...

    Suppose you're playing a word jumble game. You are given 7 random letters and you
    must find as many words as possible that use those letters.

    For example, suppose you were given the following letters:
        S U B W A Y S

    You could use these letters to form the word "subways"
    You could also create the words "sway" and "busy", among others.

    Write a function called jumbleCheat that takes in a 7-letter string and returns a list
    of all valid English words that you can create with those letters. This list should be
    sorted by longest to shortest and only include words that are at least 3 letters long.

    Examples:
        jumbleCheat("abcdefg") --> ["face", "age", "bad", "bag", "bed"]
        jumbleCheat("nopqrst") --> ["sport", "sort", "stop", "nor", "not", "son", "top"]
        jumbleCheat("ilmslpe") --> ["simple", "smile", "sell", "lie"] // "Thank you for shopping at Bob's Used Cars!"

    To get a list of English words, we have provided you with a function in util/ called
    getWords() which returns a list of strings containing many English words. This list
    will be used as the basis for the expected output in the Mia tests.
*/

const { getWords } = require('../util/WordList.js');

let wordBank = null;

/**
 * Finds all the English words that can be generated with a set of letters.
 * @param {string} letters a set of letters as a string
 * @returns {Array<string>} list of words that can be generated with the letters
 */
const jumbleCheat = (letters) => {
  // Build a lookup table that matches any combination of letters to the words
  // that contain those letters. The key is the sorted letters and the value is
  // a list of all words that have exactly those letters.
  if (wordBank === null) {
    wordBank = {};
    for (let word of getWords()) {
      let wordLetters = word.toLowerCase().split('');
      wordLetters.sort();
      let key = wordLetters.join('');
      let entry = wordBank[key];
      if (!entry) {
        entry = [];
        wordBank[key] = entry;
      }
      entry.push(word);
    }
  }

  // Get a list of all combinations subsets of letters.
  let combinations = getCombinations(letters);

  // We only want words that are longer than 3 letters.
  combinations = combinations.filter((s) => s.length >= 3);

  let output = [];
  for (let combo of combinations) {
    let matches = wordBank[combo];
    if (matches) {
      for (let match of matches) {
        output.push(match);
      }
    }
  }

  output.sort((a, b) => {
    if (a.length != b.length) {
      return a.length < b.length ? 1 : -1;
    }
    return a.localeCompare(b);
  });

  return output;
};

// You can think of finding all combinations as a balanced binary tree recursion.
// Each level of the tree represents a different item in the set.
// Each child branch represents "with" and "without".
const getCombinations = (str) => {
  let chars = str.split('');
  chars.sort();
  let output = [];
  let deduplicate = {};
  let stringBuilder = [];

  let recurse = (i) => {
    if (i === chars.length) {
      let s = stringBuilder.join('');
      if (!deduplicate[s]) {
        output.push(s);
        deduplicate[s] = true;
      }
    } else {
      // Recurse to the next letter without using this current letter.
      recurse(i + 1);

      // Recurse to the next letter while using this current letter.
      stringBuilder.push(chars[i]);
      recurse(i + 1);
      stringBuilder.pop();
    }
  };
  recurse(0);
  return output;
};

module.exports = { jumbleCheat };

const func = {};
window.onload = (function () {
  let gameover = false;
  let wrong = 0;
  const bodyparts = ['head', 'eye1', 'eye2', 'mouth', 'stick', 'arm1', 'arm2', 'leg1', 'leg2'];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const randint = (min, max, int) => (int ? Math.floor(randint(min, max + 1)) : Math.random() * (max - min) + min);
  function process (str, extra) {
    if (gameover) return;
    if (!str) return;
    if (str[0] === '[' && str[str.length - 1] === ']') {
      let arr = JSON.parse(str);
      return arr[randint(0, arr.length - 1, true)];
    }
    if (str.split('-').length === 2) {
      let arr = str.split('-').map(n => parseInt(n));
      let letters = (function () {
        let alphObj = [];
        for (let l of alphabet) alphObj.push({letter: l, copies: 0});
        for (let letter of extra[0].split('')) {
          if (letter === ' ') continue;
          alphObj[alphabet.indexOf(letter)].copies++;
        }
        return alphObj;
      })().filter(l => l.copies > 0 && l.copies <= arr[1]);
      let hint = [];
      for (let i = 0; i < arr[0]; i++) {
        let rand = randint(0, letters.length - 1, true);
        hint.push(letters[rand].letter);
        letters.splice(rand, 1);
      }
      return hint;
    }
    return str;
  }
  function makeSpaces (w) {
    if (gameover) return;
    if (!w) return;
    w = w.split('');
    let html = '';
    for (let i in w) {
      let letter = w[i];
      html += `
        <div id="letter-${i}" class="word-letter letter-${letter} ${(letter === ' ') ? 'shown' : 'hidden'}${letter === ' ' ? ' space' : ''}">
          <div id="letter-${i}-hidden" class="hiddenface face">
            _
          </div>
          <div id="letter-${i}-shown" class="shownface face">
            ${letter}
          </div>
        </div>
      `;
    }
    return html;
  }
  function elementsByClassName (name) {
    if (gameover) return;
    let a = document.getElementsByClassName('hidden');
    let r = [];
    for (let e of a) r.push(e);
    return r;
  }
  function reveal (letter) {
    if (gameover) return;
    let ids = elementsByClassName('hidden').filter(element => String(element.classList).indexOf(`letter-${letter}`) !== -1).map(element => String(element.id));
    for (let id of ids) {
      let element = document.getElementById(id);
      element.classList.toggle('hidden');
      element.classList.toggle('shown');
    }
    document.getElementById(`letter-${letter}`).classList.toggle(`guessed-${ids.length > 0 ? 'correct' : 'wrong'}`);
    if (elementsByClassName('shown').length === 0) {
      setTimeout(function () {alert('you won, refresh page to play again');}, 100);
      gameover = true;
    }
    if (ids.length === 0) {
      document.getElementById(bodyparts[wrong]).style.visibility = 'visible';
      wrong++;
      if (wrong === bodyparts.length) {
        setTimeout(function () {alert('you won, refresh page to play again');}, 100);
        gameover = true;
      }
    }
  }
  func.reveal = reveal;
  const word = process(window.prompt('array of words in JSON format to be randomly chosen from', '["hangman"]'));
  const hints = process(window.prompt('how many letters should be revealed? how many max copies can the letters that are revealed have? (format: "maxletters-maxcopies")', '1-3'), [word]);
  document.getElementById('hangman-word').innerHTML = makeSpaces(word);
  for (let hint of hints) reveal(hint);
});
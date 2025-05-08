const runeMap = {

    // Diphthonge (Doppel Konsonanten)
    'b': { weiche: '𐰋', harte: '𐰉' }, // eb/ab
    'v': { weiche: '𐰋', harte: '𐰉' }, // ev/av
    'd': { weiche: '𐰓', harte: '𐰑' }, // ed/ad
    'g': { weiche: '𐰏', harte: '𐰍' }, // eg/ag
    'ğ': { weiche: '𐰏', harte: '𐰍' }, // eğ/ağ
    'h': { weiche: '𐰚', harte: '𐰴' }, // eh/ah
    'k': { weiche: '𐰚', harte: '𐰴' }, // ek/ak
    'l': { weiche: '𐰠', harte: '𐰞' }, // el/al
    'n': { weiche: '𐰤', harte: '𐰣' }, // in/en/an
    'r': { weiche: '𐰼', harte: '𐰺' }, // er/ar
    's': { weiche: '𐰾', harte: '𐰽' }, // es/as
    't': { weiche: '𐱅', harte: '𐱃' }, // et/at
    'y': { weiche: '𐰘', harte: '𐰖' }, // ey/ay

    // Einzelne Konsonanten
    'c': '𐰲', // ac
    'ç': '𐰲', // aç
    'f': '𐰯', // af
    'm': '𐰢', // em
    'p': '𐰯', // ap
    'ş': '𐱁', // aş
    'nç': '𐰨', // anç
    'ny': '𐰪', // any
    'ñ': '𐰭', // eñ
    'lt': '𐰡', // alt
    'iç': '𐰱', // iç
    'nt': '𐰦', // ant
    'ök': '𐰰', // ök
    'ük': '𐰰', // ük
    'z': '𐰔', // az/ez
    'ok': '𐰹', // ok
    'ık': '𐰶', // ık

    // Vokale
    'a': '𐰀',
    'e': '𐰀',
    'ı': '𐰃',
    'i': '𐰃',
    'u': '𐰆',
    'ü': '𐰇',
    'o': '𐰆', // o = u
    'ö': '𐰇', // ö = ü

    // Lange Vokale
    'oo': '𐰸',
    'aa': '𐰴' 
};

const harteVokale = ['a', 'ı', 'u', 'o'];
const weicheVokale = ['e', 'i', 'ü', 'ö'];

// Elemente
const inputText = document.getElementById('inputText');
const runeOutput = document.getElementById('runeOutput');

// Silbenbildung (für Betonung und Strukturierung)
function getSilben(word) {
    const silben = [];
    let aktuelleSilbe = '';
    let i = 0;

    while (i < word.length) {
        aktuelleSilbe += word[i];

        // Prüfe auf zweibuchstabige Sequenzen
        if (i + 1 < word.length && runeMap[word.slice(i, i + 2)]) {
            aktuelleSilbe += word[i + 1];
            i += 2;
            silben.push(aktuelleSilbe);
            aktuelleSilbe = '';
        }
        // Einzelne Buchstaben
        else {
            // Wenn der aktuelle Buchstabe ein Vokal ist, beende die Silbe
            if (harteVokale.includes(word[i]) || weicheVokale.includes(word[i])) {
                // Füge den nächsten Konsonanten hinzu, falls vorhanden
                if (i + 1 < word.length && !harteVokale.includes(word[i + 1]) && !weicheVokale.includes(word[i + 1])) {
                    aktuelleSilbe += word[i + 1];
                    i += 2;
                } else {
                    i += 1;
                }
                silben.push(aktuelleSilbe);
                aktuelleSilbe = '';
            } else {
                i += 1;
            }
        }
    }

    if (aktuelleSilbe) {
        silben.push(aktuelleSilbe);
    }

    return silben;
}

// Betonung für eine Silbe bestimmen (basierend auf dem ersten Vokal)
function getSilbenton(syllable) {
    for (let char of syllable) {
        if (harteVokale.includes(char)) {
            return 'harte';
        } else if (weicheVokale.includes(char)) {
            return 'weiche';
        }
    }
    return 'harte';
}

function translateText() {
    const text = inputText.value.toLowerCase().trim();
    let runeText = [];
    
    const words = text.split(/[\s:]+/); // Split mit Leerzeichen oder :
    const separators = text.match(/[\s:]+/g) || []; // Speichere Trennzeichen

    words.forEach((word, wordIndex) => {
        if (!word) return;
        const silben = getSilben(word);

        silben.forEach((silbe) => {
            const silbenton = getSilbenton(silbe); // Betonung der Silbe
            let i = 0;

            while (i < silbe.length) {
                let seq = '';
                let rune = '';

                // Prüfe auf zweibuchstabige Sequenzen
                if (i + 1 < silbe.length && runeMap[silbe.slice(i, i + 2)]) {
                    seq = silbe.slice(i, i + 2);
                    rune = runeMap[seq];
                    i += 2;
                }
                // Prüfe auf einzelne Buchstaben
                else if (runeMap[silbe[i]]) {
                    seq = silbe[i];
                    let tone = silbenton;
                    if (silbenton === 'harte' && silbenton.includes(seq)) {
                        tone = 'weiche';
                    }
                    rune = typeof runeMap[seq] === 'string' ? runeMap[seq] : runeMap[seq][tone];
                    i += 1;
                }
                
                else {
                    seq = silbe[i];
                    rune = silbe[i];
                    i += 1;
                }

                runeText.push(rune);
            }
        });
        // Worttrennung mit : oder Leerzeichen
        if (wordIndex < words.length - 1 && separators[wordIndex]) {
            const separator = separators[wordIndex].includes(':') ? ':' : ' ';
            runeText.push(separator);
        }
    });
    // Ausgabe
    runeOutput.textContent = runeText.join('') || '';
}
// Event-Listener
inputText.addEventListener('input', translateText);
// Initiale Übersetzung
translateText();
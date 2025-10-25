// @ts-check

const vowels = 'aāáǎàeēéěèiīíǐìoōóǒòuūúǔùüǖǘǚǜ';
const tones = 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';

function separate(pinyin: string): string {
  return (
    pinyin
      .replace(new RegExp(`([${vowels}])([^${vowels}nr])`, 'gi'), '$1 $2') // This line does most of the work
      .replace(new RegExp('(w)([csz]h)', 'i'), '$1 $2') // double-consonant initials
      .replace(new RegExp(`(n)([^${vowels}vg])`, 'i'), '$1 $2') // cleans up most n compounds
      .replace(
        new RegExp(
          '([' + vowels + 'v])([^' + vowels + 'ws])([' + vowels + 'v])',
          'i',
        ),
        '$1 $2$3',
      ) // assumes correct Pinyin (i.e., no missing apostrophes)
      .replace(
        new RegExp('([' + vowels + 'v])(n)(g)([' + vowels + 'v])', 'i'),
        '$1$2 $3$4',
      ) // assumes correct Pinyin, i.e. changan = chan + gan
      .replace(new RegExp('([gr])([^' + vowels + '])', 'i'), '$1 $2') // fixes -ng and -r finals not followed by vowels
      //.replace(new RegExp('([^e\w\s])(r)'), '$1 $2'); // r an initial, except in er
      .replace(/\s{2,}/g, ' ') // remove double-spaces
  );
}

export default function separatePinyinInSyllables(pinyin: string, separateBySpaces?: boolean): string[] {
  if (!pinyin) {
    return [];
  }

  if (separateBySpaces) {
    return pinyin.split(String.fromCharCode(160));
  }

  const pinyinSeparated = separate(pinyin).split(' ');
  const newPinyin: string[] = [];

  pinyinSeparated.forEach((p) => {
    let totalTones = 1;
    let pregMatch = p.match(new RegExp(`([${tones}])`, 'g'));
    if (pregMatch) {
      totalTones = pregMatch.length;
    }

    if (p.length > 4 || totalTones > 1) {
      separate(p)
        .split(' ')
        .forEach((newP) => {
          pregMatch = newP.match(new RegExp(`([${tones}])`, 'g'));
          if (pregMatch) {
            totalTones = pregMatch.length;
          }

          if (newP.length > 4 || totalTones > 1) {
            separate(newP)
              .split(' ')
              .forEach((newP2) => {
                newPinyin.push(newP2.trim());
              });
          } else {
            newPinyin.push(newP.trim());
          }
        });
    } else {
      newPinyin.push(p.trim());
    }
  });

  return newPinyin;
}


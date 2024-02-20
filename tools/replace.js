import fs from 'fs';

const wrongAbbreviationsFile = '../src/assets/translations/asv.json';

const wrongAbbreviations = JSON.parse(
    fs.readFileSync(wrongAbbreviationsFile, 'utf8')
);
const rightAbbreviations = JSON.parse(
    fs.readFileSync('../src/assets/translations/kjv.json', 'utf8')
);

wrongAbbreviations.books = wrongAbbreviations.books.map((targetBook) => {
    const sourceBook = rightAbbreviations.books.find(
        (b) => targetBook.type === b.type
    );
    return {
        ...targetBook,
        verboseName: sourceBook.verboseName,
    };
});

fs.writeFileSync(wrongAbbreviationsFile, JSON.stringify(wrongAbbreviations));

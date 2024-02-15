import fs from 'fs';

const wrongAbbreviationsFile = '../src/assets/translations/sch.json';

const wrongAbbreviations = JSON.parse(
    fs.readFileSync(wrongAbbreviationsFile, 'utf8')
);
const rightAbbreviations = JSON.parse(
    fs.readFileSync('../src/assets/translations/lut.json', 'utf8')
);

wrongAbbreviations.books = wrongAbbreviations.books.map((targetBook) => {
    const sourceBook = rightAbbreviations.books.find(
        (b) => targetBook.type === b.type
    );
    return {
        ...targetBook,
        name: sourceBook.name,
    };
});

fs.writeFileSync(wrongAbbreviationsFile, JSON.stringify(wrongAbbreviations));

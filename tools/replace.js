import fs from 'fs';

const wrongAbbreviationsFile = '../src/assets/translations/elb.json';

const wrongAbbreviations = JSON.parse(
    fs.readFileSync(wrongAbbreviationsFile, 'utf8')
);
const rightAbbreviations = JSON.parse(
    fs.readFileSync('../src/assets/translations/sch.json', 'utf8')
);

wrongAbbreviations.books = wrongAbbreviations.books.map((targetBook) => {
    const sourceBook = rightAbbreviations.books.find(
        (b) => targetBook.type === b.type
    );
    return {
        ...targetBook,
        abbreviation: sourceBook.abbreviation,
    };
});

fs.writeFileSync(wrongAbbreviationsFile, JSON.stringify(wrongAbbreviations));

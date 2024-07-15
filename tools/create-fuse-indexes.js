import { glob } from 'glob';
import Fuse from 'fuse.js';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

const translationPaths = await glob.glob('../src/assets/translations/*.json');
translationPaths.forEach(path => {
    const { books, ...translation } = JSON.parse(readFileSync(path, 'utf-8'))
    const verses = books.flatMap(({ chapters, ...book }) => chapters.flatMap(({ verses, ...chapter }) => verses.map(verse => ({
        translation,
        book,
        chapter,
        verse
    }))))
    const index = Fuse.createIndex(['verse.text'], verses);
    mkdirSync(`../src/assets/indexes/${translation.id.toLowerCase()}`, { recursive: true });
    writeFileSync(`../src/assets/indexes/${translation.id.toLowerCase()}/index.json`, JSON.stringify(index.toJSON()), {});
    writeFileSync(`../src/assets/indexes/${translation.id.toLowerCase()}/verses.json`, JSON.stringify(verses));
});

// const index = Fuse.parseIndex(JSON.parse(readFileSync('./index.json')));
// const fuse = new Fuse(verses, undefined, index);
// console.log(fuse.search('Jesus', { limit: 5 }).map(({ item }) => item));

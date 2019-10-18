'use strict';

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const prompt = require('prompts');
const short = require('short-uuid');
const slugify = require('@sindresorhus/slugify');

const authorsData = require('../src/data/authors.json');
const quotesData = require('../src/data/quotes.json');
const tagsData = require('../src/data/tags.json');

const prettierOptions = {
  parser: 'json',
  singleQuote: true
};

const dataDir = path.join(__dirname, '../', 'src', 'data');

let interval;

(async function() {
  const questions = [
    {
      type: 'text',
      name: 'body',
      message: `Hey, what is the quote you want to add?`
    },
    {
      type: 'list',
      name: 'authors',
      message: `Ok, and who is the author? If there are more than one, use commas.`
    },
    {
      type: 'list',
      name: 'tags',
      message: 'What about some tags? Same stuff, use commas'
    }
  ];

  const { body, authors, tags } = await prompt(questions, {
    onCancel: cleanup,
    onSubmit: cleanup
  });

  const existingQuote = quotesData.find(quote => quote.body === body.trim());

  if (existingQuote) {
    // eslint-disable-next-line
    return console.error(`\nERROR: Quote already exists!`, existingQuote.uuid);
  }

  const existingAuthors = authorsData.filter(author =>
    authors.includes(author.name)
  );
  const existingTags = tagsData.filter(tag => tags.includes(tag.name));

  const parsed = {
    uuid: short.generate(),
    body,
    publish_date: new Date()
      .toJSON()
      .slice(0, 19)
      .replace('T', ' '),
    authors_uuid: existingAuthors.map(({ uuid }) => uuid),
    authors: existingAuthors.map(({ name }) => name),
    tags_uuid: existingTags.map(({ uuid }) => uuid),
    tags: existingTags.map(({ name }) => name)
  };

  const data = {};

  const newTags = tags.filter(tag => !tagsData.find(t => t.name === tag));
  if (newTags.length) {
    data.newTags = newTags.map(tag => {
      const uuid = short.generate();
      const name = tag.trim().toLowerCase();

      parsed.tags.push(name);
      parsed.tags_uuid.push(uuid);

      return {
        name,
        slug: slugify(tag),
        uuid
      };
    });
  }

  const newAuthors = authors.filter(
    author => !authorsData.find(t => t.name === author)
  );
  if (newAuthors.length) {
    data.newAuthors = newAuthors.map(author => {
      const uuid = short.generate();
      const name = author.trim();

      parsed.authors.push(name);
      parsed.authors_uuid.push(uuid);

      return {
        name,
        slug: slugify(author),
        uuid
      };
    });
  }

  if (data.newAuthors) {
    data.newAuthors.forEach(author => {
      authorsData.push(author);
    });
    fs.writeFileSync(
      path.join(dataDir, 'authors.json'),
      prettier.format(JSON.stringify(authorsData), prettierOptions)
    );
  }

  if (data.newTags) {
    data.newTags.forEach(tag => {
      tagsData.push(tag);
    });
    fs.writeFileSync(
      path.join(dataDir, 'tags.json'),
      prettier.format(JSON.stringify(tagsData), prettierOptions)
    );
  }

  // quotesData.forEach(quote => {
  //   delete quote.slug;
  //   delete quote.featured;
  // });

  quotesData.push(parsed);

  fs.writeFileSync(
    path.join(dataDir, 'quotes.json'),
    prettier.format(JSON.stringify(quotesData), prettierOptions)
  );
})();

function cleanup() {
  clearInterval(interval);
}

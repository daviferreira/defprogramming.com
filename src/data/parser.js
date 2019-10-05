const data = require('./quotes.json');

const parsed = [];

data.forEach(quote => {
  quote.authors = quote.authors.replace(/([{}"]+)/gi, '').split(',');
  quote.authors_slugs = quote.authors_slugs
    .replace(/([{}"]+)/gi, '')
    .split(',');
  quote.authors_uuid = quote.authors_uuid.replace(/([{}"]+)/gi, '').split(',');
  quote.authors_bios = quote.authors_bios.replace(/([{}"]+)/gi, '').split(',');

  quote.tags_name = quote.tags_name.replace(/([{}']+)/gi, '').split(',');
  quote.tags_uuid = quote.tags_uuid.replace(/([{}']+)/gi, '').split(',');
  quote.tags_slugs = quote.tags_slugs.replace(/([{}']+)/gi, '').split(',');

  parsed.push(quote);
});

console.log(JSON.stringify(parsed));

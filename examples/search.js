/**
 * Search documents with DisMax query or Lucene query
 */
const solr = require('../lib/solr');

const client = solr.createClient();

// DixMax query
const query = client
  .query()
  .q('laptop')
  .dismax()
  .qf({ title_t: 0.2, description_t: 3.3 })
  .mm(2)
  .start(0)
  .rows(10);
const obj = await client.search(query);
console.log(obj);

// Lucene query
const query2 = client.query().q({ title_t: 'laptop' }).start(0).rows(10);
const obj2 = await client.search(query2);
console.log(obj2);


/**
 * EdisMax Query
 *
 * You can use edismax query parser
 * It will set the `defType` as `edismax`
 *
 * @see <http://wiki.apache.org/solr/ExtendedDisMax>
 * @author Tolga Akyüz <me@tolgaakyuz.org>
 */
const query3 = client
  .query()
  .q('laptop')
  .edismax()
  .qf({ title_t: 0.2, description_t: 3.3 })
  .mm(2)
  .start(0)
  .rows(10);

const obj3 = await client.search(query3);
console.log(obj3);

/**
 * boost()
 *
 * You can use `boost()` query
 * in order to manipulate solr score
 * `boost()` is the multiplicative version of `bf()` which is additive
 * To use `boost()` do not forget `edismax()`
 *
 * @see <http://wiki.apache.org/solr/ExtendedDisMax#boost_.28Boost_Function.2C_multiplicative.29>
 * @author Tolga Akyüz <me@tolgaakyuz.org>
 */
const query4 = client
  .query()
  .q('laptop')
  .edismax()
  .qf({ title_t: 0.2, description_t: 3.3 })
  .boost('3') // you can also use `solr` functions, like `.boost('product(score_title, 3)')`
  .mm(2)
  .start(0)
  .rows(10);

const obj4 = await client.search(query4);
console.log(obj4);

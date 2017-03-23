/**
 * Query Builder example
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');
var QueryBuilder = require('./../lib/query-builder');


function search(opt) {
  var qb = new QueryBuilder();

  if (opt.city) qb.where('city').in(opt.city);
  if (opt.status) qb.where('status', opt.status);
  if (opt.age) qb.where('age').equals(opt.age);

  if (opt.startDate || opt.endDate) {
    qb.where('birthDate').between(opt.startDate, opt.endDate);
  }
  
  if (opt.offset_date && opt.offset_id) {
    qb.begin()
        .where('birthDate').lt(opt.offset_date)
        .or()
        .begin()
          .where('birthDate').equals(opt.offset_date)
          .where('_id').lt(opt.offset_id)
        .end()
      .end();
  }

  if (opt.name) {
    qb.any({ firstName: opt.name, middleName: opt.name, lastName: opt.name });
  }


  var client = solr.createClient();

  // DixMax query
  var query = client.createQuery()
              .q(qb.build())
              .dismax()
              .qf({title_t : 0.2 , description_t : 3.3})
              .mm(2)
              .start(0)
              .rows(10);

  client.search(query, function (err,obj) {
     if(err) {
      console.log(err);
     } else {
      console.log(obj);
     }
  });
}


exports.core = function(nock){

nock('http://127.0.0.1:8983')
  .post('/solr/update/json?commit=false&wt=json', "[{\"id\":1234567810,\"unknownfield1\":\"Test title\"}]")
  .reply(400, "<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\"/>\n<title>Error 400 ERROR: [doc=1234567810] unknown field 'unknownfield1'</title>\n</head>\n<body><h2>HTTP ERROR 400</h2>\n<p>Problem accessing /solr/update/json. Reason:\n<pre>    ERROR: [doc=1234567810] unknown field 'unknownfield1'</pre></p><hr /><i><small>Powered by Jetty://</small></i><br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n\n</body>\n</html>\n", { date: 'Sun, 06 May 2012 21:50:07 GMT',
  'content-type': 'text/html;charset=ISO-8859-1',
  'cache-control': 'must-revalidate,no-cache,no-store',
  'content-length': '1469',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "[{\"id\":1234567890,\"title_t\":\"Test title\",\"description_t\":\"Test Description\"}]")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":3}}", { date: 'Sun, 06 May 2012 21:50:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "[{\"id\":1234567895,\"title_t\":\"Test title 4\",\"description_t\":\"Test Description4\"}]")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":7}}", { date: 'Sun, 06 May 2012 21:50:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "[{\"id\":1234567891,\"title_t\":\"Test title 0\",\"description_t\":\"Test Description0\"},{\"id\":1234567892,\"title_t\":\"Test title 1\",\"description_t\":\"Test Description1\"},{\"id\":1234567893,\"title_t\":\"Test title 2\",\"description_t\":\"Test Description2\"},{\"id\":1234567894,\"title_t\":\"Test title 3\",\"description_t\":\"Test Description3\"}]")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":7}}", { date: 'Sun, 06 May 2012 21:50:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "[{\"id\":1,\"title_t\":\"Hello\"},{\"id\":3,\"title_t\":\"Hola\"},{\"id\":5,\"title_t\":\"Bonjour\"}]")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":20}}", { date: 'Sun, 06 May 2012 21:50:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"commit\":{}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":460}}", { date: 'Sun, 06 May 2012 21:50:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"delete\":{\"id\":\"1234567890\"}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":3}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"delete\":{\"query\":\"title_t:Test title\"}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":3}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"delete\":{\"query\":\"last_update:[2012-05-01T21:50:08.309Z TO 2012-05-02T21:50:08.310Z]\"}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":4}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"delete\":{\"query\":\"title_t:Test title\"}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":6}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"optimize\":{\"waitFlush\":true,\"waitSearcher\":true}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":446}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"rollback\":{}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":1}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"rollback\":{}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":0}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/admin/ping?wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":2,\"params\":{\"echoParams\":\"all\",\"rows\":\"10\",\"echoParams\":\"all\",\"q\":\"solrpingquery\",\"qt\":\"search\",\"wt\":\"json\"}},\"status\":\"OK\"}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=titl:laptop&start=0&rows=10&wt=json')
  .reply(400, "<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\"/>\n<title>Error 400 undefined field titl</title>\n</head>\n<body><h2>HTTP ERROR 400</h2>\n<p>Problem accessing /solr/select. Reason:\n<pre>    undefined field titl</pre></p><hr /><i><small>Powered by Jetty://</small></i><br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n\n</body>\n</html>\n", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  pragma: 'no-cache',
  etag: '"13724219194"',
  'content-type': 'text/html;charset=ISO-8859-1',
  'cache-control': 'must-revalidate,no-cache,no-store',
  'content-length': '1398',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^2%20description^3&start=0&rows=10&fq=(price:[10%20TO%20100]%20AND%20delievery_t:[10%20TO%20100])&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":5,\"params\":{\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^2 description^3\",\"wt\":\"json\",\"fq\":\"price:[10 TO 100] delievery_t:[10 TO 100]\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=title:laptop&start=0&rows=10&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":3,\"params\":{\"wt\":\"json\",\"start\":\"0\",\"q\":\"title:laptop\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^0.2%20description^3.3&mm=2&start=0&rows=10&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":11,\"params\":{\"mm\":\"2\",\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^0.2 description^3.3\",\"wt\":\"json\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=edismax&qf=title^0.2%20description^3.3&mm=2&start=0&rows=10&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":11,\"params\":{\"mm\":\"2\",\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^0.2 description^3.3\",\"wt\":\"json\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^2%20description^3&start=0&rows=10&timeAllowed=1000&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":0,\"params\":{\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^2 description^3\",\"timeAllowed\":\"1000\",\"wt\":\"json\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^2%20description^3&start=0&rows=10&fq=category:Electronics&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":1,\"params\":{\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^2 description^3\",\"wt\":\"json\",\"fq\":\"category:Electronics\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^2%20description^3&start=0&rows=10&fl=title,description&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":1,\"params\":{\"fl\":\"title,description\",\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^2 description^3\",\"wt\":\"json\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^2%20description^3&start=0&rows=10&sort=score%20desc,price%20asc&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":13,\"params\":{\"sort\":\"score desc,price asc\",\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^2 description^3\",\"wt\":\"json\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&fl=description,score&fq%3D%7B!q.op%3DOR%2520df%3Dmerchant_id_t%7D837338%25208373873%252038738&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":1,\"params\":{\"fl\":\"description,score\",\"wt\":\"json\",\"q\":\"laptop\",\"defType\":\"dismax\",\"fq={!q.op=OR%20df=merchant_id_t}837338%208373873%2038738\":\"\"}},\"response\":{\"numFound\":0,\"start\":0,\"maxScore\":0.0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=laptop&defType=dismax&qf=title^2%20description^3&start=0&rows=10&fq=(last_update:[2012-05-05T21%3A50%3A08.783Z%20TO%202012-05-06T21%3A50%3A08.783Z]%20AND%20price:[10%20TO%20100])&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":1,\"params\":{\"start\":\"0\",\"q\":\"laptop\",\"qf\":\"title^2 description^3\",\"wt\":\"json\",\"fq\":\"last_update:[2012-05-05T21:50:08.783Z TO 2012-05-06T21:50:08.783Z] price:[10 TO 100]\",\"defType\":\"dismax\",\"rows\":\"10\"}},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 06 May 2012 21:50:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=title:laptop&qt=custom&start=0&rows=10&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":7},\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]}}", { date: 'Sun, 08 Jul 2012 16:54:37 GMT',
  'content-type': 'application/json; charset=UTF-8',
  'transfer-encoding': 'chunked',
  server: 'Jetty(7.5.3.v20111011)' });

}

exports.deleteByRange = function(nock){

nock('http://127.0.0.1:8983')
  .post('/solr/update/json?commit=true&wt=json', "[{\"id\":0,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":1,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":2,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":3,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":4,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":5,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":6,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":7,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":8,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":9,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-07T21:50:08.309Z\"},{\"id\":10,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":11,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":12,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":13,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":14,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":15,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":16,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":17,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":18,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"},{\"id\":19,\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\"}]")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":516}}", { date: 'Sun, 06 May 2012 22:08:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"delete\":{\"query\":\"last_update_dt:[2012-05-06T21:50:08.309Z TO 2012-05-07T21:50:08.309Z]\"}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":3}}", { date: 'Sun, 06 May 2012 22:08:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .post('/solr/update/json?commit=false&wt=json', "{\"commit\":{}}")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":170}}", { date: 'Sun, 06 May 2012 22:08:07 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=title_t:test&start=0&rows=10&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":3,\"params\":{\"wt\":\"json\",\"start\":\"0\",\"q\":\"title_t:test\",\"rows\":\"10\"}},\"response\":{\"numFound\":10,\"start\":0,\"docs\":[{\"id\":\"10\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"11\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"12\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"13\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"14\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"15\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"16\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"17\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"18\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"},{\"id\":\"19\",\"title_t\":\"test\",\"last_update_dt\":\"2012-05-05T21:50:08.309Z\",\"last_update\":\"2012-05-06T22:08:07.408Z\"}]}}", { date: 'Sun, 06 May 2012 22:08:08 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })
}

exports.facet = function(nock){
	nock('http://127.0.0.1:8983')
	.get('/solr/select?q=*:*&rows=0&facet=true&facet.query=title%3AIpad&facet.field=title&facet.prefix=Ipa&facet.sort=count&facet.limit=20&facet.offset=0&facet.mincount=0&facet.missing=false&facet.method=fc&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":12,\"params\":{\"facet.missing\":\"false\",\"facet\":\"true\",\"facet.mincount\":\"0\",\"facet.offset\":\"0\",\"facet.limit\":\"20\",\"wt\":\"json\",\"facet.method\":\"fc\",\"rows\":\"0\",\"facet.sort\":\"count\",\"facet.query\":\"title:Ipad\",\"q\":\"*:*\",\"facet.prefix\":\"Ipa\",\"facet.field\":\"title\"}},\"response\":{\"numFound\":10,\"start\":0,\"docs\":[]},\"facet_counts\":{\"facet_queries\":{\"title:Ipad\":0},\"facet_fields\":{\"title\":[]},\"facet_dates\":{},\"facet_ranges\":{}}}", { date: 'Sun, 06 May 2012 22:11:56 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' });

}

exports.group = function(nock){
	nock('http://127.0.0.1:8983')
	.get('/solr/select?q=description:laptop&group=true&group.field=title&group.limit=20&group.offset=0&group.sort=score%20asc&group.format=grouped&group.main=false&group.ngroups=true&group.truncate=false&group.cache.percent=0&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":0,\"params\":{\"group.format\":\"grouped\",\"group.ngroups\":\"true\",\"group.limit\":\"20\",\"group.main\":\"false\",\"group.cache.percent\":\"0\",\"wt\":\"json\",\"q\":\"description:laptop\",\"group.truncate\":\"false\",\"group.field\":\"title\",\"group\":\"true\",\"group.sort\":\"score asc\",\"group.offset\":\"0\"}},\"grouped\":{\"title\":{\"matches\":0,\"ngroups\":0,\"groups\":[]}}}", { date: 'Sun, 06 May 2012 22:13:06 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' })

  .get('/solr/select?q=description:laptop&group=true&group.field=title&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":0,\"params\":{\"group.field\":\"title\",\"group\":\"true\",\"wt\":\"json\",\"q\":\"description:laptop\"}},\"grouped\":{\"title\":{\"matches\":0,\"groups\":[]}}}", { date: 'Sun, 06 May 2012 22:13:06 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' });

}

exports.mlt = function(nock){
	nock('http://127.0.0.1:8983')
	.get('/solr/select?q=laptop&mlt=true&mlt.fl=title_t%2Cdescription_t&mlt.count=10&mlt.mintf=1&mlt.mindf=1&mlt.minwl=3&mlt.maxwl=5&mlt.maxqt=8&mlt.maxntp=9&mlt.boost=true&mlt.qf=title_t^2%20description_t^3&fl=id,score&wt=json')
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":7,\"params\":{\"mlt.minwl\":\"3\",\"mlt.boost\":\"true\",\"mlt.fl\":\"title_t,description_t\",\"mlt.qf\":\"title_t^2 description_t^3\",\"mlt.mintf\":\"1\",\"mlt\":\"true\",\"mlt.maxntp\":\"9\",\"mlt.maxwl\":\"5\",\"mlt.maxqt\":\"8\",\"wt\":\"json\",\"mlt.mindf\":\"1\",\"fl\":\"id,score\",\"mlt.count\":\"10\",\"q\":\"laptop\"}},\"response\":{\"numFound\":0,\"start\":0,\"maxScore\":0.0,\"docs\":[]},\"moreLikeThis\":{}}", { date: 'Sun, 06 May 2012 22:15:05 GMT',
  'content-type': 'application/json; charset=UTF-8',
  connection: 'close',
  server: 'Jetty(7.5.3.v20111011)' });
}

exports.createAddStream = function(nock){
  nock('http://127.0.0.1:8983')
  .post('/solr/update/json?commit=true&wt=json', "[\n{\"id\":0,\"title_t\":\"title0\",\"test_b\":true}\n,\n{\"id\":1,\"title_t\":\"title1\",\"test_b\":true}\n,\n{\"id\":2,\"title_t\":\"title2\",\"test_b\":true}\n,\n{\"id\":3,\"title_t\":\"title3\",\"test_b\":true}\n,\n{\"id\":4,\"title_t\":\"title4\",\"test_b\":true}\n,\n{\"id\":5,\"title_t\":\"title5\",\"test_b\":true}\n,\n{\"id\":6,\"title_t\":\"title6\",\"test_b\":true}\n,\n{\"id\":7,\"title_t\":\"title7\",\"test_b\":true}\n,\n{\"id\":8,\"title_t\":\"title8\",\"test_b\":true}\n,\n{\"id\":9,\"title_t\":\"title9\",\"test_b\":true}\n,\n{\"id\":10,\"title_t\":\"title10\",\"test_b\":true}\n,\n{\"id\":11,\"title_t\":\"title11\",\"test_b\":true}\n,\n{\"id\":12,\"title_t\":\"title12\",\"test_b\":true}\n,\n{\"id\":13,\"title_t\":\"title13\",\"test_b\":true}\n,\n{\"id\":14,\"title_t\":\"title14\",\"test_b\":true}\n,\n{\"id\":15,\"title_t\":\"title15\",\"test_b\":true}\n,\n{\"id\":16,\"title_t\":\"title16\",\"test_b\":true}\n,\n{\"id\":17,\"title_t\":\"title17\",\"test_b\":true}\n,\n{\"id\":18,\"title_t\":\"title18\",\"test_b\":true}\n,\n{\"id\":19,\"title_t\":\"title19\",\"test_b\":true}\n,\n{\"id\":20,\"title_t\":\"title20\",\"test_b\":true}\n,\n{\"id\":21,\"title_t\":\"title21\",\"test_b\":true}\n,\n{\"id\":22,\"title_t\":\"title22\",\"test_b\":true}\n,\n{\"id\":23,\"title_t\":\"title23\",\"test_b\":true}\n,\n{\"id\":24,\"title_t\":\"title24\",\"test_b\":true}\n,\n{\"id\":25,\"title_t\":\"title25\",\"test_b\":true}\n,\n{\"id\":26,\"title_t\":\"title26\",\"test_b\":true}\n,\n{\"id\":27,\"title_t\":\"title27\",\"test_b\":true}\n,\n{\"id\":28,\"title_t\":\"title28\",\"test_b\":true}\n,\n{\"id\":29,\"title_t\":\"title29\",\"test_b\":true}\n,\n{\"id\":30,\"title_t\":\"title30\",\"test_b\":true}\n,\n{\"id\":31,\"title_t\":\"title31\",\"test_b\":true}\n,\n{\"id\":32,\"title_t\":\"title32\",\"test_b\":true}\n,\n{\"id\":33,\"title_t\":\"title33\",\"test_b\":true}\n,\n{\"id\":34,\"title_t\":\"title34\",\"test_b\":true}\n,\n{\"id\":35,\"title_t\":\"title35\",\"test_b\":true}\n,\n{\"id\":36,\"title_t\":\"title36\",\"test_b\":true}\n,\n{\"id\":37,\"title_t\":\"title37\",\"test_b\":true}\n,\n{\"id\":38,\"title_t\":\"title38\",\"test_b\":true}\n,\n{\"id\":39,\"title_t\":\"title39\",\"test_b\":true}\n,\n{\"id\":40,\"title_t\":\"title40\",\"test_b\":true}\n,\n{\"id\":41,\"title_t\":\"title41\",\"test_b\":true}\n,\n{\"id\":42,\"title_t\":\"title42\",\"test_b\":true}\n,\n{\"id\":43,\"title_t\":\"title43\",\"test_b\":true}\n,\n{\"id\":44,\"title_t\":\"title44\",\"test_b\":true}\n,\n{\"id\":45,\"title_t\":\"title45\",\"test_b\":true}\n,\n{\"id\":46,\"title_t\":\"title46\",\"test_b\":true}\n,\n{\"id\":47,\"title_t\":\"title47\",\"test_b\":true}\n,\n{\"id\":48,\"title_t\":\"title48\",\"test_b\":true}\n,\n{\"id\":49,\"title_t\":\"title49\",\"test_b\":true}\n]\n")
  .reply(200, "{\"responseHeader\":{\"status\":0,\"QTime\":739}}", { date: 'Sun, 02 Sep 2012 21:25:39 GMT',
  'content-type': 'application/json; charset=UTF-8',
  'transfer-encoding': 'chunked',
  server: 'Jetty(7.5.3.v20111011)' });
}
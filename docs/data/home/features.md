---
  title: Features
  weight: 1
  render-file: false
---

- Commands supported: search(select), add, delete, update, commit, rollback, optimize, ping, real-time get, prepare commit, soft commit, arbitrary search handler (i.e: mlt, luke ...)
- Lucene query / DisMax query
- Grouping / Field Collapsing. (Apache Solr version must be >= 3.3)
- Convenients methods for querying with Facet, MoreLikeThis
- HTTP Basic Access Authentication
- Over HTTPS as well
- Use json-bigint to handle correctly numbers too large for Javascript Number such as the values of the fields *_l and \_version\_. By default json-bigint library is not used because the performance difference compared to the native JSON library is too important with "large" chunk of JSON (https://github.com/lbdremy/solr-node-client/issues/114#issuecomment-54165595), but you want to enable it if you use the Optimistic Concurreny feature available in Solr 4.x, along with RealTime Get and Atomic Updates features because they use the \_version\_ field. In order to enable it do `var client = solr.createClient({ bigint : true})` or directly on the client instance `client.options.bigint = true`.


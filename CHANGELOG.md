# Changelog

## 0.9.0

- Add fq(), a wrapper function for matchFilter for passing in an object or multiple filters (@ni-do) (https://github.com/lbdremy/solr-node-client/pull/241)

## 0.8.0

- Update dependencies, resolving security vulnerabilities (@kibertoad) (https://github.com/lbdremy/solr-node-client/pull/239)
- Support for Result Grouping / Field Collapsing (@leejessy) (https://github.com/lbdremy/solr-node-client/pull/84)
- Ability to inject options to the request (@MennoTammens) (https://github.com/lbdremy/solr-node-client/pull/223)
- Port should be optional (@nbaosullivan) (https://github.com/lbdremy/solr-node-client/pull/227)
- Improve documentation structure (@kibertoad) (https://github.com/lbdremy/solr-node-client/pull/235)
- Test with multiple Solr versions (@kibertoad) (https://github.com/lbdremy/solr-node-client/pull/234)
- Docker-based tests run via GitHub Actions (@kibertoad) (https://github.com/lbdremy/solr-node-client/pull/233)
- Automatic formatting via prettier (@kibertoad) (https://github.com/lbdremy/solr-node-client/pull/237)
- Linting (@kibertoad) (https://github.com/lbdremy/solr-node-client/pull/238)

## 0.6.0

- Solr5 Query-Highlighting support through StandardHighlighter (@LukeTaverne) (https://github.com/lbdremy/solr-node-client/pull/144)
- Experimental support for SolrCloud collections administration (@LukeTaverne) (https://github.com/lbdremy/solr-node-client/issues/138)
- Support for large query through POST via configurable automatic switch (@kfitzgerald) (https://github.com/lbdremy/solr-node-client/pull/129)
- Set Default Field (query.df()) (@cbarrientos-ias) (https://github.com/lbdremy/solr-node-client/pull/137)
- Adds support for facet.pivot and facet.pivot.mincount (@nicolasembleton) (https://github.com/lbdremy/solr-node-client/issues/146)

Noticeable change: You can now pass a solrVersion to the Client initialization so it will activate features that  are only supported
by your version or higher. Be sure to check the documentation

## 0.5.0

- Commands supported: search(select), add, delete, update, commit, rollback, optimize, ping, real-time get, prepare commit, soft commit, arbitrary search handler (i.e: mlt, luke ...)
- Lucene query / DisMax query
- Grouping / Field Collapsing. (Apache Solr version must be >= 3.3)
- Convenients methods for querying with Facet, MoreLikeThis
- HTTP Basic Access Authentication
- Over HTTPS as well
- Use json-bigint to handle correctly numbers too large for Javascript Number such as the values of the fields *_l and \_version\_. By default json-bigint library is not used because the performance difference compared to the native JSON library is too important with "large" chunk of JSON (https://github.com/lbdremy/solr-node-client/issues/114#issuecomment-54165595), but you want to enable it if you use the Optimistic Concurreny feature available in Solr 4.x, along with RealTime Get and Atomic Updates features because they use the \_version\_ field. In order to enable it do `var client = solr.createClient({ bigint : true})` or directly on the client instance `client.options.bigint = true`.

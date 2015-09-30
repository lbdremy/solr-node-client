/**
 * The purpose of those helpers is to centralize and standardize the work on detecting current running Solr Version
 */

var Solr3_2 = 302;
var Solr4_0 = 400;
var Solr5_0 = 500;
var Solr5_1 = 501;

/**
 * Enum that lists supported versions of Solr. Pass one of the keys from this enum as a solrVersion property
 *
 * @type {{3.2: number, 4.0: number, 5.0: number, 5.1: number}}
 */
var versionsEnum = {
  '3.2': Solr3_2,
  '4.0': Solr4_0,
  '5.0': Solr5_0,
  '5.1': Solr5_1
};

exports.versionsEnum = versionsEnum;
exports.Solr3_2 = Solr3_2;
exports.Solr4_0 = Solr4_0;
exports.Solr5_0 = Solr5_0;
exports.Solr5_1 = Solr5_1;

/**
 * solrVersion must match one of enum keys
 * If a number is passed, it'll be assume a .0 release (3 -> 3.0)
 * If nothing matches, it will be assumed 3.2
 *
 * @param solrVersion
 */
exports.version = function(solrVersion) {
  return (typeof solrVersion === "number") ? (versionsEnum[''+solrVersion+'.0']) : (versionsEnum[solrVersion] ? versionsEnum[solrVersion] : versionsEnum['3.2']);
};

#! /usr/bin/env node
var request = require('superagent');
var repos = require('./repos');

var apiURL = 'https://api.github.com/repos/';
var promises = [];

if (!process.env.GHTOKEN) {
  console.log('environment variable GHTOKEN needed.');
  process.exit(1);
}

function makeRequest(repo) {
  var p = new Promise(function(resolve, reject) {
    request
      .get(apiURL + repo)
      .set('User-Agent', 'superagent')
      .set('Authorization', 'token ' + process.env.GHTOKEN)
      .end(function(err, res) {
        var body = res.body;
        resolve(body);
      });
  });

  return p;
}


for (var repo of repos) {
  p = makeRequest(repo);
  promises.push(p)
}

Promise.all(promises).then(function(results) {
  for (var key in results) {
    var r = results[key];
    console.log(r.full_name + ' : ' + r.stargazers_count);
  }
});


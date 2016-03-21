#! /usr/bin/env node
var request = require('superagent');
var repos = require('./repos');

var apiURL = 'https://api.github.com/repos/';
var promises = [];

for (var repo of repos) {
  var p = new Promise(function(resolve, reject) {
    request
      .get(apiURL + repo)
      .end(function(err, res) {
        var body = res.body;
        resolve(body);
      });
  });
  promises.push(p);
}

Promise.all(promises).then(function(results) {
  for (var r of results) {
    console.log(r.full_name + ' : ' + r.stargazers_count);
  }
});


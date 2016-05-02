var req = require('request');
var expect = require('chai').expect;

describe("parse bracks-style html document with semi-complex nested elements", function() {

  var url_html = 'http://localhost:3000/testhtml';
  var url_ejs = 'http://localhost:3000/testejs';

  it("should return 200 for html req", function(done) {
    req(url_html, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });  
  });

  it("res body should be equal to correct html document with semi-complex nested elements", function(done) {
    req(url_html, function(err, res, body) {
      expect(body.trim()).to.equal('<div id="divId" class="divclass"><ul style="list-style-type:disc"><li><a href="https://www.google.com"><span class="primary">link to google</span></a></li></ul></div>');
      done();
    });  
  });

  it("should return 200 for ejs req", function(done) {
    req(url_ejs, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });  
  });

  it("res body should be equal to correct ejs document with semi-complex nested elements", function(done) {
    req(url_ejs, function(err, res, body) {
      expect(body.trim()).to.equal('<% include template/header.ejs %> <div id="divId" class="<%= page %>"><ul style="list-style-type:disc"><li><a href="https://www.google.com"><span class="primary">link to google</span></a></li></ul></div> <%- include template/footer.ejs -%>');
      done();
    });  
  });

});


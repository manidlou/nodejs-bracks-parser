var fs = require('fs');
var path = require('path');
var bracks_parser_tester = require('./bracks-parser-tester.js');
var expect = require('chai').expect;

describe("parse bracks-style html with semi-complex nested elements", function() {
  var bracks_html;
  it("should be equal to correct html with semi-complex nested elements", function(done) {
    bracks_parser_tester(path.join(process.cwd(), 'test', 'bracks'), function(err, ok) {
      if (err !== null) {
        throw err;
      } else if (ok) {
        bracks_html = fs.readFileSync(path.join(process.cwd(), 'test', 'views', 'index-html.html'), 'utf8');
        expect(bracks_html.trim()).to.equal('<html><meta charset="utf-8"> <body> <div id="divId" class="divclass"><ul style="list-style-type:disc"><li><a href="https://www.google.com"><span class="primary">link to google</span></a></li></ul></div></body></html>');
        done();
      }
    });
  });
});

describe("parse bracks-style ejs with semi-complex nested elements", function() {
  var bracks_ejs;
  it("should be equal to correct ejs with semi-complex nested elements", function(done) {
    bracks_parser_tester(path.join(process.cwd(), 'test', 'bracks'), function(err, ok) {
      if (err !== null) {
        throw err;
      } else if (ok) {
        bracks_ejs = fs.readFileSync(path.join(process.cwd(), 'test', 'views', 'index-ejs.ejs'), 'utf8');
        expect(bracks_ejs.trim()).to.equal('<html> <meta charset="utf-8"><br> <body> <% include template/header.ejs %> <div id="divId" class="<%= page %>"><ul style="list-style-type:disc"><li><a href="https://www.google.com"><span class="primary">link to google</span></a></li></ul></div> <%- include template/footer.ejs -%> </body> </html>');
        done();
      }
    });
  });
});



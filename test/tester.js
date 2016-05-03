var fs = require('fs');
var path = require('path');
var bracks_parser_tester = require('./bracks-parser-tester.js');
var expect = require('chai').expect;

describe("parse bracks-style html with nested elements", function() {
  var result_html, correct_html;
  it("should be equal to correct regular html with nested elements", function(done) {
    bracks_parser_tester(path.join(process.cwd(), 'test', 'bracks'), function(err, ok) {
      if (err !== null) {
        throw err;
      } else if (ok === 0) {
        result_html = fs.readFileSync(path.join(process.cwd(), 'test', 'views', 'html-doc.html'), 'utf8');
        correct_html = fs.readFileSync(path.join(process.cwd(), 'test', 'preparsed', 'correct-html.html'), 'utf8');
        expect(result_html).to.equal(correct_html);
        done();
      }
    });
  });
});

describe("parse bracks-style ejs with nested elements", function() {
  var result_ejs, correct_ejs;
  it("should be equal to correct regular ejs with nested elements", function(done) {
    bracks_parser_tester(path.join(process.cwd(), 'test', 'bracks'), function(err, ok) {
      if (err !== null) {
        throw err;
      } else if (ok === 0) {
        result_ejs = fs.readFileSync(path.join(process.cwd(), 'test', 'views', 'ejs-doc.ejs'), 'utf8');
        correct_ejs = fs.readFileSync(path.join(process.cwd(), 'test', 'preparsed', 'correct-ejs.ejs'), 'utf8');
        expect(result_ejs).to.equal(correct_ejs);
        done();
      }
    });
  });
});


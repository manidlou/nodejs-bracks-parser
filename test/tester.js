var req = require('request');
var expect = require('chai').expect;

describe("parse bracks-style html document with semi-complex nested elements", function() {
	var bracks_html = fs.readFileSync('./bracks/index-html.html', 'utf8');
	var bracks_ejs = './bracks/index-ejs.ejs';
	
  it("should be equal to correct html document with semi-complex nested elements", function(done) {
    
    expect(bracks_html.trim()).to.equal('<div id="divId" class="divclass"><ul style="list-style-type:disc"><li><a href="https://www.google.com"><span class="primary">link to google</span></a></li></ul></div>');
      done();
  });

  it("should be equal to correct ejs document with semi-complex nested elements", function(done) {
    expect(bracks_ejs.trim()).to.equal('<% include template/header.ejs %> <div id="divId" class="<%= page %>"><ul style="list-style-type:disc"><li><a href="https://www.google.com"><span class="primary">link to google</span></a></li></ul></div> <%- include template/footer.ejs -%>');
    done();
  });

});


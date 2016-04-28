/*!
 * bracks-parser
 * Copyright(c) 2016 Mawni Maghsoudlou
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const path = require('path');
const Vfile = require('vinyl');
const vfs = require('vinyl-fs');
const thru = require('through2');

/**
 * end tags regular expressions object mapping
 * @private
 */

const END_TAGS = {
  '</a>': /(?:\]\ba\b)/g,
  '</abbr>': /(?:\]\babbr\b)/g,
  '</address>': /(?:\]\baddress\b)/g,
  '</article>': /(?:\]\barticle\b)/g,
  '</aside>': /(?:\]\baside\b)/g,
  '</audio>': /(?:\]\baudio\b)/g,
  '</b>': /(?:\]\bb\b)/g,
  '</bdi>': /(?:\]\bbdi\b)/g,
  '</bdo>': /(?:\]\bbdo\b)/g,
  '</blockquote>': /(?:\]\bblockquote\b)/g,
  '</body>': /(?:\]\bbody\b)/g,
  '</button>': /(?:\]\bbutton\b)/g,
  '</canvas>': /(?:\]\bcanvas\b)/g,
  '</caption>': /(?:\]\bcaption\b)/g,
  '</cite>': /(?:\]\bcite\b)/g,
  '</code>': /(?:\]\bcode\b)/g,
  '</colgroup>': /(?:\]\bcolgroup\b)/g,
  '</datalist>': /(?:\]\bdatalist\b)/g,
  '</dd>': /(?:\]\bdd\b)/g,
  '</del>': /(?:\]\bdel\b)/g,
  '</details>': /(?:\]\bdetails\b)/g,
  '</dfn>': /(?:\]\bdfn\b)/g,
  '</div>': /(?:\]\bdiv\b)/g,
  '</dl>': /(?:\]\bdl\b)/g,
  '</dt>': /(?:\]\bdt\b)/g,
  '</em>': /(?:\]\bem\b)/g,
  '</fieldset>': /(?:\]\bfieldset\b)/g,
  '</figcaption>': /(?:\]\bfigcaption\b)/g,
  '</figure>': /(?:\]\bfigure\b)/g,
  '</footer>': /(?:\]\bfooter\b)/g,
  '</form>': /(?:\]\bform\b)/g,
  '</h1>': /(?:\]\bh1\b)/g,
  '</h2>': /(?:\]\bh2\b)/g,
  '</h3>': /(?:\]\bh3\b)/g,
  '</h4>': /(?:\]\bh4\b)/g,
  '</h5>': /(?:\]\bh5\b)/g,
  '</h6>': /(?:\]\bh6\b)/g,
  '</head>': /(?:\]\bhead\b)/g,
  '</header>': /(?:\]\bheader\b)/g,
  '</hgroup>': /(?:\]\bhgroup\b)/g,
  '</html>': /(?:\]\bhtml\b)/g,
  '</i>': /(?:\]\bi\b)/g,
  '</iframe>': /(?:\]\biframe\b)/g,
  '</ins>': /(?:\]\bins\b)/g,
  '</kbd>': /(?:\]\bkbd\b)/g,
  '</label>': /(?:\]\blabel\b)/g,
  '</li>': /(?:\]\bli\b)/g,
  '</map>': /(?:\]\bmap\b)/g,
  '</mark>': /(?:\]\bmark\b)/g,
  '</menu>': /(?:\]\bmenu\b)/g,
  '</nav>': /(?:\]\bnav\b)/g,
  '</noscript>': /(?:\]\bnoscript\b)/g,
  '</object>': /(?:\]\bobject\b)/g,
  '</ol>': /(?:\]\bol\b)/g,
  '</optgroup>': /(?:\]\boptgroup\b)/g,
  '</option>': /(?:\]\boption\b)/g,
  '</output>': /(?:\]\boutput\b)/g,
  '</p>': /(?:\]\bp\b)/g,
  '</pre>': /(?:\]\bpre\b)/g,
  '</progress>': /(?:\]\bprogress\b)/g,
  '</q>': /(?:\]\bq\b)/g,
  '</rp>': /(?:\]\brp\b)/g,
  '</rt>': /(?:\]\brt\b)/g,
  '</ruby>': /(?:\]\bruby\b)/g,
  '</s>': /(?:\]\bs\b)/g,
  '</samp>': /(?:\]\bsamp\b)/g,
  '</script>': /(?:\]\bscript\b)/g,
  '</section>': /(?:\]\bsection\b)/g,
  '</select>': /(?:\]\bselect\b)/g,
  '</small>': /(?:\]\bsmall\b)/g,
  '</span>': /(?:\]\bspan\b)/g,
  '</strong>': /(?:\]\bstrong\b)/g,
  '</style>': /(?:\]\bstyle\b)/g,
  '</sub>': /(?:\]\bsub\b)/g,
  '</summary>': /(?:\]\bsummary\b)/g,
  '</sup>': /(?:\]\bsup\b)/g,
  '</table>': /(?:\]\btable\b)/g,
  '</tbody>': /(?:\]\btbody\b)/g,
  '</td>': /(?:\]\btd\b)/g,
  '</textarea>': /(?:\]\btextarea\b)/g,
  '</tfoot>': /(?:\]\btfoot\b)/g,
  '</th>': /(?:\]\bth\b)/g,
  '</thead>': /(?:\]\bthead\b)/g,
  '</time>': /(?:\]\btime\b)/g,
  '</title>': /(?:\]\btitle\b)/g,
  '</tr>': /(?:\]\btr\b)/g,
  '</u>': /(?:\]\bu\b)/g,
  '</ul>': /(?:\]\bul\b)/g,
  '</var>': /(?:\]\bvar\b)/g,
  '</video>': /(?:\]\bvideo\b)/g
};

/**
 * start tags without attributes regular expressions object mapping
 * @private
 */

const START_TAGS_WITHOUT_ATTR = {
  '<a>': /(?:\ba\b\[)/g,
  '<abbr>': /(?:\babbr\b\[)/g,
  '<address>': /(?:\baddress\b\[)/g,
  '<article>': /(?:\barticle\b\[)/g,
  '<aside>': /(?:\baside\b\[)/g,
  '<audio>': /(?:\baudio\b\[)/g,
  '<b>': /(?:\bb\b\[)/g,
  '<bdi>': /(?:\bbdi\b\[)/g,
  '<bdo>': /(?:\bbdo\b\[)/g,
  '<blockquote>': /(?:\bblockquote\b\[)/g,
  '<body>': /(?:\bbody\b\[)/g,
  '<button>': /(?:\bbutton\b\[)/g,
  '<canvas>': /(?:\bcanvas\b\[)/g,
  '<caption>': /(?:\bcaption\b\[)/g,
  '<cite>': /(?:\bcite\b\[)/g,
  '<code>': /(?:\bcode\b\[)/g,
  '<colgroup>': /(?:\bcolgroup\b\[)/g,
  '<command>': /(?:\bcommand\b\[)/g,
  '<datalist>': /(?:\bdatalist\b\[)/g,
  '<dd>': /(?:\bdd\b\[)/g,
  '<del>': /(?:\bdel\b\[)/g,
  '<details>': /(?:\bdetails\b\[)/g,
  '<dfn>': /(?:\bdfn\b\[)/g,
  '<div>': /(?:\bdiv\b\[)/g,
  '<dl>': /(?:\bdl\b\[)/g,
  '<dt>': /(?:\bdt\b\[)/g,
  '<em>': /(?:\bem\b\[)/g,
  '<fieldset>': /(?:\bfieldset\b\[)/g,
  '<figcaption>': /(?:\bfigcaption\b\[)/g,
  '<figure>': /(?:\bfigure\b\[)/g,
  '<footer>': /(?:\bfooter\b\[)/g,
  '<form>': /(?:\bform\b\[)/g,
  '<h1>': /(?:\bh1\b\[)/g,
  '<h2>': /(?:\bh2\b\[)/g,
  '<h3>': /(?:\bh3\b\[)/g,
  '<h4>': /(?:\bh4\b\[)/g,
  '<h5>': /(?:\bh5\b\[)/g,
  '<h6>': /(?:\bh6\b\[)/g,
  '<head>': /(?:\bhead\b\[)/g,
  '<header>': /(?:\bheader\b\[)/g,
  '<hgroup>': /(?:\bhgroup\b\[)/g,
  '<html>': /(?:\bhtml\b\[)/g,
  '<i>': /(?:\bi\b\[)/g,
  '<iframe>': /(?:\biframe\b\[)/g,
  '<ins>': /(?:\bins\b\[)/g,
  '<kbd>': /(?:\bkbd\b\[)/g,
  '<label>': /(?:\blabel\b\[)/g,
  '<legend>': /(?:\blegend\b\[)/g,
  '<li>': /(?:\bli\b\[)/g,
  '<map>': /(?:\bmap\b\[)/g,
  '<mark>': /(?:\bmark\b\[)/g,
  '<menu>': /(?:\bmenu\b\[)/g,
  '<nav>': /(?:\bnav\b\[)/g,
  '<noscript>': /(?:\bnoscript\b\[)/g,
  '<object>': /(?:\bobject\b\[)/g,
  '<ol>': /(?:\bol\b\[)/g,
  '<optgroup>': /(?:\boptgroup\b\[)/g,
  '<option>': /(?:\boption\b\[)/g,
  '<output>': /(?:\boutput\b\[)/g,
  '<p>': /(?:\bp\b\[)/g,
  '<pre>': /(?:\bpre\b\[)/g,
  '<progress>': /(?:\bprogress\b\[)/g,
  '<q>': /(?:\bq\b\[)/g,
  '<rp>': /(?:\brp\b\[)/g,
  '<rt>': /(?:\brt\b\[)/g,
  '<ruby>': /(?:\bruby\b\[)/g,
  '<s>': /(?:\bs\b\[)/g,
  '<samp>': /(?:\bsamp\b\[)/g,
  '<script>': /(?:\bscript\b\[)/g,
  '<section>': /(?:\bsection\b\[)/g,
  '<select>': /(?:\bselect\b\[)/g,
  '<small>': /(?:\bsmall\b\[)/g,
  '<span>': /(?:\bspan\b\[)/g,
  '<strong>': /(?:\bstrong\b\[)/g,
  '<style>': /(?:\bstyle\b\[)/g,
  '<sub>': /(?:\bsub\b\[)/g,
  '<summary>': /(?:\bsummary\b\[)/g,
  '<sup>': /(?:\bsup\b\[)/g,
  '<table>': /(?:\btable\b\[)/g,
  '<tbody>': /(?:\btbody\b\[)/g,
  '<td>': /(?:\btd\b\[)/g,
  '<textarea>': /(?:\btextarea\b\[)/g,
  '<tfoot>': /(?:\btfoot\b\[)/g,
  '<th>': /(?:\bth\b\[)/g,
  '<thead>': /(?:\bthead\b\[)/g,
  '<time>': /(?:\btime\b\[)/g,
  '<title>': /(?:\btitle\b\[)/g,
  '<tr>': /(?:\btr\b\[)/g,
  '<u>': /(?:\bu\b\[)/g,
  '<ul>': /(?:\bul\b\[)/g,
  '<var>': /(?:\bvar\b\[)/g,
  '<video>': /(?:\bvideo\b\[)/g
};

/**
 * void tags without attributes regular expressions object mapping
 * @private
 */

const VOID_TAGS_WITHOUT_ATTR = {
  '<area>': /(?:\[\barea\b\])/g,
  '<base>': /(?:\[\bbase\b\])/g,
  '<br>': /(?:\[\bbr\b\])/g,
  '<col>': /(?:\[\bcol\b\])/g,
  '<embed>': /(?:\[\bembed\b\])/g,
  '<hr>': /(?:\[\bhr\b\])/g,
  '<img>': /(?:\[\bimg\b\])/g,
  '<input>': /(?:\[\binput\b\])/g,
  '<keygen>': /(?:\[\bkeygen\b\])/g,
  '<link>': /(?:\[\blink\b\])/g,
  '<meta>': /(?:\[\bmeta\b\])/g,
  '<param>': /(?:\[\bparam\b\])/g,
  '<source>': /(?:\[\bsource\b\])/g,
  '<track>': /(?:\[\btrack\b\])/g,
  '<wbr>': /(?:\[\bwbr\b\])/g
};

/**
 * start and void tags with attributes regular expressions object mapping
 * @private
 */

const START_VOID_TAGS_WITH_ATTR = {
  '<a ': /(?:\ba\b\()/g,
  '<abbr ': /(?:\babbr\b\()/g,
  '<address ': /(?:\baddress\b\()/g,
  '<area ': /(?:\barea\b\()/g,
  '<article ': /(?:\barticle\b\()/g,
  '<aside ': /(?:\baside\b\()/g,
  '<audio ': /(?:\baudio\b\()/g,
  '<b ': /(?:\bb\b\()/g,
  '<base ': /(?:\bbase\b\()/g,
  '<bdi ': /(?:\bbdi\b\()/g,
  '<bdo ': /(?:\bbdo\b\()/g,
  '<blockquote ': /(?:\bblockquote\b\()/g,
  '<body ': /(?:\bbody\b\()/g,
  '<br ': /(?:\bbr\b\()/g,
  '<button ': /(?:\bbutton\b\()/g,
  '<canvas ': /(?:\bcanvas\b\()/g,
  '<caption ': /(?:\bcaption\b\()/g,
  '<cite ': /(?:\bcite\b\()/g,
  '<code ': /(?:\bcode\b\()/g,
  '<col ': /(?:\bcol\b\()/g,
  '<colgroup ': /(?:\bcolgroup\b\()/g,
  '<command ': /(?:\bcommand\b\()/g,
  '<datalist ': /(?:\bdatalist\b\()/g,
  '<dd ': /(?:\bdd\b\()/g,
  '<del ': /(?:\bdel\b\()/g,
  '<details ': /(?:\bdetails\b\()/g,
  '<dfn ': /(?:\bdfn\b\()/g,
  '<div ': /(?:\bdiv\b\()/g,
  '<dl ': /(?:\bdl\b\()/g,
  '<dt ': /(?:\bdt\b\()/g,
  '<em ': /(?:\bem\b\()/g,
  '<embed ': /(?:\bembed\b\()/g,
  '<fieldset ': /(?:\bfieldset\b\()/g,
  '<figcaption ': /(?:\bfigcaption\b\()/g,
  '<figure ': /(?:\bfigure\b\()/g,
  '<footer ': /(?:\bfooter\b\()/g,
  '<form ': /(?:\bform\b\()/g,
  '<h1 ': /(?:\bh1\b\()/g,
  '<h2 ': /(?:\bh2\b\()/g,
  '<h3 ': /(?:\bh3\b\()/g,
  '<h4 ': /(?:\bh4\b\()/g,
  '<h5 ': /(?:\bh5\b\()/g,
  '<h6 ': /(?:\bh6\b\()/g,
  '<head ': /(?:\bhead\b\()/g,
  '<header ': /(?:\bheader\b\()/g,
  '<hgroup ': /(?:\bhgroup\b\()/g,
  '<hr ': /(?:\bhr\b\()/g,
  '<html ': /(?:\bhtml\b\()/g,
  '<i ': /(?:\bi\b\()/g,
  '<iframe ': /(?:\biframe\b\()/g,
  '<img ': /(?:\bimg\b\()/g,
  '<input ': /(?:\binput\b\()/g,
  '<ins ': /(?:\bins\b\()/g,
  '<kbd ': /(?:\bkbd\b\()/g,
  '<keygen ': /(?:\bkeygen\b\()/g,
  '<label ': /(?:\blabel\b\()/g,
  '<legend ': /(?:\blegend\b\()/g,
  '<li ': /(?:\bli\b\()/g,
  '<link ': /(?:\blink\b\()/g,
  '<map ': /(?:\bmap\b\()/g,
  '<mark ': /(?:\bmark\b\()/g,
  '<menu ': /(?:\bmenu\b\()/g,
  '<meta ': /(?:\bmeta\b\()/g,
  '<nav ': /(?:\bnav\b\()/g,
  '<noscript ': /(?:\bnoscript\b\()/g,
  '<object ': /(?:\bobject\b\()/g,
  '<ol ': /(?:\bol\b\()/g,
  '<optgroup ': /(?:\boptgroup\b\()/g,
  '<option ': /(?:\boption\b\()/g,
  '<ouput ': /(?:\boutput\b\()/g,
  '<p ': /(?:\bp\b\()/g,
  '<param ': /(?:\bparam\b\()/g,
  '<pre ': /(?:\bpre\b\()/g,
  '<progress ': /(?:\bprogress\b\()/g,
  '<q ': /(?:\bq\b\()/g,
  '<rp ': /(?:\brp\b\()/g,
  '<rt ': /(?:\brt\b\()/g,
  '<ruby ': /(?:\bruby\b\()/g,
  '<s ': /(?:\bs\b\()/g,
  '<samp ': /(?:\bsamp\b\()/g,
  '<script ': /(?:\bscript\b\()/g,
  '<section ': /(?:\bsection\b\()/g,
  '<select ': /(?:\bselect\b\()/g,
  '<small ': /(?:\bsmall\b\()/g,
  '<source ': /(?:\bsource\b\()/g,
  '<span ': /(?:\bspan\b\()/g,
  '<strong ': /(?:\bstrong\b\()/g,
  '<style ': /(?:\bstyle\b\()/g,
  '<sub ': /(?:\bsub\b\()/g,
  '<summary ': /(?:\bsummary\b\()/g,
  '<sup ': /(?:\bsup\b\()/g,
  '<table ': /(?:\btable\b\()/g,
  '<tbody ': /(?:\btbody\b\()/g,
  '<td ': /(?:\btd\b\()/g,
  '<textarea ': /(?:\btextarea\b\()/g,
  '<tfoot ': /(?:\btfoot\b\()/g,
  '<th ': /(?:\bth\b\()/g,
  '<thead ': /(?:\bthead\b\()/g,
  '<time ': /(?:\btime\b\()/g,
  '<title ': /(?:\btitle\b\()/g,
  '<tr ': /(?:\btr\b\()/g,
  '<track ': /(?:\btrack\b\()/g,
  '<u ': /(?:\bu\b\()/g,
  '<ul ': /(?:\bul\b\()/g,
  '<var ': /(?:\bvar\b\()/g,
  '<video ': /(?:\bvideo\b\()/g,
  '<wbr ': /(?:\bwbr\b\()/g
};

/**
 * ejs specific tags regular expressions object mapping
 * @private
 */

const EJS_TAGS = {
  '<%': /(?:\[%)/g,
  '<%=': /(?:%=)/g,
  '<%-': /(?:%\-)/g,
  '<%#': /(?:%#)/g,
  '<%%': /(?:%%)/g,
  '%>': /(?:%\])/g,
  '-%>': /(?:\-%)/g,
  '<%_': /(?:%_)/g,
  '_%>': /(?:_%)/g
};

/**
 * resolve parsed file path
 *
 * @param {Object} [file] a vinyl file object
 * @param {Function} [callback] a callback function
 * @return {Function} callback function containing either an error or the resolved file path
 * @private
 */

function resolve_file_path(file, callback) {
  var resolved_file_path = '';
  var split_path = (file.path).split('/');
  var i;
  if (split_path.indexOf('bracks') === -1) {
    return callback('bracks-parser error -> path to \'bracks\' directory cannot be null.', file);
  } else {
    split_path.splice(split_path.indexOf('bracks'), 1);
    for (i = 0; i < split_path.length; i += 1) {
      resolved_file_path += split_path[i] + '/';
    }
    resolved_file_path = resolved_file_path.slice(0, resolved_file_path.length - 1);
    return callback(null, resolved_file_path);
  }
}

/**
 * parse 'bracks' style html document. return the parsed regular html document.
 *
 * @param {Object} [file] a vinyl file object
 * @param {Function} [callback] a callback function
 * @return {Function} callback function containing the parsed regular html
 * @private
 */

function parse_html(file, callback) {
  var src = file.contents.toString();
  src = src.replace(/(?:\]\/\bc\b)/g, '-->');
  src = src.replace(/(?:\bc\b\/\[)/g, '<!--');
  Object.keys(VOID_TAGS_WITHOUT_ATTR).forEach(function(key) {
    src = src.replace(VOID_TAGS_WITHOUT_ATTR[key], key);
  });
  Object.keys(END_TAGS).forEach(function(key) {
    src = src.replace(END_TAGS[key], key);
  });
  Object.keys(START_TAGS_WITHOUT_ATTR).forEach(function(key) {
    src = src.replace(START_TAGS_WITHOUT_ATTR[key], key);
  });
  Object.keys(START_VOID_TAGS_WITH_ATTR).forEach(function(key) {
    src = src.replace(START_VOID_TAGS_WITH_ATTR[key], key);
  });
  src = src.replace(/(?:\)\[)|(?:\)\])/g, '>');
  src = src.replace(/(?:\\)/g, '');
  src = src.replace(/(?:> <)/g, '><');
  return callback(src);
}

/**
 * bracks-parser express middleware main function
 *
 * get source files (html or ejs) as vinyl file objects under 'bracks' directory. 
 * Pipe them through2 stream transform function, parse them all, pipe 
 * the result documents to the project root directory, and call 
 * the next middleware. If find any errors, call the next middleware 
 * and pass the error as the argument.
 *
 * @param {String} [bracks_src_path] absolute path to `bracks` directory
 * @return {Function}
 * @public
 */

function bracks_parser(bracks_src_path) {
  return function bracks_parser(req, res, next) {
    var transformed_ejs_src, transformed_file;
    var error = {};
    vfs.src(path.join(bracks_src_path, '/**/*.+(html|ejs)'))
      .pipe(thru.obj(function(file, enc, callback) {
        if (file.isNull()) {
          error.status = 404;
          next(error);
          callback(new Error('bracks-parser error -> input file is null'), file);
        }
        if (file.extname === '.html') {
          resolve_file_path(file, function(err, resolved_file_path) {
            if (err !== null) {
              error.status = 404;
              next(error);
              return callback(new Error(err), file);
            } else {
              parse_html(file, function(transformed_html_src) {
                transformed_file = new Vfile({
                  cwd: "",
                  base: "",
                  path: resolved_file_path,
                  contents: new Buffer(transformed_html_src)
                });
                return callback(null, transformed_file);
              });
            }
          });
        } else if (file.extname === '.ejs') {
          resolve_file_path(file, function(err, resolved_file_path) {
            if (err !== null) {
              error.status = 404;
              next(error);
              return callback(new Error(err), file);
            } else {
              parse_html(file, function(transformed_html_src) {
                transformed_ejs_src = transformed_html_src;
                Object.keys(EJS_TAGS).forEach(function(key) {
                  transformed_ejs_src = transformed_ejs_src.replace(EJS_TAGS[key], key);
                });
                transformed_file = new Vfile({
                  cwd: "",
                  base: "",
                  path: resolved_file_path,
                  contents: new Buffer(transformed_ejs_src)
                });
                return callback(null, transformed_file);
              });
            }
          });
        }
      })).pipe(vfs.dest('./'))
    .on('end', function() {
      next();
    });
  };
}

module.exports = bracks_parser;

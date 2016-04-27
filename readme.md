#bracks-parser

#####Introduction
`bracks` (short for brackets) is a simpler and relatively faster way of writing [html](https://www.w3.org/TR/html5) and [ejs](https://github.com/mde/ejs) without any need to use `<`, `>` for identifying elements.

#####Install `bracks-parser` for use as an express middleware
Please use `npm install bracks-parser`, or `npm install bracks-parser --save-dev` if you want to install it as a development dependency.
#####Use as a gulp plugin
`bracks-parser` can be used as a [gulp](https://github.com/gulpjs/gulp) plugin as well. If you are interested about that, please read [gulp-bracks](https://www.npmjs.com/package/gulp-bracks).
#####Performance
Here is what happens under the hood:

The parser gets all source files under given `bracks` directory as a stream of [vinyl](https://github.com/gulpjs/vinyl) file objects and pipes them [through2](https://github.com/rvagg/through2) transform function, parses them all, pipes the result documents to their destination under project root directory. In case of [express](http://expressjs.com) application, it calls the `next` middleware on `end` event.
#####Rationale
I've always found `<` and `>` so annoying and tedious in writing [html](https://www.w3.org/TR/html5). For one complete element we have to insert four of `<`, `>`. The argument is that inserting `<` and `>` decreases the speed and distrupts the flow of writing html code. Primarily, in a usual case inserting `<` and `>` requires a second key, usually the shift-key or another key, to be triggered. Honestly, how many times you meant to type `<` but the output was `,`! It happened to me a lot. Furthermore, cleaner code, it means the code that is easier for eyes to track and distinguish various characters without falling into momentary confusion, leads to the code that is easier to read and also is less-error-prone. `bracks` gives us the ability to write our html with less tediousness because we no longer need to insert `<` and `>` each time for each tag name. As long as we follow a few simple agreements, we write html without any angle brackets because `bracks-parser` will add them for us.

I understand, at first, it looks weird and so unfamiliar especially for a long-time html writer. That's absolutely true and fair. However, it shouldn't take more than a few days (for some even a few hours probably) to adapt to this simple syntax because it is actually very simple. Eventually, you will realize that you develop your code faster with less tediousness. For example in `bracks` syntax start tags are in the form of `tagname[`. End tags are in the form of `]tagname`. Notice the simple pattern here, `tagname[` `]tagname`. So basically, you can think of all the contents of an element wrapped in `[]`. Since html elements enclose their contents, using `[]` helps us read and interpret html document easier and faster because `[]` symbols intuitively bring the idea of containing something. In my humble opinion, the speed and efficiency of the flow of writing code is not necessarily related to the number of characters that we insert. It is more related to **how** each character is being inserted. I've personally found typing `tagname[` easier and faster than `<tagname>`. If you are interested to know more about this simple syntax, please read the following.

Of course, any help, idea, criticism would be all absolutely appreciated.

#####`bracks` simple syntax
Since html document structure relies on start and end tags, we still need an identifier to distinguish them from the rest of the text. `bracks` uses `[]` and `()` as the main identifiers. Simply for a normal element, all attributes and their values are placed in `()`, and all the contents of the element are placed in `[]`. Here is how we can use `bracks`:

######Important Notice: `bracks` is `not` a whitespace sensitive syntax. Also, `bracks-parser` doesn't care about whitespace before the first character of each line. In other words, it doesn't touch the indentation of the source file. The indentation of the final result is going to be the same as the source file. If the following simple agreements are maintained throughtout the entire code, you are going to receive your code in a clean and correct format.

*In the following description, one single space is denoted by [SPACE]*

**1. comments**

bracks comment: `c[your helpful comment]c`
  
html comment: `<!--your helpful comment-->`

**2. start tag without attributes**

bracks: `tagname[` 
    
bracks-example: `div[`
    
html: `<tagname>`
    
html-example: `<div>`

**3. start tag with attributes**
   
bracks: `tagname(list of all attributes and their values)[`
    
bracks-example: `div(id="yourDivId" class="yourdivclass")[`
    
html: `<tagname list of all attributes and their values>`
    
html-example: `<div id="yourDivId" class="yourdivclass">`

**4.void tag without attributes**

bracks: `[tagname]`
    
bracks-example: `[br]`

html: `<tagname>`
    
html-example: `<br>`

**4.void tag with attributes**

bracks: `tagname(list of all attributes and their values)]`
    
bracks-example: `meta(charset="UTF-8")]`

html: `<tagname list of all attributes and their values>`
    
html-example: `<meta charset="UTF-8">`

**5. end tag**
  
bracks: `]tagname`
    
bracks-example: `]div`

html: `</tagname>`
    
html-example: `</div>`

**6. escape character**

In order to escape a character or a word, just put `\` before or after the character or the word that is supposed to be escaped. It means, first insert it before the character. If it didn't work, insert it after the character.

####`ejs` and `bracks` hand in hand
If you want to use `bracks` syntax in your [ejs](https://github.com/mde/ejs) document, please use the following agreements (I call them agreements since I personally don't like rules as I am a fan of freedom!):

**1.Scriptlet tag**

*ejs | bracks-style ejs equivalent*

`<%` | `[%`

**2.Plain ending tag**

*ejs | bracks-style ejs equivalent*

`%>` | `%]` 

For the rest of the tags, you just simply don't need to type `<` or `>` anymore (the parser will add them for you). For instance, instead of typing `<%= page %>`, you type `%= page %]`. So,

*ejs | bracks-style ejs equivalent*

`<%=` | `%=`

`<%-` | `%-`

`<%#` | `%#`

`<%%` | `%%`

`<%_` | `%_`

`-%>` | `-%`

`_%>` | `_%`


That's it. As long as you follow these simple and relatively intuitive agreements, you will no longer need to insert any `<` and `>` for html or ejs elements. Just write it `bracks` style, pass your source code to `bracks-parser` and then receive your clean and complete html or ejs document that is ready to use for any purposes.

#####Example of a `bracks` style html document
*index.html*:
```
<!DOCTYPE html>
html[
  c[your comment]c
  head[title[your page title]title]head
  body[
    h1[explore your mind]h1
    b[your bold text]b
    div(id="yourdiv" class="yourdivclass")[
      a(href="https://www.google.com")[link to google]a
      ul(style="list-style-type:disc")[
        li[item1]li
        li[item2]li
      ]ul
    ]div
    div[
      p[it is a samp s script footer paragraph tester]p
    ]div
  ]body
]html
```
#####Example of a `bracks` style ejs document
*index.ejs*:
```
<!DOCTYPE html>
html[
  head[
    title[your page title]title
    link(rel="stylesheet" href="/stylesheets/style.css")]
    meta(charset="utf-8")]
  ]head
  body(class="%= page %]")[
    [% include partials/template/header.ejs %]
      section(class="layout")[
        div(class="primary")[
          %- include partials/content/home-page.ejs -%
        ]div
        p[explore your mind]p
        aside(class="secondary")[
          %- include partials/content/proj-page.ejs %]
        ]aside
      ]section
    [% include partials/template/footer.ejs %]
  ]body
]html
```
#####How to use with express
If you want to write your `html` or `ejs` files in a `bracks` style, just create a directory under your project root directory and name it `bracks`. Keep all the `html` or `ejs` files that you want to write in a `bracks` syntax in this `bracks` direcory. Files can be located inside sub-direcories. It doesn't matter. The `bracks-parser` will find them and pipes them to their destinations under project root directory, after parses them all to html or ejs. In fact, the file extension doesn't matter for the parser. Either `.html` or `.ejs`, it parses the files under `bracks` directory based on the `bracks` syntax and pipes the result files with their own extensions to their destinations.

So, something like the following will do the job for you.

```javascript
var express = require('express');
var bracks_parser = require('bracks-parser');

var path_to_bracks_directory = '/absolute/path/to/bracks/directory';

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bracks_parser(path_to_bracks_directory));
```
normally it is a good idea to put `bracks-parser` early on top of stack of middlewares since express renders html or ejs not the `bracks` one.

#####Example of `views` directory with sub-directories

Suppose our express application has the following structure in `views` directory.

```
views
  |__partials
  |     |__content
  |     |   |__home-page.ejs
  |     |   |__proj-page.ejs
  |     | 
  |     |__template
  |         |__header.ejs
  |         |__footer.ejs
  |
  |__index.ejs
  |__error.ejs

```
As long as we want to write our view files in a `bracks` syntax, we use the `bracks-parser` as a middleware and keep the same file structure as `views` directory in `bracks` directory. As a result, we have something like the following,

```
bracks
  |__views
       |__partials
       |      |__content
       |      |   |__home-page.ejs
       |      |   |__proj-page.ejs
       |      |
       |      |__template
       |          |__header.ejs
       |          |__footer.ejs
       |
       |__index.ejs
       |__error.ejs
```

As we run our app, `bracks-parser` reads all the files under `bracks` directory. If it finds any errors, it passes the control to the next middleware by passing that error as an argument. If it doesn't find any errors, it parses all the files and pipes them all with clean and complete html or ejs format to the project root directory. In other words, it parses them all and makes them ready for express to render them. So it means as we write our application and progress, our updated (correct html or ejs formatted) files are dynamically being overwritten whenever we change `bracks` files.

Just as a reminder, since `bracks-parser` is basically a development tool, when you are done writing in a `bracks` style and you don't need it anymore, you can just simply delete the `bracks` directory and remove the parser from the stack of middlewares in your application.

So, it is nothing crazy about this. Everything is as usual. We just write our view files `bracks` style, which hopefully gives us the ability to write html and/or ejs simpler, faster with less tediousness.


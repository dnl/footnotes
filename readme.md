Footnotes
=========

This is a little super-rough command-line tool for rendering markdown into html, with footnotes, table of contents, and cover page, and bibliography on its own page.

It uses CSS regions which are presently only available to safari (I investigated wkhtmltopdf, it doesn't have css regions either).

It uses a yml preamble. (other keys are in `essay.rb`)

``` markdown
title: Awesome title
author: Dana Sherson
---

## Introduction

Lorem Ipsum...

## Bibliography

- bibliography item
- ...

```

Use:

``` sh
./essay.rb [sourcefile.markdown]
```

writes html file next to the markdown file as `[sourcefile.markdown].html`

Get a PDF by printing to PDF from safari.

It lacks specs or a proper gemfile or gemspec or etc. Use at your own risk.

License: unlicense

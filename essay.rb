#!/usr/bin/env ruby

require 'redcarpet'
require 'yaml'
require 'erb'
require 'ostruct'
require 'shellwords'

class HTMLWithPants < Redcarpet::Render::HTML
  include Redcarpet::Render::SmartyPants
  def footnotes(content)
    %Q(<ol class="footnotes">#{content}</ol>)
  end
end

class Article < OpenStruct
  def to_html
    ERB.new(template).result(binding)
  end

  def toc_html
    toc_renderer = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC.new(nesting_level: 2))
    toc_renderer.render content
  end
  def content_html
    renderer = Redcarpet::Markdown.new(HTMLWithPants.new(with_toc_data: true), hard_wrap: true, footnotes: true)
    renderer.render content
  end

  def css
    read_template 'template.css'
  end
  def js
    read_template 'template.js'
  end
  def template
    read_template 'template.html.erb'
  end
  def read_template(filename)
    path = File.symlink?($0) ? File.readlink($0) : $0
    File.read(File.join(File.dirname(path), filename))
  end
end

outputPath = File.join File.dirname(ARGF.path), "#{File.basename(ARGF.path, File.extname(ARGF.path))}.html"

source = ARGF.read
data, content = source.split(/\n-{3,}\n/, 2)

raise 'No data block (place before --- above the essay)' if data.nil? || content.nil?

defaults = {
  title: '[[ TITLE ]]',
  author: '[[ AUTHOR ]]',
  lecturer: '[[ LECTURER ]]',
  course: '[[ COURSE ]]',
  year: '[[ YEAR ]]',
  date: Date.today.strftime('%-d %B %Y'),
  content: content,
  question: ''
}

options = YAML.load(data)
options = defaults.merge options
article = Article.new(options)

File.write(outputPath, article.to_html)

`open #{outputPath.shellescape}`
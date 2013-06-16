$(function () {
  var nodes = []
    , codes = []

  $('p > code').each(function (i, el) {
    var element = $(el)
      , code = element.text()
      , lang = code.split("\n")[0]

    if (code.split("\n").length <= 1
     || $(el).text() != $(el).parent().text()) {
      return
    }

    if ("\n" === code.slice(-1)) {
      code = code.slice(0, -1)
    }

    if (lang.match(/^([a-z]+)$/)) {
      code = code.slice(lang.length + 1)
      element.text(code)

      nodes.push(element)
      codes.push("```" + lang + "\n" + code + "\n```")
    } else if (!lang) {
      code = code.slice(lang.length + 1)
      element.parent().replaceWith($('<pre><code>' + code + '</code></pre>'))
    }
  })

  if (!codes.length) {
    return
  }

  $.ajax('https://api.github.com/markdown/raw', {
    contentType: 'text/plain'
  , data: codes.join("\n----------\n")
  , type: 'POST'
  }).done(function (rendered) {
    console.log(rendered)
    $(rendered).find('pre').addClass('highlight').each(function (i, el) {
      nodes[i].parent().replaceWith(el)
    })
  })
})

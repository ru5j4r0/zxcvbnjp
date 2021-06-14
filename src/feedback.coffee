scoring = require('./scoring')

feedback =
  default_feedback:
    warning: ''
    suggestions: [
      '一般的な単語や句を避け、いくつかの単語を使うことをおすすめします' # "Use a few words, avoid common phrases"
      '必ずしも記号、数字、大文字を使う必要はありません' # "No need for symbols, digits, or uppercase letters"
    ]

  get_feedback: (score, sequence) ->
    # starting feedback
    return @default_feedback if sequence.length == 0

    # no feedback if score is good or great.
    return if score > 2
      warning: ''
      suggestions: []

    # tie feedback to the longest match for longer sequences
    longest_match = sequence[0]
    for match in sequence[1..]
      longest_match = match if match.token.length > longest_match.token.length
    feedback = @get_match_feedback(longest_match, sequence.length == 1)
    extra_feedback = '一般的でないいくつかの単語を加えることをおすすめします。' # 'Add another word or two. Uncommon words are better.'
    if feedback?
      feedback.suggestions.unshift extra_feedback
      feedback.warning = '' unless feedback.warning?
    else
      feedback =
        warning: ''
        suggestions: [extra_feedback]
    feedback

  get_match_feedback: (match, is_sole_match) ->
    switch match.pattern
      when 'dictionary'
        @get_dictionary_match_feedback match, is_sole_match

      when 'spatial'
        layout = match.graph.toUpperCase()
        warning = if match.turns == 1
          'キーボードを直線になぞったものは推測されやすいです' # 'Straight rows of keys are easy to guess'
        else
          '短いキーボードのパターンは推測されやすいです' # 'Short keyboard patterns are easy to guess'
        warning: warning
        suggestions: [
          'キーボードのパターンを長くするか、方向転換の回数を増やしましょう' # 'Use a longer keyboard pattern with more turns'
        ]

      when 'repeat'
        warning = if match.base_token.length == 1
          'aaaといった繰り返しは推測されやすいです' # 'Repeats like "aaa" are easy to guess'
        else
          '"abcabcabc"といった繰り返しは、"abc"と比べてそれほど強度が向上しません' # 'Repeats like "abcabcabc" are only slightly harder to guess than "abc"'
        warning: warning
        suggestions: [
          '文字や単語の繰り返しを避けましょう' # 'Avoid repeated words and characters'
        ]

      when 'sequence'
        warning: '"abc"や"6543"のような連続は推測されやすいです' # "Sequences like abc or 6543 are easy to guess"
        suggestions: [
          '連続を避けましょう' # 'Avoid sequences'
        ]

      when 'regex'
        if match.regex_name == 'recent_year'
          warning: '最近の年は推測されやすいです' # "Recent years are easy to guess"
          suggestions: [
            '最近の年を避けましょう' # 'Avoid recent years'
            'あなたに関連した年を避けましょう' # 'Avoid years that are associated with you'
          ]

      when 'date'
        warning: '日付は多くの場合に推測されやすいです' # "Dates are often easy to guess"
        suggestions: [
          'あなたに関連した日付や年を避けましょう' # 'Avoid dates and years that are associated with you'
        ]

  get_dictionary_match_feedback: (match, is_sole_match) ->
    warning = if match.dictionary_name == 'passwords'
      if is_sole_match and not match.l33t and not match.reversed
        if match.rank <= 10
          'これはよく使われるパスワード上位10位です' # 'This is a top-10 common password'
        else if match.rank <= 100
          'これはよく使われるパスワード上位100位です' # 'This is a top-100 common password'
        else
          'これはよく使われるパスワードです' # 'This is a very common password'
      else if match.guesses_log10 <= 4
        'これはよく使われるパスワードに類似しています' # 'This is similar to a commonly used password'
    else if match.dictionary_name == 'english_wikipedia'
      if is_sole_match
        '単語単体は推測されやすいです' # 'A word by itself is easy to guess'
    else if match.dictionary_name in ['surnames', 'male_names', 'female_names']
      if is_sole_match
        '氏名単体は推測されやすいです' # 'Names and surnames by themselves are easy to guess'
      else
        '一般的な氏名は推測されやすいです' # 'Common names and surnames are easy to guess'
    else
      ''

    suggestions = []
    word = match.token
    if word.match(scoring.START_UPPER)
      suggestions.push '先頭だけを大文字にしても強度はそれほど向上しません' # "Capitalization doesn't help very much"
    else if word.match(scoring.ALL_UPPER) and word.toLowerCase() != word
      suggestions.push '全て大文字は全て小文字と同じくらい推測されやすいです' # "All-uppercase is almost as easy to guess as all-lowercase"

    if match.reversed and match.token.length >= 4
      suggestions.push '単語を逆さにしても強度はそれほど向上しません' # "Reversed words aren't much harder to guess"
    if match.l33t
      suggestions.push "'a'を'@'に換えるといった予測可能な置換をしても、強度はそれほど向上しません" # "Predictable substitutions like '@' instead of 'a' don't help very much"

    result =
      warning: warning
      suggestions: suggestions
    result

module.exports = feedback

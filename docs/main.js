function makeFbStr(fb){
  var fb_str = '';

  const warn = fb.warning;
  if(warn) fb_str += '・' + warn + '\n';

  const sug = fb.suggestions;
  if(sug.length > 0) fb_str += '・' + sug.join('\n・');

  return fb_str;
}

const selected_class = 'selected';
const hide_class = 'hide';

function show(element){
  element.classList.remove(hide_class);
}

function hide(element){
  element.classList.add(hide_class);
}

function select(element){
  element.classList.add(selected_class);
}

function unselect(element){
  element.classList.remove(selected_class);
}

const score_display_list = ['未入力', '危険', 'とても弱い', '弱い', '強い', 'とても強い'];

window.onload = function(){
  const password_input      = document.getElementById('password_input');
  const feedback            = document.getElementById('feedback');
  const score_meter         = document.getElementById('score_meter');
  const score_display       = document.getElementById('score_display');

  const impl_html = document.getElementById('impl_html');
  impl_html.textContent = `<label for="password_input">パスワード</label>
<div class="flex-wrap">
  <input id="password_input" type="text">
  <span id="feedback" data-balloon-pos="right" data-balloon-length="xlarge" data-balloon-visible data-balloon-break></span>
</div>
<div>
  <meter id="score_meter" form="password_input" min="0" low="3" high="3" optimum="4" max="5"></meter>
  <span id="score_display"></span>
</div>
<div>
  <input type="checkbox" id="password_visibility" checked>
  <label for="password_visibility">パスワードを表示する</label>
</div>`;

  const impl_css = document.getElementById('impl_css');
  impl_css.textContent = `.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

#score_meter:-moz-meter-sub-sub-optimum~#score_display {
  color: red;
}

#score_meter:-moz-meter-sub-optimum~#score_display {
  color: orange;
}

#score_meter:-moz-meter-optimum~#score_display {
  color: mediumseagreen;
}`;
  hide(impl_css);

  const impl_js = document.getElementById('impl_js');
  impl_js.textContent = `function makeFbStr(fb){
  var fb_str = '';

  const warn = fb.warning;
  if(warn) fb_str += '・' + warn + '\\n';

  const sug = fb.suggestions;
  if(sug.length > 0) fb_str += '・' + sug.join('\\n・');

  return fb_str;
}

const score_display_list = ['未入力', '危険', 'とても弱い', '弱い', '強い', 'とても強い'];

window.onload = function(){
  const password_input      = document.getElementById('password_input');
  const feedback            = document.getElementById('feedback');
  const score_meter         = document.getElementById('score_meter');
  const score_display       = document.getElementById('score_display');

  document.getElementById('password_visibility').oninput = function(element){
    if(element.target.checked) password_input.setAttribute('type', 'text');
    else password_input.setAttribute('type', 'password');
  };

  const update = function(element){
    const password = element.value;
    const res = zxcvbn(password);

    const fb_str = makeFbStr(res.feedback);
    if(fb_str) feedback.setAttribute('aria-label', fb_str);
    else feedback.removeAttribute('aria-label');

    const score = res.score;
    if(password.length == 0){
      score_meter.value = 0;
      score_display.textContent = score_display_list[0];
    } else {
      const i = score + 1
      score_meter.value = i;
      score_display.textContent = score_display_list[i];
    }
  };

  update(password_input);

  password_input.oninput = function(event){
    update(event.target);
  };
};`;
  hide(impl_js);

  const show_html = document.getElementById('show_html');
  select(show_html);
  const show_css = document.getElementById('show_css');
  const show_js = document.getElementById('show_js');

  var showed_element = impl_html;
  var selected_element = show_html;

  document.getElementById('show_html').onclick = function(){
    if(showed_element != impl_html){
      unselect(selected_element);
      select(show_html);
      selected_element = show_html;

      hide(showed_element);
      show(impl_html);
      showed_element = impl_html;
    }
  };

  document.getElementById('show_css').onclick = function(){
    if(showed_element != impl_css){
      unselect(selected_element);
      select(show_css);
      selected_element = show_css;

      hide(showed_element);
      show(impl_css);
      showed_element = impl_css;
    }
  };

  document.getElementById('show_js').onclick = function(){
    if(showed_element != impl_js){
      unselect(selected_element);
      select(show_js);
      selected_element = show_js;

      hide(showed_element);
      show(impl_js);
      showed_element = impl_js;
    }
  };

  const arg_password = document.getElementById('arg_password');
  const res_calc_time = document.getElementById('res_calc_time');

  const disp_offline_fast_hashing = document.getElementById('disp_offline_fast_hashing');
  const disp_offline_slow_hashing = document.getElementById('disp_offline_slow_hashing');
  const disp_online_no_throttling = document.getElementById('disp_online_no_throttling');
  const disp_online_throttling = document.getElementById('disp_online_throttling');

  const sec_offline_fast_hashing = document.getElementById('sec_offline_fast_hashing');
  const sec_offline_slow_hashing = document.getElementById('sec_offline_slow_hashing');
  const sec_online_no_throttling = document.getElementById('sec_online_no_throttling');
  const sec_online_throttling = document.getElementById('sec_online_throttling');

  const fb_suggestions = document.getElementById('fb_suggestions');
  const fb_warning = document.getElementById('fb_warning');

  const res_guesses = document.getElementById('res_guesses');
  const res_guesses_log10 = document.getElementById('res_guesses_log10');
  const res_password = document.getElementById('res_password');
  const res_score = document.getElementById('res_score');

  document.getElementById('password_visibility').oninput = function(element){
    if(element.target.checked) password_input.setAttribute('type', 'text');
    else password_input.setAttribute('type', 'password');
  };

  const update = function(element){
    const password = element.value;
    const res = zxcvbn(password);

    const fb = res.feedback;
    const fb_str = makeFbStr(fb);
    if(fb_str) feedback.setAttribute('aria-label', fb_str);
    else feedback.removeAttribute('aria-label');

    const score = res.score;
    if(password.length == 0){
      score_meter.value = 0;
      score_display.textContent = score_display_list[0];
    } else {
      const i = score + 1
      score_meter.value = i;
      score_display.textContent = score_display_list[i];
    }

    arg_password.textContent = password;
    res_calc_time.textContent = res.calc_time;

    const disp = res.crack_times_display;
    disp_offline_fast_hashing.textContent = disp.offline_fast_hashing_1e10_per_second;
    disp_offline_slow_hashing.textContent = disp.offline_slow_hashing_1e4_per_second;
    disp_online_no_throttling.textContent = disp.online_no_throttling_10_per_second;
    disp_online_throttling.textContent = disp.online_throttling_100_per_hour;

    const sec = res.crack_times_seconds;
    sec_offline_fast_hashing.textContent = sec.offline_fast_hashing_1e10_per_second;
    sec_offline_slow_hashing.textContent = sec.offline_slow_hashing_1e4_per_second;
    sec_online_no_throttling.textContent = sec.online_no_throttling_10_per_second;
    sec_online_throttling.textContent = sec.online_throttling_100_per_hour;

    fb_suggestions.textContent = fb.suggestions.join('\n');
    fb_warning.textContent = fb.warning;

    res_guesses.textContent = res.guesses;
    res_guesses_log10.textContent = res.guesses_log10;
    res_password.textContent = res.password;
    res_score.textContent = score;
  };

  update(password_input);

  password_input.oninput = function(event){
    update(event.target);
  };
};

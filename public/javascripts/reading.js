// home.js

let PAGE_REFRESH = 1

function WY_hasClass (ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function WY_addClass (ele, cls) {
  if (!WY_hasClass(ele,cls)) ele.className += " "+cls;
}

function WY_removeClass (ele, cls) {
  if (WY_hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}


/**
 * Up / Down
 */
function up_down_article (updown, aid, table_row) {
  const token = document.querySelector('.token').innerText
  if (token.length < 20) {
    return false
  }

  axios.post('https://businessonwechat.com/gzh/api_up_down', { updown, token, aid })
    .then(res => {
      if (res.data.message === 'ok') {
        const el_num_up   = table_row.querySelector('.up-wrap .num-wrap')
        //const el_num_down = table_row.querySelector('.down-wrap .num-wrap')
        const el_up   = table_row.querySelector('.up-wrap img')
        if (updown === 'up') {
          if (res.data.result == 1) {
            el_up.src = '/images/up.png'
          }
          if (res.data.result == 2) {
            el_up.src = '/images/like.png'
          }
            el_num_up.innerHTML = res.data.num_up
            //el_num_down.innerHTML = res.data.num_down
        }
        else if (updown === 'bukan') {
          WY_addClass(table_row, 'have-read')
        }
      }
      else if (res.data.message === 'bukan') {
        table_row.style.display = 'none'
      }
    })
    .catch(err99 => {
      //alert('通信失败 3 ！请联系管理员。' + err99)
    })
}

/**
 * 点击阅读链接
 */
function onclick_reading_article (ev) {
  const tar = ev.target
  let tr, rate, aid, token

  if (tar.tagName === 'a' || tar.tagName === 'A') {

    /*
    const role = document.querySelector('.user-role').innerText
    if (role != '4') {
      const more_readings = document.getElementById('error_more_readings')
      if (typeof(more_readings) != 'undefined' && more_readings != null) {
        return
      }
    }
    */

    tr = tar.closest('li')

    if (tr) {
      aid = tr.dataset.aid
      const url = tar.dataset.url

      if (aid) { // 点击阅读文章。

        token = document.querySelector('.token').innerText

        /*
        if (token.length < 20) {
          return
        }
        */

        WY_addClass(tr, 'have-read')
        setTimeout(() => {
          window.location.href = url
        }, 300)

        axios.get(`https://businessonwechat.com/gzh/api_click_reading?isfrom=gzhzj&token=${token}&actid=0&aid=${aid}`)
      }
    }
  }
  else if (WY_hasClass(tar, 'pencil-icon')) {
    tr = tar.closest('li')
    if (tr) {
      aid = tr.dataset.aid
      document.querySelector('.modal-article-id').value = aid

      rate = parseInt(tr.dataset.rate)
      document.querySelector('.modal-rate').value = rate

      // 分类
      var categories = tr.dataset.categories

      var cateArray
      try {
        cateArray = JSON.parse(categories)
      } catch (err) {
        cateArray = []
      }

      var categoryCheckboxes = document.querySelectorAll('.category-input')
      let cateVal = 0
      let cateIndex
      for (let i=0; i < categoryCheckboxes.length; ++i) {
        cateVal = parseInt(categoryCheckboxes[i].value)
        cateIndex = cateArray.indexOf(cateVal)
        if (cateIndex > -1) {
          categoryCheckboxes[i].checked = true
        }
        else {
          categoryCheckboxes[i].checked = false
        }
      }
      // end of 分类

      var box1 = document.querySelector('.mask-box')
      var box2 = document.querySelector('.pop-delete')
      if (box1 && box2 && aid) {
        WY_addClass(box1, 'shown')
        WY_addClass(box2, 'shown')
      }
    }
  }
  else if (WY_hasClass(tar, 'bukan')) {
    tr = tar.closest('li')
    if (tr) {
      aid = tr.dataset.aid
      up_down_article('bukan', aid, tr)
    }
  }
  else if (WY_hasClass(tar, 'doup')) {
    tr = tar.closest('.table-row')
    if (tr) {
      aid = tr.dataset.aid
      up_down_article('up', aid, tr)
    }
  }
}


const roleval = document.querySelector('.user-role').innerText
if (roleval == '4') {
  const warninginfo = document.getElementById('error_more_readings')
  if (warninginfo) {
    warninginfo.style.display = 'none'
  }
}


/**
 * Selete a category.
function filter_category () {

  const el = document.getElementById('filter_category')
  const val = el.options[el.selectedIndex].value

  const trs = document.querySelectorAll('#table_guanzhu tbody tr')

  if (val == 'all') {
    for (let ix=0; ix<trs.length; ++ix) {
      trs[ix].style.display = 'table-row'
    }
  }
  else {
    for (let ix=0; ix<trs.length; ++ix) {
      if (trs[ix].dataset.categoryid == val) {
        trs[ix].style.display = 'table-row'
      }
      else {
        trs[ix].style.display = 'none'
      }
    }
  }
}
 */


/**
 * 微信登录
 */
function weixin_userinfo () {

  location.href = '/login?ty=userinfo&dest=reading'
}


/**
 * 关闭modal
 */
function closeModalWindow() {
  var box1 = document.querySelector('.mask-box')
  var box2 = document.querySelector('.pop-delete')
  if (box1 && box2) {
    WY_removeClass(box1, 'shown')
    WY_removeClass(box2, 'shown')
  }
}
      

/*
 * 确定修改
 */
function yesModalWindow() {

  const token = document.querySelector('.token').innerText
  const aid = document.querySelector('.modal-article-id').value
  const rate = document.querySelector('.modal-rate').value

  const categ = document.querySelectorAll('.category-input:checked')
  let category_ids = []
  categ.forEach(function(categoryItem) {
    category_ids.push(categoryItem.value)
  })

    axios.post('https://businessonwechat.com/gzh/api_editor_article', { token, aid, category_ids, rate })
      .then(function(res) {
        if (res.data.msg === 'ok') {
          closeModalWindow()
        }
        else {
          alert('错误 3077')
        }
      })
      .catch(function(err) {
        alert('错误 3078')
      })
}

const click_title = document.getElementById('reading_tasks_table')
if (click_title) {
  click_title.addEventListener('click', onclick_reading_article)
}

const closeIcon = document.querySelector('.pop-close')
if (closeIcon) {
  closeIcon.addEventListener('click', closeModalWindow)
}

const yesMo = document.querySelector('.btn-pop-ok')
if (yesMo) {
  yesMo.addEventListener('click', yesModalWindow)
}

const closeMo = document.querySelector('.btn-pop-no')
if (closeMo) {
  closeMo.addEventListener('click', closeModalWindow)
}

const weixindenglu = document.querySelector('.weixin-userinfo')
if (weixindenglu) {
  weixindenglu.addEventListener('click', weixin_userinfo)
}




// 底部固定菜单
function footer_nav_main(evt) {

  const span = evt.target
  const huyue = document.querySelector('.footer-nav .huyue')

        const token = document.querySelector('.token').innerText

        if (token.length < 20) {
          return
        }

  if (WY_hasClass(span, 'wode')) {
    WY_removeClass(huyue, 'active')
    WY_addClass(span, 'active')
    location.href = '/?token=' + token
  }

  if (WY_hasClass(span, 'huguan')) {
    WY_removeClass(huyue, 'active')
    WY_addClass(span, 'active')
    location.href = '/community'
  }
}



let navMainMenu = document.querySelector('nav .nav-main-menu')
if (navMainMenu) {
  navMainMenu.addEventListener('click', footer_nav_main)
}


/**
 * 返回页面
 * https://stackoverflow.com/a/43043658/3054511
 */
window.addEventListener('pageshow', function (ev) {

  let historyTraversal = ev.persisted ||
                        (typeof window.performance != "undefined" &&
                          window.performance.navigation.type === 2);

  if(historyTraversal) {
    const token = document.querySelector('.token').innerText

    if (token.length < 20) {
      return
    }

    axios.get(`https://businessonwechat.com/gzh/api_handle_last_reading?isfrom=gzhzj&token=${token}`)
      .then(function(res) {
        //alert('res::: ' + (res.data.msg))
        var pop = document.querySelector('#reading_result_window')
        if (pop) {
          WY_removeClass(pop, 'hidden')
          WY_addClass(pop, 'fade-out')
          setTimeout(function () {
            WY_addClass(pop, 'hidden')
            WY_removeClass(pop, 'fade-out')
          }, 4000)
        }
      })
      .catch(function(err) {
        //alert(err)
      })
  }
})


/*
 * 文章分页
 */

var categories = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let current_category = 10

let json_my_categories = []
let json_articles = []
let json_articles_all

try {
  const my_categories = document.querySelector('.my-categories').innerText
  const json_str = document.querySelector('.json-articles').innerText

  json_my_categories = JSON.parse(my_categories)
  json_articles_all = JSON.parse(json_str)

  json_articles = json_articles_all.filter(el => {
    if (el.has_read) {
      return false
    }
    return true

    /*
    for (let i=0; i < el.categories.length; ++i) {
      if (json_my_categories.includes(el.categories[i])) {
        return true
      }
    }
    return false
    */


    //return !el.has_read && el.category == current_category
  })
} catch(err) {
  console.log('Get all articles error', err)
}

const is_editor = document.querySelector('.is-editor').innerText
const role = document.querySelector('.user-role').innerText
let pointer = 0

function show_more_articles () {

  //alert('num:: ' + json_articles.length)
  if (pointer < json_articles.length) {
    let count = 0
    let el
    let div
    let has_read
    let icon_up
    //let fivestars
    let pencil
    //let shownid
    const wrap = document.querySelector('.articles-outside ul')
    for (; pointer < json_articles.length && count < 20; ++count) {
      has_read = json_articles[pointer].has_read ? 'have-read' : ''
      icon_up = json_articles[pointer].is_up ? '/images/up.png' : '/images/like.png'
      shownid = role == '4' ? '<span>(' + json_articles[pointer].aid + ')</span>' : ''
      pencil = (is_editor === '1' && !json_articles[pointer].edited) ? '<img src="/images/pencil.png" class="pencil-icon">' : ''

      // Show five stars
      /*
      fivestars = ''
      for (var ixx=1; ixx < 6; ++ixx) {
        if (ixx <= json_articles[pointer].rate) {
          fivestars += '<img src="/images/star1.png">'
        }
        else {
          fivestars += '<img src="/images/star0.png">'
        }
      }
      */

      el = `
          <li class="col bgc-white rounded-10 mt-30 lis-li ${has_read}" data-aid="${json_articles[pointer].aid}" data-categories="${json_articles[pointer].jsoncategories}" data-rate="${json_articles[pointer].rate}">
            <div class="div-box">
              <div class="head-photo">
                <span class="fivestars-wrap">
                  <strong class="c-green">
                    ${json_articles[pointer].points}
                  </strong>
                </span>
                <span class="haozhu-wrap">
                  <img src="/dls/avatar/${json_articles[pointer].uid}.jpeg" class="float-r pic-img rounded-c">
                  <span class="float-r s-span pl-15 pr-15 c-grey  c-blue-h">
                    ${json_articles[pointer].nickname}
                  </span>
                </span>
              </div>
              <h3 class="pt-30 pb-30 article-title-area" data-url="${json_articles[pointer].url}">
                <img src="${json_articles[pointer].headimgsmall}" class="article-cover">
                <div class="main-info-wrap">
                  <a href="javascript:void(0)" class="c-black text-bold-4 c-blue-h article-title" data-url="${json_articles[pointer].url}">
                    ${json_articles[pointer].title} ${shownid}
                  </a>
                  <div class="sub-info-date c-grey">
                    <span class="info-date">
                      ${json_articles[pointer].created_at}
                    </span>
                  </div>
                  <div class="sub-info-date c-grey">
                    <span class="c-grey c-blue-h gzh-name">
                      ${json_articles[pointer].account_name}
                    </span>
                  </div>
                  <div class="sub-info-wrap c-grey">
                    <span class="sub-info-radings">
                      <i class="iconfont icon-font bukan"> &#xe78d; </i>
                    </span>
                    <span class="sub-info-readings">
                      <img class="eye-icon" src="/images/eye.png" alt="">
                      <span class="s-spa sub-info-num">
                        ${json_articles[pointer].readings}
                      </span>
                    </span>
                    <span class="sub-info-thumbup">
                      <i class="iconfont icon-font"> &#xe63b; </i>
                      <span class="s-spa sub-info-num">
                        ${json_articles[pointer].num_up}
                      </span>
                    </span>
                  </div>
                </div>
              </h3>
              <div class="c-box border-b-grey pt-25 pb-25 func-buttons hidden">
                <button class="w-25 c-grey c-blue-h pos-r btn-read-total">
                  <i class="iconfont icon-font"> &#xe69a; </i>
                  <span class="s-spa">
                    ${json_articles[pointer].readings}
                  </span>
                </button>
                <button class="w-25 c-grey c-green-h pos-r btn-like">
                  <i class="iconfont icon-font"> &#xe63b; </i>
                  <span class="s-spa">
                    ${json_articles[pointer].num_up}
                  </span>
                </button>
                <button class="w-25 c-grey c-red-h pos-r btn-delete">
                  <i class="iconfont icon-font"> &#xe78d; </i>
                  <span class="s-spa"> 删除 </span>
                </button>
                <button class="w-25 c-grey c-red-h pos-r btn-report">
                  <i class="iconfont icon-font"> &#xe620; </i>
                  <span class="s-spa"> 举报 </span>
                </button>
              </div>
            </div>
          </li>
        `

      /*
                */

      /*
              <div class="gzh-wrap pb-20 hidden">
                <h4 class="">
                  <div href="javascript:void(0)" class="float-l c-grey c-blue-h">
                    ${json_articles[pointer].account_name}
                  </div>
                </h4>
                <div class="gzh-last-item">
                  ${pencil}
                </div>
              </div>
              */
      div = document.createElement('div')
      div.innerHTML = el
      wrap.appendChild(div)
      pointer++
    }

    const moreWrap = document.querySelector('.more-button-wrap')
    if (pointer >= json_articles.length) {
      WY_addClass(moreWrap, 'hidden')
    }
    else {
      WY_removeClass(moreWrap, 'hidden')
    }
  }
}

show_more_articles()

const moreButton = document.querySelector('.more-button-wrap button')
if (moreButton) {
  moreButton.addEventListener('click', show_more_articles)
}


/**
 * 隐藏已读 / 显示已读
 */
function switch_has_read () {

  const readSwitch = document.querySelector('.read-switch')
  if (WY_hasClass(readSwitch, 'show-read')) {
    WY_removeClass(readSwitch, 'show-read')
    //readSwitch.innerText = '显示已读'
    json_articles = json_articles_all
  }
  else {
    WY_addClass(readSwitch, 'show-read')
    //readSwitch.innerText = '隐藏已读'
    json_articles = json_articles_all.filter(el => {
      return !el.has_read
    })
  }

  const wrap = document.querySelector('.articles-outside ul')
  wrap.innerHTML = ''
  pointer = 0
  show_more_articles()
}


function gotoMy() {
  const token = document.querySelector('.token').innerText
  if (token.length < 20) {
    return false
  }

  location.href = 'https://businessonwechat.com/gzh?token=' + token
}

const myButton = document.querySelector('footer .btn-wrap .btn-my')
if (myButton) {
  myButton.addEventListener('click', gotoMy)
}


function gotoCommunity() {
  location.href = 'https://businessonwechat.com/gzh/community'
}

const communityButton = document.querySelector('footer .btn-wrap .btn-community')
if (communityButton) {
  communityButton.addEventListener('click', gotoCommunity)
}

function gotoGzhs() {
  location.href = 'https://businessonwechat.com/gzh/gzh'
}


function down_arrow() {
  const downArrow = document.querySelector('.down-arrow-wrap')
  const cates = document.querySelector('.section-1 .button-wrap')
  if (!WY_hasClass(downArrow, 'hidden')) {
    WY_removeClass(cates, 'limit-height')
    WY_addClass(downArrow, 'hidden')
  }
}


function switch_tag(evt) {

  var btn = evt.target
  if (!WY_hasClass(btn, 'cate-button')) {
    return
  }

  var cid = btn.dataset.cid
  if (!cid) {
    return
  }

  var cidnum = parseInt(cid)

  var token = document.querySelector('.token').innerText

  // axios,总是无法获得返回结果！暂时不处理了
  axios.get(`https://businessonwechat.com/gmserver/api_click_tag?isfrom=kkk&token=${token}&cid=${cid}`, {timeout: 3000})
  //axios.get('https://gongzhonghaozhijia.com/api_test', {timeout: 3000})
    .then(function(res) {
      //var cid3 = JSON.stringify([23,45])
      //var cid3 = 'cid3'
      //alert(res.data)
      //axios.get(`https://businessonwechat.com/gmserver/api_click_tag?isfrom=kkk&token=${token}&cid=${cid3}`)
    })
    .catch(function(err) {
      //alert(err)
      //var cid4 = 'ERR::' + JSON.stringify(err)
      //axios.get(`https://businessonwechat.com/gmserver/api_click_tag?isfrom=kkk&token=${token}&cid=${cid4}`)
    })


  //var all = json_my_categories

  // 1. 确定分类
  let vv
  if (WY_hasClass(btn, 'active')) {
    vv = 'has'
    WY_removeClass(btn, 'active')
    var pos = json_my_categories.indexOf(cidnum)
    if (pos > -1) {
      json_my_categories.splice(pos, 1)
    }
  }
  else {
    vv = 'no'
    WY_addClass(btn, 'active')
    var pos = json_my_categories.indexOf(cidnum)
    if (pos === -1) {
      json_my_categories.push(cidnum)
    }
  }

  // 2. 确定文章
  var readSwitch = document.querySelector('.read-switch')
  if (WY_hasClass(readSwitch, 'show-read')) {
    json_articles = json_articles_all.filter(el => {
      if (el.has_read) {
        return false
      } else {
        return true
      }

      /*
      for (var i=0; i < el.categories.length; ++i) {
        if (json_my_categories.includes(el.categories[i])) {
          return true
        }
      }
      return false
      */
    })
  } else {
    return true
  }

  // 3. 显示文章
  const wrap = document.querySelector('.articles-outside ul')
  wrap.innerHTML = ''
  pointer = 0
  show_more_articles()
}


const gzhsButton = document.querySelector('footer .btn-wrap .btn-gzhs')
if (gzhsButton) {
  gzhsButton.addEventListener('click', gotoGzhs)
}



const readSwitchButton = document.querySelector('.read-switch')
if (readSwitchButton) {
  readSwitchButton.addEventListener('click', switch_has_read)
}


const tagButton = document.querySelector('.section-1 .button-wrap')
if (tagButton) {
  tagButton.addEventListener('click', switch_tag)
}


const downArrow = document.querySelector('.down-arrow-wrap img')
if (downArrow) {
  downArrow.addEventListener('click', down_arrow)
}

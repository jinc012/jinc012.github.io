(function () {
  "use strict";
  var root = document.documentElement;
  var store = {
    get: function (k) {
      try {
        return JSON.parse(localStorage.getItem(k));
      } catch (e) {
        return null;
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    }
  };

  /* ---------- 動畫開關 ---------- */
  var mq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  var motionBtn = document.getElementById("motionBtn");
  if (store.get("hkd-motion") === "off") root.dataset.motion = "off";
  function reduced() {
    return mq.matches || root.dataset.motion === "off";
  }
  function syncMotionBtn() {
    if (mq.matches) {
      motionBtn.textContent = "已依系統設定減少動態效果";
      motionBtn.disabled = true;
      motionBtn.setAttribute("aria-pressed", "true");
    } else {
      var off = root.dataset.motion === "off";
      motionBtn.disabled = false;
      motionBtn.textContent = off
        ? "動畫：關（點一下打開）"
        : "動畫：開（點一下關閉）";
      motionBtn.setAttribute("aria-pressed", off ? "true" : "false");
    }
  }
  motionBtn.addEventListener("click", function () {
    if (root.dataset.motion === "off") {
      delete root.dataset.motion;
      store.set("hkd-motion", "on");
    } else {
      root.dataset.motion = "off";
      store.set("hkd-motion", "off");
    }
    syncMotionBtn();
  });
  if (mq.addEventListener) mq.addEventListener("change", syncMotionBtn);
  syncMotionBtn();

  /* ---------- 小工具 ---------- */
  function toMin(t) {
    var p = t.split(":");
    return +p[0] * 60 + +p[1];
  }
  function hhmm(m) {
    m = ((m % 1440) + 1440) % 1440;
    return (
      String(Math.floor(m / 60)).padStart(2, "0") +
      ":" +
      String(m % 60).padStart(2, "0")
    );
  }
  function fmt(m) {
    var h = Math.floor(m / 60),
      r = m % 60;
    if (!h) return r + " 分鐘";
    return h + " 小時" + (r ? " " + r + " 分" : "");
  }
  function mapUrl(q) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(q)
    );
  }
  function ico(id) {
    return '<svg aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  /* ---------- 航班 ---------- */
  var FLIGHTS = [
    {
      tag: "去程",
      c: "--mizu",
      date: "2027/04/22（四）",
      from: ["TPE", "桃園"],
      to: ["CTS", "新千歲"],
      dur: "約 3 小時 55 分",
      times: [
        ["到機場", "10:00", "台灣"],
        ["起飛", "約 13:00", "台灣"],
        ["抵達", "17:55", "日本"]
      ]
    },
    {
      tag: "國內線",
      c: "--wakatake",
      date: "2027/04/29（四）",
      from: ["MMB", "女滿別"],
      to: ["CTS", "新千歲"],
      dur: "約 45 分",
      times: [
        ["到機場", "12:35", "還車"],
        ["起飛", "約 13:55", "日本"],
        ["抵達", "14:40", "日本"]
      ]
    },
    {
      tag: "回程",
      c: "--coral",
      date: "2027/05/01（六）",
      from: ["CTS", "新千歲"],
      to: ["TPE", "桃園"],
      dur: "約 4 小時 25 分",
      times: [
        ["到機場", "16:10", "日本"],
        ["起飛", "約 19:10", "日本"],
        ["抵達", "22:35", "台灣"]
      ]
    }
  ];
  document.getElementById("passes").innerHTML = FLIGHTS.map(function (f) {
    return (
      '<article class="card pass">' +
      '<div class="pass-top" style="--c:var(' +
      f.c +
      ')"><b>' +
      f.tag +
      "</b><span>" +
      f.date +
      "</span></div>" +
      '<div class="pass-route">' +
      '<div class="ap"><b>' +
      f.from[0] +
      "</b><span>" +
      f.from[1] +
      "</span></div>" +
      '<div class="pass-mid"><svg viewBox="0 0 150 30" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<path d="M6 22 Q75 0 144 22" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-dasharray="1 6" stroke-linecap="round"/>' +
      '<g class="a-bob"><use href="#i-plane" x="62" y="0" width="26" height="26" style="color:var(--ink)"/></g></svg>' +
      "<span>" +
      f.dur +
      "</span></div>" +
      '<div class="ap r"><b>' +
      f.to[0] +
      "</b><span>" +
      f.to[1] +
      "</span></div>" +
      "</div>" +
      '<div class="tear" aria-hidden="true"></div>' +
      '<div class="pass-times">' +
      f.times
        .map(function (t) {
          return (
            "<div><small>" +
            t[0] +
            "</small><b>" +
            t[1] +
            "</b><em>" +
            t[2] +
            "</em></div>"
          );
        })
        .join("") +
      "</div>" +
      "</article>"
    );
  }).join("");

  /* ---------- 每日插圖 ---------- */
  var P = "var(--paper)",
    I = 'class="k2"';
  var ICONS = {
    plane:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 54a5 5 0 0 1 8-4 7 7 0 0 1 13 1 4 4 0 0 1 1 8H9a4 4 0 0 1-3-5z" fill="' +
      P +
      '" ' +
      I +
      '/><g class="a-bob"><path d="M14 30L10 18h7l10 12z" fill="var(--coral)" ' +
      I +
      '/><path d="M8 36c0-3.3 2.7-6 6-6h29c5 0 10 2.7 11 6-1 3.3-6 6-11 6H14c-3.3 0-6-2.7-6-6z" fill="' +
      P +
      '" ' +
      I +
      '/><path d="M25 39l-5 12h7l11-12z" fill="var(--mizu)" ' +
      I +
      '/><circle cx="34" cy="35" r="1.8" fill="var(--ink)"/><circle cx="40" cy="35" r="1.8" fill="var(--ink)"/><circle cx="46" cy="35.5" r="1.8" fill="var(--ink)"/></g></svg>',
    lighthouse:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a-blink"><path d="M19 10l-7-3M19 15h-8M45 10l7-3M45 15h8" ' +
      I +
      '/></g><path d="M2 64c6-11 15-16 30-16s24 5 30 16z" fill="var(--wakatake)" ' +
      I +
      '/><path d="M26 48l3-28h6l3 28z" fill="' +
      P +
      '" ' +
      I +
      '/><path d="M27.5 32h9l.8 8h-10.6z" fill="var(--coral)" ' +
      I +
      '/><path d="M27 20h10v-5a5 5 0 0 0-10 0z" fill="var(--yamabuki)" ' +
      I +
      '/><path d="M25 20h14" ' +
      I +
      "/></svg>",
    torii:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M5 15q27-8 54 0l-2 6q-25-6-50 0z" fill="var(--coral)" ' +
      I +
      '/><rect x="12" y="27" width="40" height="5" rx="1.5" fill="var(--coral)" ' +
      I +
      '/><path d="M17 21l-2 37h6l1-37zM47 21l2 37h-6l-1-37z" fill="var(--coral)" ' +
      I +
      '/><rect x="29" y="19" width="6" height="8" fill="' +
      P +
      '" ' +
      I +
      '/><path d="M6 58h52" ' +
      I +
      '/><g transform="translate(8 40)"><path class="a-bob" d="M0 0c3-4 8-3 8 1s-5 6-8 3c-1-1-1-3 0-4z" fill="var(--coral-pale)" stroke="var(--ink)" stroke-width="1.6"/></g><g transform="translate(50 34)"><path class="a-bob" style="animation-delay:-1.2s" d="M0 0c3-4 8-3 8 1s-5 6-8 3c-1-1-1-3 0-4z" fill="var(--coral-pale)" stroke="var(--ink)" stroke-width="1.6"/></g></svg>',
    pond:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="44" rx="28" ry="13" fill="var(--mizu)" ' +
      I +
      '/><g class="a-ripple"><path d="M12 45q5-2.5 10 0M38 50q5-2.5 10 0" fill="none" ' +
      I +
      ' stroke-width="2"/></g><path d="M22 46V18M22 27l-5-5M22 34l5-4M41 48V14M41 22l5-5M41 30l-4-3M31 45V25M31 32l4-3" fill="none" ' +
      I +
      "/></svg>",
    marimo:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M4 30q7-4 14 0t14 0 14 0 14 0v14a18 18 0 0 1-18 18H22A18 18 0 0 1 4 44z" fill="var(--mizu)" ' +
      I +
      '/><g class="a-hop"><circle cx="20" cy="47" r="9" fill="var(--wakatake)" ' +
      I +
      '/><circle cx="17" cy="46" r="1.3" fill="var(--ink)"/><circle cx="23" cy="46" r="1.3" fill="var(--ink)"/></g><g class="a-hop h2"><circle cx="41" cy="49" r="7" fill="var(--wakatake)" ' +
      I +
      '/><circle cx="39" cy="48" r="1.2" fill="var(--ink)"/><circle cx="43.5" cy="48" r="1.2" fill="var(--ink)"/></g><g class="a-hop h3"><circle cx="31" cy="37" r="5.5" fill="var(--wakatake)" ' +
      I +
      '/></g><circle cx="48" cy="22" r="2.5" fill="' +
      P +
      '" ' +
      I +
      ' stroke-width="1.8"/><circle cx="53" cy="14" r="1.8" fill="' +
      P +
      '" ' +
      I +
      ' stroke-width="1.6"/></svg>',
    steam:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M3 60l15-25 8 6 9-15 26 34z" fill="var(--yamabuki)" ' +
      I +
      '/><path d="M30 34l3 3 3-2" fill="none" ' +
      I +
      ' stroke-width="2"/><g class="a-steam"><path d="M26 22a5 5 0 0 1 9-3 4 4 0 0 1 4 6h-11a3 3 0 0 1-2-3z" fill="' +
      P +
      '" ' +
      I +
      '/></g><g class="a-steam s2"><path d="M36 12a4 4 0 0 1 7-2 3.5 3.5 0 0 1 3 5.5h-9a3 3 0 0 1-1-3.5z" fill="' +
      P +
      '" ' +
      I +
      "/></g></svg>",
    bear:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="18" cy="24" r="7" fill="var(--yamabuki)" ' +
      I +
      '/><circle cx="46" cy="24" r="7" fill="var(--yamabuki)" ' +
      I +
      '/><circle cx="18" cy="24" r="2.8" fill="var(--coral)"/><circle cx="46" cy="24" r="2.8" fill="var(--coral)"/><path d="M10 56c0-15 10-28 22-28s22 13 22 28z" fill="var(--yamabuki)" ' +
      I +
      '/><ellipse cx="32" cy="46" rx="8" ry="6" fill="' +
      P +
      '" ' +
      I +
      '/><ellipse cx="32" cy="43.5" rx="3" ry="2" fill="var(--ink)"/><g class="a-eyes"><circle cx="24" cy="38" r="2" fill="var(--ink)"/><circle cx="40" cy="38" r="2" fill="var(--ink)"/></g><path d="M2 64v-8q5-6 10 0q5-6 10 0q5-6 10 0q5-6 10 0q5-6 10 0q5-6 10 0v8z" fill="var(--wakatake)" ' +
      I +
      "/></svg>",
    clione:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M2 54q8-3 15 0t15 0 15 0 15 0" fill="none" stroke="var(--mizu)" stroke-width="3" stroke-linecap="round"/><path d="M8 52l9-6h28l12 6-6 7H13z" fill="' +
      P +
      '" ' +
      I +
      '/><g class="a-bob"><g class="a-flap"><path d="M26 22c-7-3-10 2-7 5 2 2 5 0 7-2z" fill="' +
      P +
      '" ' +
      I +
      '/></g><g class="a-flap" style="animation-delay:-.5s"><path d="M38 22c7-3 10 2 7 5-2 2-5 0-7-2z" fill="' +
      P +
      '" ' +
      I +
      '/></g><path d="M32 8c5 0 7 5 6 10l-2 16c-1 4-7 4-8 0l-2-16c-1-5 1-10 6-10z" fill="' +
      P +
      '" ' +
      I +
      '/><path d="M30 23c-1.6-2.2 1.6-3.6 2-1.4.4-2.2 3.6-.8 2 1.4l-2 2.6z" fill="var(--coral)" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"/><circle cx="30" cy="12" r="1.2" fill="var(--ink)"/><circle cx="34" cy="12" r="1.2" fill="var(--ink)"/></g></svg>',
    gondola:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a-twinkle"><path d="M10 26l1.5 3.5L15 31l-3.5 1.5L10 36l-1.5-3.5L5 31l3.5-1.5z" fill="var(--yamabuki)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/></g><g class="a-twinkle t2"><path d="M54 32l1.2 2.8L58 36l-2.8 1.2L54 40l-1.2-2.8L50 36l2.8-1.2z" fill="var(--yamabuki)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/></g><path d="M0 64q16-22 32-14t32-6v20z" fill="var(--wakatake)" ' +
      I +
      '/><path d="M2 6l60 12" fill="none" ' +
      I +
      '/><g class="a-swing" style="transform-origin:32px 12px"><path d="M32 12v8" ' +
      I +
      '/><rect x="20" y="20" width="24" height="18" rx="5" fill="var(--coral)" ' +
      I +
      '/><rect x="24" y="24" width="16" height="7" rx="2" fill="' +
      P +
      '" ' +
      I +
      ' stroke-width="2"/></g></svg>',
    suitcase:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a-wiggle"><path d="M24 20v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" fill="none" ' +
      I +
      '/><rect x="12" y="20" width="40" height="34" rx="7" fill="var(--mizu)" ' +
      I +
      '/><path d="M12 33h40" ' +
      I +
      '/><circle cx="22" cy="44" r="5" fill="var(--coral)" ' +
      I +
      ' stroke-width="2"/><rect x="33" y="40" width="12" height="8" rx="2" fill="var(--yamabuki)" ' +
      I +
      ' stroke-width="2"/><circle cx="20" cy="57" r="2.6" fill="var(--ink)"/><circle cx="44" cy="57" r="2.6" fill="var(--ink)"/></g></svg>'
  };

  /* ---------- 行程資料 ---------- */
  var MODES = {
    car: { lab: "自駕", ico: "i-car" },
    train: { lab: "JR", ico: "i-train" },
    subway: { lab: "地下鐵", ico: "i-train" },
    tram: { lab: "市電＋纜車", ico: "i-gondola" },
    walk: { lab: "步行", ico: "i-walk" },
    plane: { lab: "飛機", ico: "i-plane" }
  };
  function S(t, n, o) {
    o = o || {};
    o.t = t;
    o.n = n;
    return o;
  }
  var DAYS = [
    {
      date: "4/22",
      wd: "四",
      title: "出發！飛向北海道",
      area: "桃園 → 新千歲 → 札幌",
      ico: "plane",
      stops: [
        S("10:00", "臺灣桃園國際機場", {
          k: "air",
          sub: "TPE",
          stay: 180,
          lab: "報到、出境 3 小時",
          q: "Taiwan Taoyuan International Airport",
          tip: "約 13:00 起飛（台灣時間）"
        }),
        S("17:55", "新千歲機場", {
          k: "air",
          sub: "CTS・日本時間",
          stay: 60,
          lab: "入境、領行李 1 小時",
          q: "新千歳空港",
          tip: "一落地就把手錶調快 1 小時。"
        }),
        S("19:42", "札幌格拉斯麗酒店", {
          k: "hotel",
          lab: "入住",
          q: "ホテルグレイスリー札幌"
        })
      ],
      legs: [
        { m: "plane", lab: "飛行約 3 小時 55 分", nodur: 1 },
        { m: "train", lab: "JR 快速" }
      ]
    },

    {
      date: "4/23",
      wd: "五",
      title: "積丹藍與小樽運河",
      area: "札幌 → 積丹 → 余市 → 小樽",
      ico: "lighthouse",
      stops: [
        S("09:00", "札幌格拉斯麗酒店", {
          k: "hotel",
          lab: "出發",
          q: "ホテルグレイスリー札幌"
        }),
        S("10:57", "Cape Kamui", {
          sub: "神威岬",
          stay: 60,
          must: 1,
          q: "神威岬",
          tip: "從停車場走到岬角單程約 20 分鐘；風太大時步道會關閉。"
        }),
        S("12:20", "島武意海岸", {
          stay: 60,
          q: "島武意海岸",
          tip: "穿過一段短短的隧道，眼前就是積丹藍。"
        }),
        S("14:19", "Nikka威士忌余市蒸餾所", {
          stay: 60,
          q: "ニッカウヰスキー余市蒸溜所",
          tip: "竹鶴政孝創立的蒸餾所。開車的人不能試飲喔。"
        }),
        S("15:44", "青之洞窟", {
          stay: 60,
          q: "小樽 青の洞窟",
          tip: "要搭船進洞，會看海況決定是否出航。"
        }),
        S("17:04", "手宮公園", {
          stay: 60,
          q: "手宮公園 小樽",
          tip: "小山坡上的公園，可以俯瞰小樽港。"
        }),
        S("18:11", "小樽運河", {
          stay: 60,
          must: 1,
          q: "小樽運河",
          tip: "傍晚瓦斯燈一盞盞亮起，石造倉庫倒映在水面。"
        }),
        S("19:57", "札幌格拉斯麗酒店", {
          k: "hotel",
          lab: "回飯店",
          q: "ホテルグレイスリー札幌"
        })
      ],
      legs: [
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" }
      ]
    },

    {
      date: "4/24",
      wd: "六",
      title: "札幌散步，北上旭川",
      area: "札幌 → 當別 → 旭川",
      ico: "torii",
      stops: [
        S("08:00", "札幌格拉斯麗酒店", {
          k: "hotel",
          lab: "退房出發",
          q: "ホテルグレイスリー札幌"
        }),
        S("08:13", "圓山公園", {
          stay: 60,
          q: "円山公園 札幌",
          tip: "札幌櫻花往年在 4 月底到 5 月初開，運氣好能遇到早開的。"
        }),
        S("09:18", "北海道神宮", {
          stay: 60,
          must: 1,
          q: "北海道神宮",
          tip: "境內六花亭神宮茶屋的「判官さま」烤餅是招牌。"
        }),
        S("10:33", "北海道大學 銀杏並木", {
          stay: 60,
          q: "北海道大学 イチョウ並木",
          tip: "校園裡也能順路看看克拉克博士像。"
        }),
        S("11:40", "札幌諏訪神社", { stay: 60, q: "札幌諏訪神社" }),
        S("13:18", "ROYCE' TOWN 工場直賣店", {
          k: "shop",
          stay: 60,
          q: "ロイズタウン工場直売店",
          tip: "當別町的巧克力工廠，直賣店可以補貨伴手禮。"
        }),
        S("16:06", "JR INN 旭川", {
          k: "hotel",
          stay: 60,
          lab: "Check-in・休息 1 小時",
          q: "JRイン旭川"
        }),
        S("17:19", "成吉思汗大黑屋 旭川本店", {
          k: "food",
          stay: 60,
          q: "成吉思汗 大黒屋 本店 旭川",
          tip: "旭川人氣烤羊肉，常常要排隊，早點去。"
        }),
        S("18:33", "JR INN 旭川", {
          k: "hotel",
          lab: "回飯店",
          q: "JRイン旭川"
        })
      ],
      legs: [
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "walk" },
        { m: "walk" }
      ]
    },

    {
      date: "4/25",
      wd: "日",
      title: "青池、瀑布與十勝平原",
      area: "旭川 → 美瑛 → 富良野 → 帶廣",
      ico: "pond",
      stops: [
        S("08:00", "JR INN 旭川", {
          k: "hotel",
          lab: "退房出發",
          q: "JRイン旭川"
        }),
        S("08:49", "白金青池", {
          stay: 60,
          must: 1,
          q: "白金青い池",
          tip: "池水顏色會隨天氣變，4 月底池邊可能還有殘雪。"
        }),
        S("09:54", "白鬚瀑布", {
          stay: 60,
          q: "白ひげの滝",
          tip: "站在白金 Blue River 橋上往下看。"
        }),
        S("11:44", "森林精靈露台", {
          stay: 60,
          q: "ニングルテラス",
          tip: "森林步道旁的一排小木屋手作工藝店。"
        }),
        S("14:37", "十勝牧場展望台", {
          stay: 60,
          q: "十勝牧場 展望台",
          tip: "眺望整片十勝平原。"
        }),
        S("15:50", "十勝牧場 白樺並木道", {
          stay: 60,
          q: "十勝牧場 白樺並木",
          tip: "筆直的白樺林道，拍照好去處。"
        }),
        S("17:14", "Dormy Inn飯店 - 帶廣天然溫泉", {
          k: "hotel",
          lab: "入住",
          q: "ドーミーイン帯広",
          tip: "天然溫泉，晚上還有免費的宵夜拉麵。"
        })
      ],
      legs: [
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" }
      ]
    },

    {
      date: "4/26",
      wd: "一",
      title: "阿寒湖的愛努文化",
      area: "帶廣 → 阿寒湖 → 屈斜路湖",
      ico: "marimo",
      stops: [
        S("08:00", "Dormy Inn飯店 - 帶廣天然溫泉", {
          k: "hotel",
          lab: "退房出發",
          q: "ドーミーイン帯広"
        }),
        S("09:38", "雌阿寒岳", { stay: 60, q: "雌阿寒岳" }),
        S("10:56", "阿寒湖愛努村", {
          stay: 180,
          must: 1,
          q: "阿寒湖アイヌコタン",
          tip: "北海道最大的愛努聚落，木雕和工藝小店一整排。"
        }),
        S("14:01", "阿寒湖遊覽船乘船處", {
          stay: 60,
          q: "阿寒湖 遊覧船 乗り場",
          tip: "阿寒湖是特別天然紀念物「綠球藻」的家。"
        }),
        S("15:16", "雄阿寒岳", { stay: 60, q: "雄阿寒岳" }),
        S("17:06", "Kussharo Prince Hotel", {
          k: "hotel",
          sub: "屈斜路王子大飯店",
          lab: "入住",
          q: "屈斜路プリンスホテル",
          tip: "屈斜路湖畔的溫泉飯店。"
        })
      ],
      legs: [
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" }
      ]
    },

    {
      date: "4/27",
      wd: "二",
      title: "砂湯、硫磺山與摩周湖",
      area: "屈斜路湖 → 摩周湖 → 知床",
      ico: "steam",
      stops: [
        S("08:00", "Kussharo Prince Hotel", {
          k: "hotel",
          lab: "退房出發",
          q: "屈斜路プリンスホテル"
        }),
        S("08:16", "砂湯", {
          stay: 90,
          q: "砂湯 屈斜路湖",
          tip: "在湖邊撥開沙子，溫泉就冒出來了。"
        }),
        S("09:58", "硫磺山", {
          stay: 60,
          q: "硫黄山 弟子屈",
          tip: "冒煙的噴氣孔就在步道旁，休息站有賣溫泉蛋。"
        }),
        S("11:13", "摩周湖", {
          stay: 90,
          must: 1,
          q: "摩周湖第一展望台",
          tip: "透明度很高的火口湖，常常被霧籠罩。"
        }),
        S("14:33", "知床第一飯店", {
          k: "hotel",
          lab: "入住",
          q: "知床第一ホテル",
          tip: "宇登呂溫泉區。"
        })
      ],
      legs: [{ m: "car" }, { m: "car" }, { m: "car" }, { m: "car" }]
    },

    {
      date: "4/28",
      wd: "三",
      title: "知床半島一整天",
      area: "宇登呂 → 知床五湖 → 知床峠 → 網走",
      ico: "bear",
      stops: [
        S("08:00", "知床第一飯店", {
          k: "hotel",
          lab: "退房出發",
          q: "知床第一ホテル"
        }),
        S("08:08", "Puyuni Cape", {
          sub: "プユニ岬",
          stay: 30,
          q: "プユニ岬",
          tip: "俯瞰宇登呂港和鄂霍次克海。"
        }),
        S("08:38", "乙女之淚瀑布觀景台", {
          sub: "フレペの滝",
          stay: 60,
          q: "フレペの滝",
          tip: "從知床自然中心走過去約 20 分鐘。"
        }),
        S("09:56", "知床五湖", {
          stay: 150,
          must: 1,
          q: "知床五湖",
          tip: "開園初期走地上步道前要先聽 10 分鐘講習；高架木道可以直接走。"
        }),
        S("12:46", "波飛沫", { k: "food", stay: 50, q: "波飛沫 知床" }),
        S("13:55", "知床峠展望台", {
          stay: 30,
          q: "知床峠展望台",
          tip: "知床橫斷道路往年 4 月下旬才開通，出發前查路況。"
        }),
        S("14:55", "Oshinkoshin Falls", {
          sub: "オシンコシンの滝",
          stay: 60,
          q: "オシンコシンの滝",
          tip: "日本瀑布百選之一，就在國道旁邊。"
        }),
        S("17:05", "天然溫泉 天都之湯 多美迎網走", {
          k: "hotel",
          lab: "入住",
          q: "ドーミーイン網走",
          tip: "天然溫泉，晚上也有宵夜拉麵。"
        })
      ],
      legs: [
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" },
        { m: "car" }
      ]
    },

    {
      date: "4/29",
      wd: "四",
      title: "網走，飛回札幌",
      area: "網走 → 女滿別 ✈ 新千歲 → 札幌",
      ico: "clione",
      note: "4/29 是日本的昭和之日，黃金週連假開始，機場人會比較多。",
      stops: [
        S("09:00", "天然溫泉 天都之湯 多美迎網走", {
          k: "hotel",
          lab: "退房出發",
          q: "ドーミーイン網走"
        }),
        S("09:11", "鄂霍次克流冰館", {
          stay: 90,
          q: "オホーツク流氷館",
          tip: "在零下 15 度的展示室摸真正的流冰，還能看到流冰天使。"
        }),
        S("10:44", "網走監獄博物館", {
          stay: 90,
          must: 1,
          q: "博物館網走監獄",
          tip: "放射狀的舍房很壯觀，中午可以吃監獄食。"
        }),
        S("12:35", "MMB·女滿別機場", {
          k: "air",
          stay: 80,
          lab: "還車、報到 1 小時 20 分",
          q: "女満別空港"
        }),
        S("14:40", "CTS·新千歲機場", {
          k: "air",
          stay: 60,
          lab: "領行李 1 小時",
          q: "新千歳空港"
        }),
        S("16:34", "VESSEL INN 札幌中島公園", {
          k: "hotel",
          lab: "入住",
          q: "ベッセルイン札幌中島公園"
        })
      ],
      legs: [
        { m: "car" },
        { m: "car" },
        { m: "car", lab: "自駕・去還車" },
        { m: "plane", lab: "飛行約 45 分", nodur: 1 },
        { m: "train", lab: "JR＋地下鐵" }
      ]
    },

    {
      date: "4/30",
      wd: "五",
      title: "甜點巡禮與藻岩山夜景",
      area: "札幌市區",
      ico: "gondola",
      stops: [
        S("09:23", "VESSEL INN 札幌中島公園", {
          k: "hotel",
          lab: "出發",
          q: "ベッセルイン札幌中島公園"
        }),
        S("09:58", "白色戀人公園", {
          stay: 90,
          q: "白い恋人パーク",
          tip: "想做手作餅乾的話要先預約。"
        }),
        S("12:02", "北菓樓 札幌本館", {
          k: "shop",
          stay: 60,
          q: "北菓楼 札幌本館",
          tip: "招牌是夢不思議泡芙。"
        }),
        S("13:13", "六花亭 札幌本店", {
          k: "shop",
          stay: 60,
          q: "六花亭 札幌本店",
          tip: "店裡有喫茶室，可以坐下來吃甜點。"
        }),
        S("14:34", "VESSEL INN 札幌中島公園", {
          k: "hotel",
          stay: 60,
          lab: "回飯店放戰利品，休息 1 小時",
          q: "ベッセルイン札幌中島公園"
        }),
        S("16:28", "藻岩山山頂展望台", {
          stay: 120,
          must: 1,
          q: "もいわ山山頂展望台",
          tip: "日本新三大夜景之一，看完夕陽等天黑再下山。"
        }),
        S("19:22", "VESSEL INN 札幌中島公園", {
          k: "hotel",
          lab: "回飯店",
          q: "ベッセルイン札幌中島公園"
        })
      ],
      legs: [
        { m: "subway" },
        { m: "subway" },
        { m: "walk" },
        { m: "subway" },
        { m: "tram" },
        { m: "tram" }
      ]
    },

    {
      date: "5/1",
      wd: "六",
      title: "最後採買，回家囉",
      area: "札幌 → 千歲 → 桃園",
      ico: "suitcase",
      stops: [
        S("08:00", "VESSEL INN 札幌中島公園", {
          k: "hotel",
          stay: 60,
          lab: "早餐、退房，09:00 出發",
          q: "ベッセルイン札幌中島公園"
        }),
        S("09:11", "中島公園", {
          stay: 60,
          q: "中島公園 札幌",
          tip: "剛好是札幌櫻花季，運氣好會看到盛開。"
        }),
        S("11:02", "AEON 千歲店", {
          k: "shop",
          stay: 60,
          q: "イオン千歳店"
        }),
        S("12:24", "UNIQLO 新千歲機場店", {
          k: "shop",
          stay: 60,
          q: "ユニクロ 新千歳空港店"
        }),
        S("16:10", "CTS·新千歲機場", {
          k: "air",
          stay: 180,
          lab: "報到、出境 3 小時",
          q: "新千歳空港",
          tip: "約 19:10 起飛（日本時間）"
        }),
        S("22:35", "TPE·臺灣桃園國際機場", {
          k: "air",
          lab: "抵達（台灣時間）",
          q: "Taiwan Taoyuan International Airport",
          tip: "平安到家！"
        })
      ],
      legs: [
        { m: "walk" },
        { m: "train", lab: "地下鐵＋JR" },
        { m: "train" },
        { m: "walk", lab: "機場內閒逛" },
        { m: "plane", lab: "飛行約 4 小時 25 分", nodur: 1 }
      ]
    }
  ];
  var HEADBG = [
    "--mizu-pale",
    "--yamabuki-pale",
    "--wakatake-pale",
    "--coral-pale"
  ];
  var NODEICO = {
    spot: "i-spot",
    food: "i-food",
    shop: "i-shop",
    hotel: "i-hotel",
    air: "i-plane"
  };

  function legDur(d, k) {
    var a = d.stops[k],
      b = d.stops[k + 1];
    return toMin(b.t) - (toMin(a.t) + (a.stay || 0));
  }

  function stopHTML(s, i) {
    var kind = s.k || "spot";
    var nodeCls = s.must ? "n-must" : "n-" + kind;
    var cardCls =
      "t-card" +
      (kind === "hotel" ? " plain" : "") +
      (s.must ? " is-must" : "") +
      (kind === "air" ? " is-air" : "");
    var stay = s.lab
      ? s.lab
      : s.stay
        ? "停留 " +
          fmt(s.stay) +
          "・" +
          hhmm(toMin(s.t) + s.stay) +
          " 離開"
        : "";
    return (
      '<li class="stop" style="--i:' +
      i +
      '">' +
      '<div class="t-time">' +
      s.t +
      "</div>" +
      '<div class="t-node ' +
      nodeCls +
      '">' +
      ico(NODEICO[kind]) +
      "</div>" +
      '<div class="' +
      cardCls +
      '">' +
      '<div class="t-head"><h4>' +
      s.n +
      "</h4>" +
      (s.must
        ? '<span class="must">' + ico("i-star") + "必去</span>"
        : "") +
      "</div>" +
      (s.sub ? '<p class="t-sub">' + s.sub + "</p>" : "") +
      (stay ? '<p class="t-stay">' + stay + "</p>" : "") +
      (s.tip ? '<p class="t-tip">' + s.tip + "</p>" : "") +
      (kind !== "hotel"
        ? '<div class="t-foot"><a class="mini-link" href="' +
          mapUrl(s.q || s.n) +
          '" target="_blank" rel="noopener">' +
          ico("i-pin") +
          "地圖</a></div>"
        : "") +
      "</div></li>"
    );
  }
  function legHTML(d, k, i) {
    var L = d.legs[k],
      M = MODES[L.m],
      dur = legDur(d, k);
    var txt =
      (L.lab || M.lab) +
      (L.nodur ? "" : "・" + (dur <= 2 ? "就在附近" : fmt(dur)));
    return (
      '<li class="leg" style="--i:' +
      i +
      '"><span class="tag m-' +
      L.m +
      '">' +
      ico(M.ico) +
      txt +
      "</span></li>"
    );
  }

  /* ---------- 日期切換 ---------- */
  var chips = document.getElementById("chips");
  var panel = document.getElementById("panel");
  var daybar = document.getElementById("daybar");
  var current = -1;

  chips.innerHTML = DAYS.map(function (d, i) {
    return (
      '<button class="chip" role="tab" id="tab-' +
      i +
      '" aria-controls="panel" aria-selected="false" tabindex="-1" data-i="' +
      i +
      '">' +
      '<span class="d">' +
      d.date +
      '</span><span class="n">第' +
      (i + 1) +
      '天</span><span class="sr">星期' +
      d.wd +
      "</span></button>"
    );
  }).join("");

  function renderDay(i, animate) {
    var d = DAYS[i];
    var drive = 0;
    d.legs.forEach(function (L, k) {
      if (L.m === "car") drive += legDur(d, k);
    });
    var musts = d.stops.filter(function (s) {
      return s.must;
    }).length;
    var html =
      '<div class="dayhead" style="--hb:var(' +
      HEADBG[i % 4] +
      ')">' +
      '<div class="dayhead-txt">' +
      '<p class="eyebrow">第 ' +
      (i + 1) +
      " 天・2027/" +
      d.date +
      "（" +
      d.wd +
      "）</p>" +
      "<h3>" +
      d.title +
      "</h3>" +
      '<p class="area">' +
      d.area +
      "</p>" +
      '<div class="meta">' +
      (drive
        ? '<span class="pill">' +
          ico("i-car").replace(
            "<svg",
            '<svg style="width:15px;height:15px"'
          ) +
          "開車約 " +
          fmt(drive) +
          "</span>"
        : "") +
      (musts
        ? '<span class="pill">' +
          ico("i-star").replace(
            "<svg",
            '<svg style="width:14px;height:14px"'
          ) +
          "必去 " +
          musts +
          " 處</span>"
        : "") +
      "</div>" +
      "</div>" +
      '<div class="dayicon">' +
      ICONS[d.ico] +
      "</div>" +
      "</div>";
    if (d.note) html += '<p class="daynote">' + d.note + "</p>";
    html += '<ol class="tl">';
    var n = 0;
    d.stops.forEach(function (s, k) {
      html += stopHTML(s, n++);
      if (k < d.legs.length) html += legHTML(d, k, n++);
    });
    html += "</ol>";
    panel.innerHTML = html;
    panel.setAttribute("aria-labelledby", "tab-" + i);
    if (animate && !reduced()) {
      panel.classList.remove("bounce");
      void panel.offsetWidth;
      panel.classList.add("bounce");
    }
  }

  function selectDay(i, opts) {
    opts = opts || {};
    if (i === current && !opts.force) return;
    var prev = chips.querySelector('[aria-selected="true"]');
    if (prev) {
      prev.setAttribute("aria-selected", "false");
      prev.tabIndex = -1;
    }
    var chip = chips.children[i];
    chip.setAttribute("aria-selected", "true");
    chip.tabIndex = 0;
    current = i;
    renderDay(i, opts.animate);
    store.set("hkd-day", i);
    if (opts.animate && !reduced()) {
      chip.classList.remove("boing");
      void chip.offsetWidth;
      chip.classList.add("boing");
    }
    if (opts.scroll) {
      var navH = document
        .querySelector(".topbar")
        .getBoundingClientRect().height;
      var barH = daybar.getBoundingClientRect().height;
      var top = panel.getBoundingClientRect().top;
      if (top < navH + barH - 1) {
        window.scrollTo({
          top: window.scrollY + top - navH - barH,
          behavior: reduced() ? "auto" : "smooth"
        });
      }
    }
  }
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    selectDay(+b.dataset.i, { animate: true, scroll: true });
  });
  chips.addEventListener("keydown", function (e) {
    var map = { ArrowRight: 1, ArrowLeft: -1, Home: "h", End: "e" };
    if (!(e.key in map)) return;
    e.preventDefault();
    var n =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? DAYS.length - 1
          : (current + map[e.key] + DAYS.length) % DAYS.length;
    selectDay(n, { animate: true });
    chips.children[n].focus();
  });

  /* ---------- 倒數 ---------- */
  var DEPART = Date.UTC(2027, 3, 22, 2, 0, 0); // 4/22 10:00 台灣
  var HOME = Date.UTC(2027, 4, 1, 14, 35, 0); // 5/1 22:35 台灣
  var TRIP0 = Date.UTC(2027, 3, 21, 15, 0, 0); // 4/22 00:00 日本
  var el = function (id) {
    return document.getElementById(id);
  };
  var cdTiles = el("cdTiles"),
    cdMsg = el("cdMsg");
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function tripDay(now) {
    if (now < DEPART || now >= HOME) return -1;
    return Math.min(9, Math.max(0, Math.floor((now - TRIP0) / 864e5)));
  }
  function tick() {
    var now = Date.now(),
      diff = DEPART - now;
    if (diff > 0) {
      var s = Math.floor(diff / 1000);
      el("cdD").textContent = Math.floor(s / 86400);
      el("cdH").textContent = pad(Math.floor((s % 86400) / 3600));
      el("cdM").textContent = pad(Math.floor((s % 3600) / 60));
      el("cdS").textContent = pad(s % 60);
      return;
    }
    cdTiles.hidden = true;
    cdMsg.hidden = false;
    var td = tripDay(now);
    if (td >= 0) {
      el("cdLabel").textContent = "旅行中";
      el("cdWhen").textContent =
        "2027/" + DAYS[td].date + "（" + DAYS[td].wd + "）";
      if (!cdMsg.dataset.day || +cdMsg.dataset.day !== td) {
        cdMsg.dataset.day = td;
        cdMsg.innerHTML =
          "今天是第 " +
          (td + 1) +
          " 天：" +
          DAYS[td].title +
          '<br><button type="button" id="goToday">看今天的行程</button>';
        el("goToday").addEventListener("click", function () {
          selectDay(td, { animate: true, force: true });
          el("days").scrollIntoView({
            behavior: reduced() ? "auto" : "smooth"
          });
        });
      }
    } else {
      el("cdLabel").textContent = "旅程結束";
      el("cdWhen").textContent = "2027/05/01 22:35 平安回到桃園";
      cdMsg.textContent = "十天的北海道玩完了，下次見！";
      clearInterval(timer);
    }
  }
  var timer = setInterval(tick, 1000);
  tick();

  /* 預設日期：旅途中顯示當天，否則回到上次看的那天 */
  var today = tripDay(Date.now());
  if (today >= 0) chips.children[today].classList.add("today");
  var saved = store.get("hkd-day");
  selectDay(
    today >= 0
      ? today
      : typeof saved === "number" && saved >= 0 && saved < DAYS.length
        ? saved
        : 0,
    { force: true }
  );

  /* ---------- 住宿 ---------- */
  var HOTELS = [
    {
      n: "札幌格拉斯麗酒店",
      jp: "ホテルグレイスリー札幌",
      area: "札幌站前",
      in: "4/22（四）",
      out: "4/24（六）",
      nights: 2,
      arrive: "19:42",
      q: "ホテルグレイスリー札幌"
    },
    {
      n: "JR INN 旭川",
      jp: "JRイン旭川",
      area: "旭川站前",
      in: "4/24（六）",
      out: "4/25（日）",
      nights: 1,
      arrive: "16:06",
      q: "JRイン旭川"
    },
    {
      n: "Dormy Inn 帶廣天然溫泉",
      jp: "ドーミーイン帯広",
      area: "帶廣市區",
      in: "4/25（日）",
      out: "4/26（一）",
      nights: 1,
      arrive: "17:14",
      onsen: 1,
      q: "ドーミーイン帯広"
    },
    {
      n: "Kussharo Prince Hotel",
      jp: "屈斜路プリンスホテル",
      area: "屈斜路湖畔",
      in: "4/26（一）",
      out: "4/27（二）",
      nights: 1,
      arrive: "17:06",
      onsen: 1,
      q: "屈斜路プリンスホテル"
    },
    {
      n: "知床第一飯店",
      jp: "知床第一ホテル",
      area: "宇登呂溫泉",
      in: "4/27（二）",
      out: "4/28（三）",
      nights: 1,
      arrive: "14:33",
      onsen: 1,
      q: "知床第一ホテル"
    },
    {
      n: "天然溫泉 天都之湯 多美迎網走",
      jp: "ドーミーイン網走",
      area: "網走市區",
      in: "4/28（三）",
      out: "4/29（四）",
      nights: 1,
      arrive: "17:05",
      onsen: 1,
      q: "ドーミーイン網走"
    },
    {
      n: "VESSEL INN 札幌中島公園",
      jp: "ベッセルイン札幌中島公園",
      area: "中島公園",
      in: "4/29（四）",
      out: "5/1（六）",
      nights: 2,
      arrive: "16:34",
      q: "ベッセルイン札幌中島公園"
    }
  ];
  var HC = ["--mizu", "--yamabuki", "--wakatake", "--coral"];
  document.getElementById("hotels").innerHTML = HOTELS.map(
    function (h, i) {
      return (
        '<li class="card hotel">' +
        '<div class="hotel-n" style="--c:var(' +
        HC[i % 4] +
        ')"><b>' +
        h.nights +
        "</b><span>晚</span></div>" +
        '<div style="min-width:0">' +
        "<h3>" +
        h.n +
        "</h3>" +
        '<p class="jp">' +
        h.jp +
        "・" +
        h.area +
        "</p>" +
        '<p class="dates">' +
        h.in +
        " 入住 → " +
        h.out +
        " 退房</p>" +
        '<div class="hotel-foot">' +
        (h.onsen
          ? '<span class="onsen">' + ico("i-onsen") + "溫泉</span>"
          : "") +
        "<span>預計 " +
        h.arrive +
        " 抵達</span>" +
        '<a class="mini-link" href="' +
        mapUrl(h.q) +
        '" target="_blank" rel="noopener">' +
        ico("i-pin") +
        "地圖</a>" +
        "</div>" +
        "</div></li>"
      );
    }
  ).join("");

  /* ---------- 待辦清單 ---------- */
  var TODO = [
    {
      g: "證件與入境",
      items: [
        ["passport", "確認護照效期"],
        [
          "vjw",
          "填寫 Visit Japan Web",
          "入境、海關資料先填好，落地掃 QR Code"
        ],
        ["insure", "買旅遊平安險"]
      ]
    },
    {
      g: "開車",
      items: [
        [
          "license",
          "申請台灣駕照日文譯本",
          "到監理站辦，和台灣駕照一起帶"
        ],
        ["rental", "預約租車", "確認取車地點，4/29 在女滿別機場還車"],
        [
          "roads",
          "確認知床五湖、知床峠開放日",
          "往年 4 月下旬開通，日期每年不同"
        ]
      ]
    },
    {
      g: "預約與確認",
      items: [
        ["hotels", "7 間住宿訂房確認"],
        ["nikka", "查 Nikka 余市蒸餾所參觀是否要預約"],
        ["boats", "確認青之洞窟遊船、阿寒湖遊覽船 4 月底有開"],
        ["cookie", "白色戀人公園手作餅乾（想做就先預約）"]
      ]
    },
    {
      g: "行李",
      items: [
        ["coat", "防風外套、帽子、手套", "道東和知床 4 月底早晚還很冷"],
        ["money", "日幣現金、信用卡"],
        ["sim", "網卡或 eSIM"],
        ["power", "行動電源", "插頭和台灣一樣，不用轉接頭"]
      ]
    }
  ];
  var state = store.get("hkd-todo") || {};
  state.done = state.done || {};
  state.custom = state.custom || [];
  function saveTodo() {
    store.set("hkd-todo", state);
  }
  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }
  function itemHTML(id, text, sub, custom) {
    return (
      '<li><input type="checkbox" id="td-' +
      id +
      '" data-id="' +
      id +
      '"' +
      (state.done[id] ? " checked" : "") +
      ">" +
      '<label for="td-' +
      id +
      '">' +
      text +
      (sub ? "<small>" + sub + "</small>" : "") +
      "</label>" +
      (custom
        ? '<button type="button" class="del" data-del="' +
          id +
          '" aria-label="刪除「' +
          text +
          '」">刪除</button>'
        : "") +
      "</li>"
    );
  }
  function renderTodo() {
    var html = TODO.map(function (g) {
      return (
        "<div><h3>" +
        g.g +
        "</h3><ul>" +
        g.items
          .map(function (it) {
            return itemHTML(it[0], it[1], it[2]);
          })
          .join("") +
        "</ul></div>"
      );
    }).join("");
    if (state.custom.length) {
      html +=
        "<div><h3>我自己加的</h3><ul>" +
        state.custom
          .map(function (c) {
            return itemHTML(c.id, esc(c.text), "", true);
          })
          .join("") +
        "</ul></div>";
    }
    document.getElementById("todoGroups").innerHTML =
      '<div style="display:flex;flex-direction:column;gap:16px">' +
      html +
      "</div>";
    updateProgress();
  }
  function allIds() {
    var ids = [];
    TODO.forEach(function (g) {
      g.items.forEach(function (it) {
        ids.push(it[0]);
      });
    });
    state.custom.forEach(function (c) {
      ids.push(c.id);
    });
    return ids;
  }
  function updateProgress() {
    var ids = allIds(),
      done = ids.filter(function (id) {
        return state.done[id];
      }).length;
    el("tDone").textContent = done;
    el("tTotal").textContent = ids.length;
    var bar = el("tBar");
    bar.style.width = (ids.length ? (done / ids.length) * 100 : 0) + "%";
    bar.classList.toggle("zero", done === 0);
    el("allDone").hidden = !(ids.length && done === ids.length);
  }
  el("todoGroups").addEventListener("change", function (e) {
    var t = e.target;
    if (!t.dataset.id) return;
    if (t.checked) state.done[t.dataset.id] = 1;
    else delete state.done[t.dataset.id];
    saveTodo();
    updateProgress();
  });
  el("todoGroups").addEventListener("click", function (e) {
    var b = e.target.closest("[data-del]");
    if (!b) return;
    var id = b.dataset.del;
    state.custom = state.custom.filter(function (c) {
      return c.id !== id;
    });
    delete state.done[id];
    saveTodo();
    renderTodo();
    el("addInput").focus();
  });
  el("addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = el("addInput"),
      v = input.value.trim();
    if (!v) {
      input.focus();
      return;
    }
    state.custom.push({ id: "c" + Date.now().toString(36), text: v });
    input.value = "";
    saveTodo();
    renderTodo();
  });
  renderTodo();

  /* ---------- 選單跟著捲動 ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".nav a")
  );
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }
  function onScroll() {
    var navH = document
      .querySelector(".topbar")
      .getBoundingClientRect().height;
    daybar.classList.toggle(
      "stuck",
      daybar.getBoundingClientRect().top <= navH + 0.5 &&
        el("days").getBoundingClientRect().bottom > navH + 80
    );
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    )
      setActive("todo");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function () {
  "use strict";
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
    },
    del: function (k) {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    }
  };

  /* ---------- 減少動態效果（依系統設定） ---------- */
  var mq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  function reduced() {
    return mq.matches;
  }

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
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q)
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

  /* ---------- 記帳與清單：資料 ---------- */
  var CATS = [
    { id: "food", lab: "餐飲", c: "--yamabuki" },
    { id: "ticket", lab: "門票", c: "--wakatake" },
    { id: "move", lab: "交通", c: "--mizu" },
    { id: "shop", lab: "購物", c: "--coral" },
    { id: "stay", lab: "住宿", c: "--coral-pale" },
    { id: "etc", lab: "其他", c: "--paper" }
  ];
  var CATMAP = {};
  CATS.forEach(function (c) {
    CATMAP[c.id] = c;
  });
  function catOf(id) {
    return CATMAP[id] || CATMAP.etc;
  }
  var DEFCAT = {
    spot: "ticket",
    food: "food",
    shop: "shop",
    hotel: "stay",
    air: "move"
  };

  /* 共用資料庫設定：config.js 會放 window.TRIP_CONFIG */
  var SDK_VER = "12.19.0";
  var SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VER + "/";
  var CFG = window.TRIP_CONFIG || {};
  var FB = CFG.firebase || {};
  var HAS_CLOUD = !!(FB.apiKey && FB.projectId);
  var AI_MODEL = (CFG.ai && CFG.ai.model) || "gemini-3.5-flash";
  var CODE_RE = /^[a-z0-9]{24,64}$/;
  var myName = String(store.get("hkd-name") || "").slice(0, 12);
  var canSave = (function () {
    try {
      localStorage.setItem("hkd-t", "1");
      localStorage.removeItem("hkd-t");
      return true;
    } catch (e) {
      return false;
    }
  })();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  function newCode() {
    var abc = "abcdefghijkmnpqrstuvwxyz23456789",
      a = new Uint8Array(26),
      s = "";
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else
      for (var j = 0; j < a.length; j++) a[j] = Math.floor(Math.random() * 256);
    for (var i = 0; i < a.length; i++) s += abc[a[i] % 32];
    return s;
  }

  /* 邀請連結 #trip=代碼 → 記住這本共用帳本，並把代碼從網址列拿掉 */
  var tripCode = (function () {
    var m = /(?:^#|&)trip=([a-z0-9]{24,64})/.exec(location.hash);
    if (m) {
      store.set("hkd-trip", m[1]);
      try {
        history.replaceState(null, "", location.href.split("#")[0]);
      } catch (e) {}
      return m[1];
    }
    var c = store.get("hkd-trip");
    return typeof c === "string" && CODE_RE.test(c) ? c : null;
  })();
  var MODE = HAS_CLOUD && tripCode ? "cloud" : "local";

  function validExp(e) {
    return (
      e && typeof e.id === "string" && typeof e.key === "string" && +e.amt > 0
    );
  }
  /* 分帳欄位：pay 誰付的；items 明細（who 空白＝付款人、* ＝大家平分）；
     rest 明細以外的金額算誰的，規則和 who 一樣 */
  function cleanName(s) {
    return String(s || "")
      .trim()
      .slice(0, 12);
  }
  function cleanMembers(a) {
    var out = [];
    (Array.isArray(a) ? a : []).forEach(function (n) {
      n = cleanName(n);
      if (n && n !== "*" && out.indexOf(n) < 0 && out.length < 20) out.push(n);
    });
    return out;
  }
  function cleanItems(a) {
    return (Array.isArray(a) ? a : [])
      .filter(function (it) {
        return it && Math.round(+it.amt) > 0;
      })
      .slice(0, 40)
      .map(function (it) {
        return {
          n: String(it.n || "").slice(0, 30),
          amt: Math.round(+it.amt),
          who: String(it.who || "").slice(0, 20)
        };
      });
  }
  function cleanExp(e) {
    return {
      id: e.id,
      key: e.key,
      amt: +e.amt,
      cat: e.cat,
      note: String(e.note || ""),
      by: String(e.by || ""),
      t: +e.t || 0,
      pay: String(e.pay || "").slice(0, 20),
      rest: String(e.rest || "").slice(0, 20),
      items: cleanItems(e.items)
    };
  }
  function normalize(L) {
    L = L && typeof L === "object" ? L : {};
    return {
      expenses: Array.isArray(L.expenses)
        ? L.expenses.filter(validExp).map(cleanExp)
        : [],
      members: cleanMembers(L.members),
      done: L.done && typeof L.done === "object" ? L.done : {},
      custom: Array.isArray(L.custom)
        ? L.custom.filter(function (c) {
            return c && typeof c.id === "string" && typeof c.text === "string";
          })
        : [],
      rate:
        typeof L.rate === "number" && L.rate > 0 && L.rate < 10 ? L.rate : 0.21
    };
  }
  /* 本機資料；順便把舊版（hkd-ledger / hkd-todo）的記錄搬過來 */
  function readLocal() {
    var L = store.get("hkd-local");
    if (L && typeof L === "object") return normalize(L);
    L = { expenses: [], done: {}, custom: [] };
    var old = store.get("hkd-ledger"),
      ot = store.get("hkd-todo");
    if (old && old.items && typeof old.items === "object") {
      Object.keys(old.items).forEach(function (key) {
        (Array.isArray(old.items[key]) ? old.items[key] : []).forEach(
          function (e, j) {
            L.expenses.push({
              id: String(e.id || "m" + uid()),
              key: key,
              amt: +e.amt || 0,
              cat: e.cat || "etc",
              note: String(e.note || ""),
              by: "",
              t: j
            });
          }
        );
      });
      if (typeof old.rate === "number") L.rate = old.rate;
    }
    if (ot && typeof ot === "object") {
      L.done = ot.done || {};
      L.custom = (Array.isArray(ot.custom) ? ot.custom : []).map(
        function (c, j) {
          return { id: String(c.id), text: String(c.text), t: j };
        }
      );
    }
    return normalize(L);
  }
  /* 共用模式先顯示上次同步的副本，連上之後再換成最新資料 */
  var S =
    MODE === "cloud"
      ? normalize(store.get("hkd-mirror-" + tripCode))
      : readLocal();
  var BY_KEY = {},
    seen = {};
  function reindex() {
    BY_KEY = {};
    S.expenses
      .slice()
      .sort(function (a, b) {
        return (a.t || 0) - (b.t || 0);
      })
      .forEach(function (e) {
        (BY_KEY[e.key] = BY_KEY[e.key] || []).push(e);
      });
  }
  reindex();

  function yen(n) {
    return "¥" + n.toLocaleString("ja-JP");
  }
  function twd(n) {
    return "NT$" + Math.round(n * S.rate).toLocaleString("zh-TW");
  }
  function stopKey(di, k) {
    var d = DAYS[di],
      s = d.stops[k];
    return d.date + "|" + s.t + "|" + s.n;
  }
  function entries(key) {
    return BY_KEY[key] || [];
  }
  function sum(list) {
    return list.reduce(function (a, e) {
      return a + (+e.amt || 0);
    }, 0);
  }
  function payerOf(e) {
    return e.pay || e.by || "";
  }
  function whoLab(who, e) {
    return who === "*" ? "大家平分" : who || payerOf(e) || "付款人";
  }
  function defPayer() {
    var me = cleanName(myName);
    return S.members.indexOf(me) >= 0 ? me : S.members[0] || "";
  }
  function peopleOpts(kind, val) {
    var list = S.members.slice(),
      opts =
        kind === "who"
          ? [
              ["", "付款人自己"],
              ["*", "大家平分"]
            ]
          : [];
    if (val && val !== "*" && list.indexOf(val) < 0) list.push(val);
    list.forEach(function (n) {
      opts.push([n, n]);
    });
    return opts
      .map(function (o) {
        return (
          '<option value="' +
          esc(o[0]) +
          '"' +
          (o[0] === val ? " selected" : "") +
          ">" +
          esc(o[1]) +
          "</option>"
        );
      })
      .join("");
  }
  /* 旅伴名單變了，就更新記帳表單裡「誰付的／誰買的」選單，保留已經選好的值 */
  function fillPeople(root) {
    var sig = S.members.join("\n"),
      has = S.members.length > 0;
    Array.prototype.forEach.call(
      root.querySelectorAll("select[data-people]"),
      function (s) {
        if (s.dataset.sig === sig) return;
        var v =
          s.dataset.sig === undefined && s.dataset.people === "pay"
            ? defPayer()
            : s.value;
        s.innerHTML = peopleOpts(s.dataset.people, v);
        s.dataset.sig = sig;
      }
    );
    Array.prototype.forEach.call(
      root.querySelectorAll("[data-split]"),
      function (n) {
        n.hidden = !has;
      }
    );
    Array.prototype.forEach.call(
      root.querySelectorAll("[data-nosplit]"),
      function (n) {
        n.hidden = has;
      }
    );
  }
  function dayTotal(di) {
    var t = 0;
    DAYS[di].stops.forEach(function (s, k) {
      t += sum(entries(stopKey(di, k)));
    });
    return t;
  }
  function toggleLabel(list) {
    return list.length
      ? '<span class="sr">記帳：</span>' +
          yen(sum(list)) +
          "・" +
          list.length +
          " 筆"
      : "記帳";
  }
  function toggleHTML(di, k) {
    var list = entries(stopKey(di, k));
    return (
      '<button type="button" class="lg-toggle' +
      (list.length ? " has" : "") +
      '" aria-expanded="false" aria-controls="lg' +
      di +
      "-" +
      k +
      '">' +
      ico("i-coin") +
      '<span class="lg-lab">' +
      toggleLabel(list) +
      '</span><svg class="chev" aria-hidden="true"><use href="#i-chev"/></svg></button>'
    );
  }
  function listHTML(di, k) {
    var list = entries(stopKey(di, k));
    if (!list.length)
      return '<li class="lg-empty">還沒有記錄，記下第一筆吧。</li>';
    return (
      list
        .map(function (e) {
          seen[e.id] = 1;
          var c = catOf(e.cat),
            a = +e.amt || 0,
            payer = payerOf(e),
            rest = a - sum(e.items);
          return (
            '<li class="lg-item" data-id="' +
            esc(e.id) +
            '"><span class="lg-cat" style="--cc:var(' +
            c.c +
            ')">' +
            c.lab +
            "</span>" +
            '<span class="lg-n">' +
            esc(e.note || "") +
            (payer
              ? "<small>" + esc(payer) + (e.pay ? " 付" : "") + "</small>"
              : "") +
            (!e.items.length && e.rest
              ? "<small>" +
                (e.rest === "*" ? "大家平分" : "算 " + esc(e.rest) + " 的") +
                "</small>"
              : "") +
            "</span><b>" +
            yen(a) +
            "</b>" +
            '<button type="button" class="lg-del" data-del="' +
            esc(e.id) +
            '" aria-label="刪除 ' +
            c.lab +
            " " +
            yen(a) +
            '">' +
            ico("i-x") +
            "</button>" +
            (e.items.length
              ? '<ul class="lg-its">' +
                e.items
                  .map(function (it) {
                    return (
                      "<li><span>" +
                      esc(it.n || "品項") +
                      "</span><small>" +
                      esc(whoLab(it.who, e)) +
                      "</small><b>" +
                      yen(it.amt) +
                      "</b></li>"
                    );
                  })
                  .join("") +
                (rest > 0
                  ? "<li><span>其餘</span><small>" +
                    esc(whoLab(e.rest, e)) +
                    "</small><b>" +
                    yen(rest) +
                    "</b></li>"
                  : "") +
                "</ul>"
              : "") +
            "</li>"
          );
        })
        .join("") +
      (list.length > 1
        ? '<li class="lg-sub"><span>小計</span><b>' +
          yen(sum(list)) +
          "</b></li>"
        : "")
    );
  }
  function ledgerInner(di, k, kind) {
    var id = "lg" + di + "-" + k,
      def = DEFCAT[kind] || "etc";
    return (
      '<ul class="lg-list">' +
      listHTML(di, k) +
      "</ul>" +
      '<form class="lg-form" data-k="' +
      k +
      '" novalidate>' +
      '<div class="lg-row">' +
      '<div class="lg-amt"><label class="sr" for="' +
      id +
      '-amt">金額（日圓）</label><span class="yen" aria-hidden="true">¥</span>' +
      '<input id="' +
      id +
      '-amt" name="amt" type="text" inputmode="numeric" autocomplete="off" placeholder="金額" maxlength="10"></div>' +
      (HAS_CLOUD
        ? '<button type="button" class="lg-scan">' +
          ico("i-camera") +
          '掃收據</button><input type="file" class="lg-file" accept="image/*" hidden>'
        : "") +
      "</div>" +
      '<p class="lg-scanmsg" role="status" hidden></p>' +
      '<fieldset class="lg-cats"><legend class="sr">分類</legend>' +
      CATS.map(function (c) {
        return (
          '<input type="radio" name="cat" id="' +
          id +
          "-c-" +
          c.id +
          '" value="' +
          c.id +
          '"' +
          (c.id === def ? " checked" : "") +
          ">" +
          '<label for="' +
          id +
          "-c-" +
          c.id +
          '" style="--cc:var(' +
          c.c +
          ')">' +
          c.lab +
          "</label>"
        );
      }).join("") +
      "</fieldset>" +
      '<div class="lg-pay" data-split><label for="' +
      id +
      '-pay">誰付的</label><select class="lg-sel" id="' +
      id +
      '-pay" name="pay" data-people="pay"></select></div>' +
      '<div class="lg-items"></div>' +
      '<button type="button" class="lg-additem">＋ 加明細</button>' +
      '<div class="lg-rest" data-split><label class="lg-rest-lab" for="' +
      id +
      '-rest">這筆算</label><select class="lg-sel" id="' +
      id +
      '-rest" name="rest" data-people="who"></select><span class="lg-rest-amt"></span></div>' +
      '<p class="lg-hint" data-nosplit hidden>想記誰付錢、算分帳，先到<a href="#split">分帳</a>加入旅伴名單。</p>' +
      '<div class="lg-row"><label class="sr" for="' +
      id +
      '-note">備註</label>' +
      '<input class="lg-note" id="' +
      id +
      '-note" name="note" type="text" placeholder="備註，可不填" maxlength="40" autocomplete="off">' +
      '<button type="submit" class="lg-add">記一筆</button></div>' +
      '<p class="lg-err" hidden>請輸入金額，例如 1200</p>' +
      "</form>"
    );
  }

  function legDur(d, k) {
    var a = d.stops[k],
      b = d.stops[k + 1];
    return toMin(b.t) - (toMin(a.t) + (a.stay || 0));
  }

  function stopHTML(s, i, di, k) {
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
        ? "停留 " + fmt(s.stay) + "・" + hhmm(toMin(s.t) + s.stay) + " 離開"
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
      (s.must ? '<span class="must">' + ico("i-star") + "必去</span>" : "") +
      "</div>" +
      (s.sub ? '<p class="t-sub">' + s.sub + "</p>" : "") +
      (stay ? '<p class="t-stay">' + stay + "</p>" : "") +
      (s.tip ? '<p class="t-tip">' + s.tip + "</p>" : "") +
      '<div class="t-foot">' +
      (kind !== "hotel"
        ? '<a class="mini-link" href="' +
          mapUrl(s.q || s.n) +
          '" target="_blank" rel="noopener">' +
          ico("i-pin") +
          "地圖</a>"
        : "") +
      toggleHTML(di, k) +
      "</div>" +
      '<div class="ledger" id="lg' +
      di +
      "-" +
      k +
      '" data-k="' +
      k +
      '" hidden>' +
      ledgerInner(di, k, kind) +
      "</div>" +
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
    var dt = dayTotal(i);
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
          ico("i-car").replace("<svg", '<svg style="width:15px;height:15px"') +
          "開車約 " +
          fmt(drive) +
          "</span>"
        : "") +
      (musts
        ? '<span class="pill">' +
          ico("i-star").replace("<svg", '<svg style="width:14px;height:14px"') +
          "必去 " +
          musts +
          " 處</span>"
        : "") +
      '<span class="pill pill-cost" id="dayCost"' +
      (dt ? "" : " hidden") +
      ">" +
      ico("i-coin") +
      '今天花了 <span id="dayCostV">' +
      yen(dt) +
      "</span></span>" +
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
      html += stopHTML(s, n++, i, k);
      if (k < d.legs.length) html += legHTML(d, k, n++);
    });
    html += "</ol>";
    panel.innerHTML = html;
    fillPeople(panel);
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
  document.getElementById("hotels").innerHTML = HOTELS.map(function (h, i) {
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
      (h.onsen ? '<span class="onsen">' + ico("i-onsen") + "溫泉</span>" : "") +
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
  }).join("");

  /* ---------- 待辦清單 ---------- */
  var TODO = [
    {
      g: "證件與入境",
      items: [
        ["passport", "確認護照效期"],
        ["vjw", "填寫 Visit Japan Web", "入境、海關資料先填好，落地掃 QR Code"],
        ["insure", "買旅遊平安險"]
      ]
    },
    {
      g: "開車",
      items: [
        ["license", "申請台灣駕照日文譯本", "到監理站辦，和台灣駕照一起帶"],
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
  function itemHTML(id, text, sub, custom) {
    return (
      '<li><input type="checkbox" id="td-' +
      id +
      '" data-id="' +
      id +
      '"' +
      (S.done[id] ? " checked" : "") +
      ">" +
      '<label for="td-' +
      id +
      '">' +
      text +
      (sub ? "<small>" + sub + "</small>" : "") +
      "</label>" +
      (custom
        ? '<button type="button" class="del" id="tdx-' +
          id +
          '" data-del="' +
          id +
          '" aria-label="刪除「' +
          text +
          '」">刪除</button>'
        : "") +
      "</li>"
    );
  }
  function renderTodo() {
    var box = el("todoGroups"),
      a = document.activeElement;
    var keep = a && a.id && box.contains(a) ? a.id : null;
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
    var custom = S.custom.slice().sort(function (x, y) {
      return (x.t || 0) - (y.t || 0);
    });
    if (custom.length) {
      html +=
        "<div><h3>另外加的</h3><ul>" +
        custom
          .map(function (c) {
            return itemHTML(esc(c.id), esc(c.text), "", true);
          })
          .join("") +
        "</ul></div>";
    }
    box.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:16px">' +
      html +
      "</div>";
    if (keep) {
      var k = document.getElementById(keep);
      if (k) k.focus({ preventScroll: true });
    }
    updateProgress();
  }
  function allIds() {
    var ids = [];
    TODO.forEach(function (g) {
      g.items.forEach(function (it) {
        ids.push(it[0]);
      });
    });
    S.custom.forEach(function (c) {
      ids.push(c.id);
    });
    return ids;
  }
  function updateProgress() {
    var ids = allIds(),
      done = ids.filter(function (id) {
        return S.done[id];
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
    if (!DB.setTodo(t.dataset.id, t.checked)) t.checked = !t.checked;
  });
  el("todoGroups").addEventListener("click", function (e) {
    var b = e.target.closest("[data-del]");
    if (!b) return;
    if (DB.removeTodo(b.dataset.del)) el("addInput").focus();
  });
  el("addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = el("addInput"),
      v = input.value.trim();
    if (!v) {
      input.focus();
      return;
    }
    if (DB.addTodo(v.slice(0, 60))) input.value = "";
  });

  /* ---------- 提示訊息（刪除後可復原） ---------- */
  var toast = el("toast"),
    toastTimer = null,
    undoData = null;
  function showToast(msg, undo) {
    el("toastMsg").textContent = msg;
    el("toastUndo").hidden = !undo;
    undoData = undo || null;
    toast.hidden = false;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, undo ? 6000 : 4500);
  }
  function hideToast() {
    toast.hidden = true;
    undoData = null;
    clearTimeout(toastTimer);
  }
  el("toastUndo").addEventListener("click", function () {
    var u = undoData;
    if (!u) return;
    hideToast();
    DB.addExpense(u.e);
  });

  /* ---------- 資料寫入：本機或共用資料庫 ---------- */
  var Cloud = {
    fs: null,
    db: null,
    loading: null,
    unsubs: [],
    meta: {},
    failed: false,
    error: null
  };
  var rateTimer = null;
  function commitLocal() {
    store.set("hkd-local", S);
    reindex();
    emit();
    return true;
  }
  function ref(segs) {
    return Cloud.fs.doc.apply(null, [Cloud.db, "trips", tripCode].concat(segs));
  }
  function cloudOK() {
    if (Cloud.db && !Cloud.error) return true;
    showToast(
      Cloud.error
        ? "共用帳本出錯了，這筆沒有存到。"
        : Cloud.failed
          ? "連不上共用帳本，這筆沒有存到。請連上網路後再試。"
          : "正在連線共用帳本，請等幾秒再試。"
    );
    return false;
  }
  function onCloudError(err) {
    Cloud.error = err || { code: "unknown" };
    console.warn("[北海道] 同步錯誤", err);
    updateSync();
  }
  function cloudSet(segs, data, merge) {
    if (!cloudOK()) return false;
    Cloud.fs
      .setDoc(ref(segs), data, merge ? { merge: true } : {})
      .catch(onCloudError);
    return true;
  }
  function cloudDel(segs) {
    if (!cloudOK()) return false;
    Cloud.fs.deleteDoc(ref(segs)).catch(onCloudError);
    return true;
  }
  function expDoc(e) {
    return {
      key: e.key,
      amt: e.amt,
      cat: e.cat,
      note: e.note || "",
      by: e.by || "",
      t: e.t || Date.now(),
      pay: e.pay || "",
      rest: e.rest || "",
      items: cleanItems(e.items)
    };
  }
  var DB = {
    addExpense: function (e) {
      if (MODE === "local") {
        S.expenses.push(e);
        return commitLocal();
      }
      return cloudSet(["expenses", e.id], expDoc(e));
    },
    removeExpense: function (e) {
      if (MODE === "local") {
        S.expenses = S.expenses.filter(function (x) {
          return x.id !== e.id;
        });
        return commitLocal();
      }
      return cloudDel(["expenses", e.id]);
    },
    setTodo: function (id, done) {
      if (MODE === "local") {
        if (done) S.done[id] = 1;
        else delete S.done[id];
        return commitLocal();
      }
      return cloudSet(["todo", id], { done: !!done }, true);
    },
    addTodo: function (text) {
      var item = { id: "c" + uid(), text: text, t: Date.now() };
      if (MODE === "local") {
        S.custom.push(item);
        return commitLocal();
      }
      return cloudSet(["todo", item.id], {
        text: text,
        custom: true,
        done: false,
        t: item.t
      });
    },
    removeTodo: function (id) {
      if (MODE === "local") {
        S.custom = S.custom.filter(function (c) {
          return c.id !== id;
        });
        delete S.done[id];
        return commitLocal();
      }
      return cloudDel(["todo", id]);
    },
    setRate: function (v) {
      if (MODE === "local") {
        S.rate = v;
        return commitLocal();
      }
      S.rate = v;
      renderSummary();
      clearTimeout(rateTimer);
      rateTimer = setTimeout(function () {
        rateTimer = null;
        cloudSet(["meta", "settings"], { rate: v }, true);
      }, 600);
      return true;
    },
    setMembers: function (list) {
      if (MODE === "local") {
        S.members = list;
        return commitLocal();
      }
      if (!cloudSet(["meta", "settings"], { members: list }, true))
        return false;
      S.members = list;
      emit();
      return true;
    }
  };

  /* ---------- 共用資料庫連線（Firebase Firestore） ---------- */
  // 共用資料庫和收據辨識用同一個 Firebase app
  var appLoading = null;
  function loadApp() {
    if (!appLoading) {
      appLoading = import(SDK_BASE + "firebase-app.js").then(function (m) {
        return m.getApps().length ? m.getApp() : m.initializeApp(FB);
      });
      appLoading.catch(function () {
        appLoading = null;
      });
    }
    return appLoading;
  }
  function startCloud() {
    Cloud.error = null;
    Cloud.meta = {};
    updateSync();
    if (!Cloud.loading) {
      Cloud.loading = Promise.all([
        loadApp(),
        import(SDK_BASE + "firebase-firestore.js")
      ]).then(function (m) {
        var app = m[0],
          fs = m[1],
          db;
        try {
          // 離線快取：沒訊號時也能記帳，連上網路後自動上傳
          db = fs.initializeFirestore(app, {
            localCache: fs.persistentLocalCache({
              tabManager: fs.persistentMultipleTabManager()
            })
          });
        } catch (err) {
          db = fs.getFirestore(app);
        }
        Cloud.fs = fs;
        Cloud.db = db;
        Cloud.failed = false;
      });
    }
    Cloud.loading.then(
      function () {
        if (MODE === "cloud") subscribe();
      },
      function (err) {
        Cloud.failed = true;
        Cloud.loading = null;
        console.warn("[北海道] Firebase 載入失敗", err);
        updateSync();
      }
    );
  }
  function stopListen() {
    Cloud.unsubs.forEach(function (u) {
      try {
        u();
      } catch (e) {}
    });
    Cloud.unsubs = [];
  }
  function subscribe() {
    stopListen();
    var fs = Cloud.fs,
      db = Cloud.db,
      code = tripCode,
      opt = { includeMetadataChanges: true };
    function guard(fn) {
      return function (snap) {
        if (MODE !== "cloud" || code !== tripCode) return;
        fn(snap);
        reindex();
        store.set("hkd-mirror-" + code, S);
        emit();
        updateSync();
      };
    }
    Cloud.unsubs = [
      fs.onSnapshot(
        fs.collection(db, "trips", code, "expenses"),
        opt,
        guard(function (snap) {
          S.expenses = snap.docs
            .map(function (d) {
              var x = d.data() || {};
              return cleanExp({
                id: d.id,
                key: String(x.key || ""),
                amt: +x.amt || 0,
                cat: x.cat,
                note: x.note,
                by: x.by,
                t: x.t,
                pay: x.pay,
                rest: x.rest,
                items: x.items
              });
            })
            .filter(validExp);
          Cloud.meta.exp = snap.metadata;
        }),
        onCloudError
      ),
      fs.onSnapshot(
        fs.collection(db, "trips", code, "todo"),
        opt,
        guard(function (snap) {
          var done = {},
            custom = [];
          snap.docs.forEach(function (d) {
            var x = d.data() || {};
            if (x.done) done[d.id] = 1;
            if (x.custom && typeof x.text === "string")
              custom.push({ id: d.id, text: x.text, t: +x.t || 0 });
          });
          S.done = done;
          S.custom = custom;
          Cloud.meta.todo = snap.metadata;
        }),
        onCloudError
      ),
      fs.onSnapshot(
        fs.doc(db, "trips", code, "meta", "settings"),
        opt,
        guard(function (snap) {
          var x = snap.exists() ? snap.data() : null;
          if (
            !rateTimer &&
            x &&
            typeof x.rate === "number" &&
            x.rate > 0 &&
            x.rate < 10
          )
            S.rate = x.rate;
          S.members = cleanMembers(x && x.members);
          Cloud.meta.cfg = snap.metadata;
        }),
        onCloudError
      )
    ];
  }
  window.addEventListener("online", function () {
    if (MODE === "cloud" && !Cloud.db) startCloud();
    updateSync();
  });
  window.addEventListener("offline", updateSync);

  /* ---------- 同步狀態 ---------- */
  var SYNC_TXT = {
    local: "只存在這台裝置",
    connecting: "正在連線…",
    synced: "已同步",
    saving: "同步中…",
    offline: "離線中",
    "offline-pending": "離線中・有資料等著上傳",
    nosdk: "連不上同步服務",
    error: "同步出錯"
  };
  function syncState() {
    if (MODE !== "cloud") return "local";
    if (Cloud.error) return "error";
    if (!Cloud.db) return Cloud.failed ? "nosdk" : "connecting";
    var m = Cloud.meta;
    if (!m.exp || !m.todo || !m.cfg)
      return navigator.onLine === false ? "offline" : "connecting";
    var pending =
      m.exp.hasPendingWrites ||
      m.todo.hasPendingWrites ||
      m.cfg.hasPendingWrites;
    var cache = m.exp.fromCache || m.todo.fromCache || m.cfg.fromCache;
    if (navigator.onLine === false)
      return pending ? "offline-pending" : "offline";
    if (cache) return pending ? "saving" : "connecting";
    return pending ? "saving" : "synced";
  }
  function syncDetail(st) {
    if (st === "error") {
      var c = Cloud.error && Cloud.error.code;
      return c === "permission-denied"
        ? "共用資料庫拒絕存取。請到 Firebase 主控台確認 Firestore 規則已照 README 貼上並發布。"
        : "同步時發生錯誤（" +
            String(c || (Cloud.error && Cloud.error.message) || "未知") +
            "），重新整理頁面試試看。";
    }
    if (st === "nosdk")
      return "可能沒有網路。先顯示上次同步的資料，暫時不能新增，連上網路後會自動重試。";
    if (st === "offline-pending")
      return "剛記的資料先存在這台裝置，連上網路後會自動上傳。";
    if (st === "offline")
      return "目前顯示上次同步的資料。離線時照樣可以記帳，連上網路後會自動同步。";
    return "";
  }
  function updateSync() {
    var st = syncState();
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-sync]"),
      function (n) {
        n.dataset.state = st;
        n.lastElementChild.textContent = SYNC_TXT[st];
      }
    );
    var d = syncDetail(st),
      box = el("shDetail");
    box.hidden = !d;
    box.textContent = d;
  }

  /* ---------- 景點記帳互動 ---------- */
  function refreshStop(k) {
    var box = document.getElementById("lg" + current + "-" + k);
    if (!box) return;
    var list = entries(stopKey(current, k));
    var fresh = list
      .filter(function (e) {
        return !seen[e.id];
      })
      .map(function (e) {
        return e.id;
      });
    box.querySelector(".lg-list").innerHTML = listHTML(current, k);
    if (fresh.length && !reduced()) {
      Array.prototype.forEach.call(
        box.querySelectorAll(".lg-item"),
        function (li) {
          if (fresh.indexOf(li.dataset.id) >= 0) li.classList.add("new");
        }
      );
    }
    var btn = panel.querySelector(
      '.lg-toggle[aria-controls="lg' + current + "-" + k + '"]'
    );
    if (btn) {
      btn.querySelector(".lg-lab").innerHTML = toggleLabel(list);
      btn.classList.toggle("has", list.length > 0);
    }
  }
  function refreshDay() {
    DAYS[current].stops.forEach(function (s, k) {
      refreshStop(k);
    });
    var dt = dayTotal(current),
      pill = el("dayCost");
    if (pill) {
      pill.hidden = !dt;
      el("dayCostV").textContent = yen(dt);
    }
  }
  function emit() {
    refreshDay();
    fillPeople(panel);
    renderSummary();
    renderSplit();
    renderTodo();
    if (document.activeElement !== rateEl) rateEl.value = String(S.rate);
  }

  /* 金額欄：接受全形數字、逗號、¥；空白回傳 0，看不懂回傳 -1 */
  function parseYen(v) {
    var raw = String(v)
      .replace(/[０-９]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
      })
      .replace(/[,，\s¥￥円]/g, "");
    if (!raw) return 0;
    return /^\d{1,8}$/.test(raw) ? parseInt(raw, 10) : -1;
  }

  /* 明細列 */
  var itemSeq = 0;
  function itemRowHTML(it) {
    var id = "it" + ++itemSeq;
    return (
      '<div class="lg-it">' +
      '<label class="sr" for="' +
      id +
      '-n">品項</label><input class="lg-it-n" id="' +
      id +
      '-n" type="text" maxlength="30" placeholder="品項" autocomplete="off" value="' +
      esc(it.n || "") +
      '">' +
      '<div class="lg-it-amt"><span aria-hidden="true">¥</span><label class="sr" for="' +
      id +
      '-a">品項金額</label><input class="lg-it-a" id="' +
      id +
      '-a" type="text" inputmode="numeric" maxlength="9" placeholder="金額" autocomplete="off" value="' +
      (it.amt || "") +
      '"></div>' +
      '<label class="sr" for="' +
      id +
      '-w">誰買的</label><select class="lg-sel lg-it-w" id="' +
      id +
      '-w" data-people="who" data-split></select>' +
      '<button type="button" class="lg-it-del" aria-label="刪掉這項明細">' +
      ico("i-x") +
      "</button></div>"
    );
  }
  function addItems(f, list, replace) {
    var box = f.querySelector(".lg-items");
    if (replace) box.innerHTML = "";
    box.insertAdjacentHTML("beforeend", list.map(itemRowHTML).join(""));
    fillPeople(box);
    updateRest(f);
  }
  function readItems(f) {
    return Array.prototype.map.call(f.querySelectorAll(".lg-it"), function (r) {
      return {
        row: r,
        n: r.querySelector(".lg-it-n").value.trim().slice(0, 30),
        amt: parseYen(r.querySelector(".lg-it-a").value),
        who: r.querySelector(".lg-it-w").value
      };
    });
  }
  function updateRest(f) {
    var its = readItems(f),
      isum = 0;
    its.forEach(function (it) {
      if (it.amt > 0) isum += it.amt;
    });
    var amt = parseYen(f.elements.amt.value),
      rest = amt - isum,
      out = f.querySelector(".lg-rest-amt");
    f.querySelector(".lg-rest-lab").textContent = its.length
      ? "其餘的算"
      : "這筆算";
    out.textContent = !its.length
      ? ""
      : amt <= 0
        ? "金額空著就用明細合計 " + yen(isum)
        : rest < 0
          ? "明細比金額多 " + yen(-rest)
          : yen(rest);
    out.classList.toggle("bad", its.length > 0 && amt > 0 && rest < 0);
  }
  function resetForm(f) {
    f.elements.amt.value = "";
    f.elements.note.value = "";
    f.elements.rest.value = "";
    f.querySelector(".lg-items").innerHTML = "";
    f.querySelector(".lg-scanmsg").hidden = true;
    updateRest(f);
  }

  /* ---------- 收據辨識（Firebase AI Logic + Gemini） ---------- */
  var aiLoading = null;
  function loadAI() {
    if (!aiLoading) {
      aiLoading = Promise.all([
        loadApp(),
        import(SDK_BASE + "firebase-ai.js")
      ]).then(function (m) {
        var A = m[1],
          Sc = A.Schema;
        return A.getGenerativeModel(
          A.getAI(m[0], { backend: new A.GoogleAIBackend() }),
          {
            model: AI_MODEL,
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: Sc.object({
                properties: {
                  store: Sc.string(),
                  total: Sc.integer(),
                  cat: Sc.enumString({
                    enum: CATS.map(function (c) {
                      return c.id;
                    })
                  }),
                  items: Sc.array({
                    items: Sc.object({
                      properties: { n: Sc.string(), amt: Sc.integer() }
                    })
                  })
                },
                optionalProperties: ["store"]
              })
            }
          }
        );
      });
      aiLoading.catch(function () {
        aiLoading = null;
      });
    }
    return aiLoading;
  }
  var RECEIPT_PROMPT = [
    "這是一張在日本拍的收據照片。請讀出：",
    "- store：店名，照收據上的寫法。",
    "- total：實際付款的總金額，日圓整數，含稅。不要用「お預り」「お釣り」這類收付現金的數字。",
    "- items：每個購買的品項。n 是品名，翻成簡短的繁體中文，最多 15 個字；amt 是收據上印的該品項金額，日圓整數，同一品項買多個就用小計。折扣、割引請併進它所屬的品項，不要另外列。小計、稅額、合計這類列不要放進 items。",
    "- cat：從 food（餐飲）、ticket（門票）、move（交通）、shop（購物）、stay（住宿）、etc（其他）挑一個最符合的。",
    "如果照片不是收據，total 填 0，items 給空陣列。"
  ].join("\n");
  // 手機照片動輒好幾 MB，先縮小再上傳
  function shrinkImage(file) {
    return new Promise(function (ok, fail) {
      var url = URL.createObjectURL(file),
        img = new Image();
      img.onload = function () {
        var s = Math.min(
            1,
            2048 / Math.max(img.naturalWidth, img.naturalHeight)
          ),
          c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * s);
        c.height = Math.round(img.naturalHeight * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        fail(new Error("image"));
      };
      img.src = url;
    });
  }
  // 外稅、折扣會讓品項加總和合計對不上：差距在 15% 內就按比例攤到各品項
  function spread(items, total) {
    var base = sum(items),
      diff = total - base,
      acc = 0;
    if (!base || !diff || Math.abs(diff) > base * 0.15) return false;
    var out = items.map(function (it, i) {
      var d =
        i === items.length - 1
          ? diff - acc
          : Math.round((diff * it.amt) / base);
      acc += d;
      return it.amt + d;
    });
    if (
      out.some(function (v) {
        return v <= 0;
      })
    )
      return false;
    items.forEach(function (it, i) {
      it.amt = out[i];
    });
    return true;
  }
  function aiErrText(err) {
    var m =
      String((err && err.code) || "") +
      " " +
      String((err && err.message) || "");
    if (err && err.message === "image") return "這張照片打不開，換一張試試看。";
    if (err instanceof SyntaxError) return "看不懂辨識結果，請再拍一次。";
    if (/api-not-enabled|PERMISSION_DENIED|403|has not been used/i.test(m))
      return "Firebase 專案還沒開啟 AI Logic，請到 Firebase 主控台開啟後再試。";
    if (/quota|429|RESOURCE_EXHAUSTED/i.test(m))
      return "辨識次數暫時用完了，請手動輸入，或晚點再試。";
    if (/fetch|network|import|module/i.test(m))
      return "連不上辨識服務，請確認網路後再試。";
    return "辨識失敗，請再試一次，或手動輸入。";
  }
  function scanReceipt(f, file) {
    var msg = f.querySelector(".lg-scanmsg"),
      btn = f.querySelector(".lg-scan");
    function say(t, bad) {
      msg.textContent = t;
      msg.hidden = !t;
      msg.classList.toggle("bad", !!bad);
    }
    if (navigator.onLine === false) {
      say("沒有網路，沒辦法辨識收據。", true);
      return;
    }
    btn.disabled = true;
    say("正在讀收據…");
    Promise.all([loadAI(), shrinkImage(file)])
      .then(function (r) {
        return r[0].generateContent([
          RECEIPT_PROMPT,
          { inlineData: { data: r[1], mimeType: "image/jpeg" } }
        ]);
      })
      .then(function (res) {
        var x = JSON.parse(res.response.text()) || {},
          total = Math.round(+x.total) || 0,
          items = (Array.isArray(x.items) ? x.items : [])
            .map(function (it) {
              return {
                n: String((it && it.n) || "")
                  .trim()
                  .slice(0, 30),
                amt: Math.round(+(it && it.amt)) || 0
              };
            })
            .filter(function (it) {
              return it.amt > 0;
            })
            .slice(0, 40),
          spreadOK = total > 0 && spread(items, total);
        if (!total) total = sum(items);
        if (!total) {
          say("看不出金額，請手動輸入，或換一張清楚一點的照片。", true);
          return;
        }
        f.elements.amt.value = String(total);
        if (CATMAP[x.cat]) f.elements.cat.value = x.cat;
        if (!f.elements.note.value.trim() && x.store)
          f.elements.note.value = String(x.store).trim().slice(0, 40);
        addItems(f, items, true);
        f.querySelector(".lg-err").hidden = true;
        say(
          "讀到 " +
            items.length +
            " 項，合計 " +
            yen(total) +
            (spreadOK ? "，稅金和折扣已按比例分到各品項" : "") +
            "。請對一下金額" +
            (S.members.length ? "，再選每一項是誰買的。" : "。")
        );
      })
      .catch(function (err) {
        console.warn("[北海道] 收據辨識失敗", err);
        say(aiErrText(err), true);
      })
      .then(function () {
        btn.disabled = false;
      });
  }
  panel.addEventListener("click", function (e) {
    var t = e.target.closest(".lg-toggle");
    if (t) {
      var box = document.getElementById(t.getAttribute("aria-controls"));
      var open = box.hidden;
      box.hidden = !open;
      t.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && !reduced()) {
        box.classList.remove("pop");
        void box.offsetWidth;
        box.classList.add("pop");
      }
      return;
    }
    var d = e.target.closest(".lg-del");
    if (d) {
      removeEntry(+d.closest(".ledger").dataset.k, d.dataset.del);
      return;
    }
    var f = e.target.closest(".lg-form");
    if (!f) return;
    if (e.target.closest(".lg-additem")) {
      addItems(f, [{}]);
      var rows = f.querySelectorAll(".lg-it-n");
      rows[rows.length - 1].focus();
    } else if (e.target.closest(".lg-it-del")) {
      e.target.closest(".lg-it").remove();
      updateRest(f);
      f.querySelector(".lg-additem").focus();
    } else if (e.target.closest(".lg-scan")) {
      f.querySelector(".lg-file").click();
    }
  });
  panel.addEventListener("change", function (e) {
    if (!e.target.classList.contains("lg-file")) return;
    var file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (file) scanReceipt(e.target.form, file);
  });
  panel.addEventListener("submit", function (e) {
    var f = e.target.closest(".lg-form");
    if (!f) return;
    e.preventDefault();
    var amtEl = f.elements.amt,
      noteEl = f.elements.note,
      err = f.querySelector(".lg-err");
    function fail(msg, focusEl) {
      err.textContent = msg;
      err.hidden = false;
      focusEl.focus();
    }
    var items = [],
      isum = 0,
      bad = null;
    readItems(f).forEach(function (it) {
      if (it.amt > 0) {
        isum += it.amt;
        items.push({ n: it.n, amt: it.amt, who: it.who });
      } else if (it.n || it.amt < 0) bad = bad || it.row;
    });
    var amt = parseYen(amtEl.value);
    if (amt === 0 && isum) amt = isum;
    if (amt <= 0) return fail("請輸入金額，例如 1200", amtEl);
    if (bad) return fail("明細的金額要填數字", bad.querySelector(".lg-it-a"));
    if (isum > amt)
      return fail(
        "明細加起來 " + yen(isum) + "，比金額 " + yen(amt) + " 多，請再對一下",
        amtEl
      );
    err.hidden = true;
    var split = S.members.length > 0;
    var entry = {
      id: "e" + uid(),
      key: stopKey(current, +f.dataset.k),
      amt: amt,
      cat: f.elements.cat.value || "etc",
      note: noteEl.value.trim().slice(0, 40),
      by: MODE === "cloud" ? myName : "",
      t: Date.now(),
      pay: split ? f.elements.pay.value : "",
      rest: split ? f.elements.rest.value : "",
      items: items
    };
    if (DB.addExpense(entry)) resetForm(f);
  });
  panel.addEventListener("input", function (e) {
    var f = e.target.form;
    if (!f || !f.classList.contains("lg-form")) return;
    f.querySelector(".lg-err").hidden = true;
    updateRest(f);
  });
  function removeEntry(k, id) {
    var hit = null;
    entries(stopKey(current, k)).forEach(function (x) {
      if (x.id === id) hit = x;
    });
    if (!hit || !DB.removeExpense(hit)) return;
    var tg = panel.querySelector(
      '.lg-toggle[aria-controls="lg' + current + "-" + k + '"]'
    );
    if (tg) tg.focus({ preventScroll: true });
    showToast("已刪除 " + catOf(hit.cat).lab + " " + yen(+hit.amt || 0), {
      e: hit
    });
  }

  /* ---------- 旅費總覽 ---------- */
  function renderSummary() {
    var total = 0,
      n = 0,
      byCat = {},
      byDay = [];
    DAYS.forEach(function (d, di) {
      var t = 0;
      d.stops.forEach(function (s, k) {
        entries(stopKey(di, k)).forEach(function (e) {
          var a = +e.amt || 0,
            c = catOf(e.cat).id;
          t += a;
          n++;
          byCat[c] = (byCat[c] || 0) + a;
        });
      });
      byDay.push(t);
      total += t;
    });
    el("mTotal").textContent = yen(total);
    el("mCount").textContent = n ? "・共 " + n + " 筆" : "";
    el("mTwd").textContent = twd(total);
    el("mEmpty").hidden = n > 0;
    el("mBody").hidden = n === 0;
    if (!n) return;
    var cats = CATS.filter(function (c) {
      return byCat[c.id] > 0;
    }).sort(function (a, b) {
      return byCat[b.id] - byCat[a.id];
    });
    el("mStack").innerHTML = cats
      .map(function (c) {
        return (
          '<i style="--cc:var(' +
          c.c +
          ");width:" +
          ((byCat[c.id] / total) * 100).toFixed(2) +
          '%"></i>'
        );
      })
      .join("");
    el("mCats").innerHTML = cats
      .map(function (c) {
        var pct = (byCat[c.id] / total) * 100;
        return (
          '<li><span class="lg-cat" style="--cc:var(' +
          c.c +
          ')">' +
          c.lab +
          "</span><b>" +
          yen(byCat[c.id]) +
          "</b><small>" +
          (pct < 1 ? "&lt;1" : Math.round(pct)) +
          "%</small></li>"
        );
      })
      .join("");
    var max = Math.max.apply(null, byDay);
    el("mDays").innerHTML = DAYS.map(function (d, di) {
      var v = byDay[di],
        w = max ? (v / max) * 100 : 0;
      return (
        '<li><button type="button" data-day="' +
        di +
        '">' +
        '<span class="lab">' +
        d.date +
        "<small>（" +
        d.wd +
        "）</small></span>" +
        '<span class="track" aria-hidden="true"><i' +
        (v ? "" : ' class="zero"') +
        ' style="width:' +
        w.toFixed(2) +
        '%"></i></span>' +
        '<span class="amt' +
        (v ? "" : " none") +
        '">' +
        yen(v) +
        '</span><span class="sr">，看第 ' +
        (di + 1) +
        " 天行程</span></button></li>"
      );
    }).join("");
  }
  el("mDays").addEventListener("click", function (e) {
    var b = e.target.closest("[data-day]");
    if (!b) return;
    selectDay(+b.dataset.day, { animate: true });
    el("days").scrollIntoView({
      behavior: reduced() ? "auto" : "smooth"
    });
  });

  /* ---------- 分帳 ---------- */
  function allEntries() {
    var out = [];
    DAYS.forEach(function (d, di) {
      d.stops.forEach(function (s, k) {
        out = out.concat(entries(stopKey(di, k)));
      });
    });
    return out;
  }
  /* 每個人「付了多少」減「該出多少」就是差額；再讓欠錢的人依序還給該收錢的人，轉帳次數最少 */
  function settle() {
    var names = S.members.slice(),
      paid = {},
      owe = {},
      skipped = 0;
    function add(map, n, a) {
      map[n] = (map[n] || 0) + a;
      if (names.indexOf(n) < 0) names.push(n);
    }
    allEntries().forEach(function (e) {
      var payer = payerOf(e);
      if (!payer) {
        skipped++;
        return;
      }
      function give(who, a) {
        if (who !== "*") return add(owe, who || payer, a);
        var m = S.members.length ? S.members : [payer],
          each = Math.floor(a / m.length),
          extra = a - each * m.length;
        m.forEach(function (n, i) {
          add(owe, n, each + (i < extra ? 1 : 0));
        });
      }
      add(paid, payer, e.amt);
      e.items.forEach(function (it) {
        give(it.who, it.amt);
      });
      var rest = e.amt - sum(e.items);
      if (rest) give(e.rest, rest);
    });
    var cred = [],
      debt = [];
    names.forEach(function (n) {
      var b = (paid[n] || 0) - (owe[n] || 0);
      if (b > 0) cred.push({ n: n, v: b });
      else if (b < 0) debt.push({ n: n, v: -b });
    });
    function big(a, b) {
      return b.v - a.v;
    }
    cred.sort(big);
    debt.sort(big);
    var moves = [],
      i = 0,
      j = 0;
    while (i < debt.length && j < cred.length) {
      var v = Math.min(debt[i].v, cred[j].v);
      moves.push({ from: debt[i].n, to: cred[j].n, v: v });
      debt[i].v -= v;
      cred[j].v -= v;
      if (!debt[i].v) i++;
      if (!cred[j].v) j++;
    }
    return {
      names: names,
      paid: paid,
      owe: owe,
      moves: moves,
      skipped: skipped
    };
  }
  function renderSplit() {
    el("spMembers").innerHTML = S.members
      .map(function (n) {
        return (
          "<li><span>" +
          esc(n) +
          '</span><button type="button" data-name="' +
          esc(n) +
          '" aria-label="從名單移除 ' +
          esc(n) +
          '">' +
          ico("i-x") +
          "</button></li>"
        );
      })
      .join("");
    var r = settle(),
      active = r.names.filter(function (n) {
        return r.paid[n] || r.owe[n];
      });
    el("spEmpty").hidden = S.members.length > 0;
    el("spBody").hidden = !active.length;
    if (!active.length) return;
    el("spBal").innerHTML = active
      .map(function (n) {
        var b = (r.paid[n] || 0) - (r.owe[n] || 0);
        return (
          "<li><b>" +
          esc(n) +
          '</b><span class="net' +
          (b > 0 ? " pos" : b < 0 ? " neg" : "") +
          '">' +
          (b > 0 ? "該收 " + yen(b) : b < 0 ? "該付 " + yen(-b) : "剛好") +
          "</span><small>付了 " +
          yen(r.paid[n] || 0) +
          "・自己的部分 " +
          yen(r.owe[n] || 0) +
          "</small></li>"
        );
      })
      .join("");
    el("spMoves").innerHTML = r.moves.length
      ? r.moves
          .map(function (m) {
            return (
              "<li><b>" +
              esc(m.from) +
              "</b><span>給</span><b>" +
              esc(m.to) +
              '</b><span class="amt">' +
              yen(m.v) +
              "<small>約 " +
              twd(m.v) +
              "</small></span></li>"
            );
          })
          .join("")
      : '<li class="ok">大家都算清了，不用互相給錢。</li>';
    el("spSkip").hidden = !r.skipped;
    el("spSkip").textContent =
      "有 " + r.skipped + " 筆沒有填誰付的，沒有算進分帳。";
  }
  el("spAdd").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = el("spName"),
      n = cleanName(input.value),
      err = el("spErr");
    var msg = !n
      ? "請輸入名字。"
      : n === "*"
        ? "名字不能只有 *。"
        : S.members.indexOf(n) >= 0
          ? n + " 已經在名單裡了。"
          : S.members.length >= 20
            ? "名單最多 20 人。"
            : "";
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) {
      input.focus();
      return;
    }
    if (DB.setMembers(S.members.concat(n))) input.value = "";
  });
  el("spName").addEventListener("input", function () {
    el("spErr").hidden = true;
  });
  el("spMembers").addEventListener("click", function (e) {
    var b = e.target.closest("[data-name]");
    if (!b) return;
    var n = b.dataset.name;
    if (
      DB.setMembers(
        S.members.filter(function (x) {
          return x !== n;
        })
      )
    ) {
      el("spName").focus({ preventScroll: true });
      showToast("已把 " + n + " 移出名單，之前記在這個名字的帳還是照算。");
    }
  });

  var rateEl = el("rate");
  rateEl.addEventListener("input", function () {
    var v = parseFloat(rateEl.value);
    if (v > 0 && v < 10) DB.setRate(v);
  });
  rateEl.addEventListener("blur", function () {
    rateEl.value = String(S.rate);
  });

  function ledgerText() {
    var lines = ["北海道旅費記帳（2027/04/22 – 05/01）"],
      total = 0;
    DAYS.forEach(function (d, di) {
      var rows = [],
        t = 0;
      d.stops.forEach(function (s, k) {
        entries(stopKey(di, k)).forEach(function (e) {
          var a = +e.amt || 0;
          t += a;
          var payer = payerOf(e);
          rows.push(
            "・" +
              s.n +
              "｜" +
              catOf(e.cat).lab +
              " " +
              yen(a) +
              (e.note ? "（" + e.note + "）" : "") +
              (payer ? "・" + payer + (e.pay ? " 付" : "") : "")
          );
          e.items.forEach(function (it) {
            rows.push(
              "　－ " +
                (it.n || "品項") +
                " " +
                yen(it.amt) +
                "（" +
                whoLab(it.who, e) +
                "）"
            );
          });
        });
      });
      if (rows.length) {
        lines.push(
          "",
          "第 " + (di + 1) + " 天 " + d.date + "（" + d.wd + "）小計 " + yen(t)
        );
        lines = lines.concat(rows);
      }
      total += t;
    });
    lines.push(
      "",
      "總計 " + yen(total) + "，約 " + twd(total) + "（匯率 " + S.rate + "）"
    );
    var r = settle();
    if (r.moves.length) {
      lines.push("", "分帳");
      r.moves.forEach(function (m) {
        lines.push("・" + m.from + " 給 " + m.to + " " + yen(m.v));
      });
    }
    return lines.join("\n");
  }
  function copyText(text, ta, msg, okMsg, failMsg) {
    function fallback() {
      ta.value = text;
      ta.hidden = false;
      ta.focus();
      ta.select();
      msg.textContent = failMsg;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        ta.hidden = true;
        msg.textContent = okMsg;
      }, fallback);
    } else fallback();
  }
  el("mCopy").addEventListener("click", function () {
    copyText(
      ledgerText(),
      el("mCopyText"),
      el("mCopyMsg"),
      "已複製，可以貼到記事本或 LINE 備份。",
      "已經把明細列在下面，長按全選後複製。"
    );
  });

  /* ---------- 旅伴共用：建立、加入、邀請、離開 ---------- */
  function inviteLink() {
    return location.href.split("#")[0] + "#trip=" + tripCode;
  }
  function renderShare() {
    el("shNoCfg").hidden = HAS_CLOUD;
    el("shJoin").hidden = !(HAS_CLOUD && MODE === "local");
    el("shOn").hidden = MODE !== "cloud";
    el("todoSync").hidden = MODE !== "cloud";
    el("shLeaveAsk").hidden = true;
    el("shLeave").hidden = false;
    if (MODE !== "cloud") {
      el("shLink").hidden = true;
      el("shInviteMsg").textContent = "";
    }
    checkMigrate();
  }
  function checkMigrate() {
    var box = el("shMigrate");
    if (MODE !== "cloud") {
      box.hidden = true;
      return;
    }
    var L = readLocal(),
      n = L.expenses.length,
      t = Object.keys(L.done).length + L.custom.length;
    if (!(n || t) || store.get("hkd-mig-skip-" + tripCode)) {
      box.hidden = true;
      return;
    }
    el("shMigN").textContent = [n ? n + " 筆記帳" : "", t ? t + " 項清單" : ""]
      .filter(Boolean)
      .join("、");
    box.hidden = false;
  }
  function connect(code, created) {
    tripCode = code;
    MODE = "cloud";
    store.set("hkd-trip", code);
    S = normalize(store.get("hkd-mirror-" + code));
    reindex();
    emit();
    renderShare();
    startCloud();
    el("shInviteMsg").textContent = created
      ? "共用帳本建好了，按上面的按鈕把邀請連結傳給旅伴。"
      : "已加入共用帳本。";
    el("shInvite").focus({ preventScroll: true });
  }
  el("shCreate").addEventListener("click", function () {
    connect(newCode(), true);
  });
  el("shJoinForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = el("shCode").value.trim(),
      m = /trip=([a-z0-9]{24,64})/.exec(v) || /^([a-z0-9]{24,64})$/.exec(v);
    el("shJoinErr").hidden = !!m;
    if (!m) {
      el("shCode").focus();
      return;
    }
    el("shCode").value = "";
    connect(m[1], false);
  });
  el("shCode").addEventListener("input", function () {
    el("shJoinErr").hidden = true;
  });
  el("shInvite").addEventListener("click", function () {
    copyText(
      inviteLink(),
      el("shLink"),
      el("shInviteMsg"),
      "已複製邀請連結，傳給旅伴打開就能加入。",
      "長按下面的連結全選後複製。"
    );
  });
  el("myName").addEventListener("input", function () {
    myName = this.value.trim().slice(0, 12);
    store.set("hkd-name", myName);
  });
  // 填好名字就順便加進分帳名單
  el("myName").addEventListener("change", function () {
    var n = cleanName(myName);
    if (MODE === "cloud" && !Cloud.db) return;
    if (n && n !== "*" && S.members.indexOf(n) < 0 && S.members.length < 20)
      DB.setMembers(S.members.concat(n));
  });
  el("shMigYes").addEventListener("click", function () {
    if (!cloudOK()) return;
    var L = readLocal(),
      b = Cloud.fs.writeBatch(Cloud.db),
      customIds = {};
    L.expenses.slice(0, 400).forEach(function (e) {
      b.set(
        ref(["expenses", e.id]),
        expDoc({
          key: e.key,
          amt: e.amt,
          cat: catOf(e.cat).id,
          note: e.note,
          by: e.by || myName,
          t: e.t || Date.now(),
          pay: e.pay,
          rest: e.rest,
          items: e.items
        })
      );
    });
    var mem = cleanMembers(S.members.concat(L.members));
    if (mem.length > S.members.length)
      b.set(ref(["meta", "settings"]), { members: mem }, { merge: true });
    L.custom.forEach(function (c) {
      customIds[c.id] = 1;
      b.set(ref(["todo", c.id]), {
        text: c.text.slice(0, 60),
        custom: true,
        done: !!L.done[c.id],
        t: c.t || Date.now()
      });
    });
    Object.keys(L.done).forEach(function (id) {
      if (!customIds[id])
        b.set(ref(["todo", id]), { done: true }, { merge: true });
    });
    b.commit().catch(onCloudError);
    store.set("hkd-local", {
      expenses: [],
      done: {},
      custom: [],
      rate: L.rate,
      members: L.members
    });
    el("shMigrate").hidden = true;
    showToast("已把這台裝置的資料加進共用帳本。");
  });
  el("shMigNo").addEventListener("click", function () {
    store.set("hkd-mig-skip-" + tripCode, 1);
    el("shMigrate").hidden = true;
  });
  el("shLeave").addEventListener("click", function () {
    el("shLeave").hidden = true;
    el("shLeaveAsk").hidden = false;
    el("shLeaveNo").focus();
  });
  el("shLeaveNo").addEventListener("click", function () {
    el("shLeaveAsk").hidden = true;
    el("shLeave").hidden = false;
    el("shLeave").focus();
  });
  el("shLeaveYes").addEventListener("click", function () {
    stopListen();
    store.del("hkd-trip");
    tripCode = null;
    MODE = "local";
    Cloud.meta = {};
    Cloud.error = null;
    S = readLocal();
    reindex();
    emit();
    renderShare();
    updateSync();
    showToast("已離開共用帳本，現在只存在這台裝置。");
    el("shCreate").focus({ preventScroll: true });
  });

  /* ---------- 啟動 ---------- */
  el("myName").value = myName;
  rateEl.value = String(S.rate);
  el("mWarn").hidden = canSave;
  renderShare();
  renderTodo();
  renderSummary();
  renderSplit();
  updateSync();
  if (MODE === "cloud") startCloud();

  /* ---------- 選單跟著捲動 ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
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
    var navH = document.querySelector(".topbar").getBoundingClientRect().height;
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

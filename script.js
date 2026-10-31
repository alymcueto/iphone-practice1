const $ = (selector) => document.querySelector(selector);

// =====================================================
//  YOUR STORY - edit this part
// =====================================================

// ---- phone settings ----
const STORY = {
  time: "12:26",                  // fixed story time; use "" to show the real time
  date: "Wednesday, 28 October",
  passcode: "021199"
};

// ---- KakaoTalk chats ----
// "history" = messages already in the chat. "script" = what happens next, in order:
// ["in", text, time] arrives by itself, ["out", text, time] is YOUR reply (typed on the fake keyboard).
const KAKAO = [
  { name: "Wonwoo", initial: "W", color: "#8aa4d6", unread: 2,
    history: [
      ["in", "hey, are you free later?", "9:58 AM"],
      ["out", "maybe. why?", "10:02 AM"],
      ["in", "i don't remember much about last night", "10:40 AM"],
      ["in", "if i said something strange, please tell me", "10:40 AM"]
    ],
    script: [
      ["out", "it wasn't a strange thing to say.", "10:42 AM"],
      ["in", "...really?", "10:43 AM"],
      ["in", "okay. thank you for telling me", "10:43 AM"],
      ["out", "anytime.", "10:44 AM"]
    ] },
  { name: "Jihoon hyung", initial: "J", color: "#e8a0b4", unread: 1,
    history: [["in", "oy bati na kayo ni wons?", "11:42 PM"]], script: [] },
  { name: "sebong", initial: "✦", color: "#9a8fe0", unread: 1, members: 13,
    history: [
      ["in", "HANSOL ANG MGA PARCEL MO", "9:36 PM"],
      ["in", "nagluto ako chicken", "9:36 PM"],
      ["in", "channie san ka, punta ka dito kwarto", "9:37 PM"],
    ],
    script: [
      ["out", "oks hyung wait", "9:38 PM"],
    ] },
  { name: "Seokmin hyung", initial: "S", color: "#f2b36d", unread: 1,
    history: [["in", "send photos sa cam pls onid!!", "5:41 PM"]], script: [] }
];

// ---- Photos (gallery) ----
// day("date", ["file", ...]) adds photos from the images/ folder to that date.
// For a sub-folder write "gallery/photo1.jpg". Photos are grouped by date, newest day first.
const day = (date, files) => files.map(f => ({ src: "images/" + f, date }));

const GALLERY = [
  ...day("2026-10-30", ["gallery4.png", "gallery5.png"]),
  ...day("2026-10-28", ["gallery1.png", "gallery2.png"]),
  ...day("2026-10-07", ["gallery3.png"]),
  // ...day("2026-10-04", ["gallery/photo1.jpg", "gallery/photo2.jpg"]),
];

// =====================================================
//  CODE - you don't need to edit below this line
// =====================================================

const views = {
  gallery: $("#galleryView"),
  photo: $("#photoView"),
  kakaoList: $("#kakaoList"),
  kakaoChat: $("#kakaoChat"),
  lock: $("#lockView"),
  passcode: $("#passcodeView"),
  home: $("#homeView"),
};

const phone = document.querySelector(".phone");

function fitPhone() {
  if (window.innerWidth <= 600) {      // real phones: your mobile CSS takes over
    phone.style.zoom = 1;
    return;
  }
  const scale = Math.min(1, (window.innerHeight - 60) / 794);
  phone.style.zoom = scale;            // 60px leaves room for the caption
}

fitPhone();
window.addEventListener("resize", fitPhone);

// ---------- iOS-STYLE SCREEN TRANSITIONS ----------
const EASE = "cubic-bezier(.32,.72,0,1)";     // smooth ease in/out, like iOS
const APPS = ["kakaoList", "kakaoChat", "gallery", "photo"];
let currentView = "lock", cleanup = null, iconOrigin = "50% 50%";

function setOrigin(btn) {                      // remember where the tapped icon is
  const s = $("#screen").getBoundingClientRect(), r = btn.getBoundingClientRect();
  const x = (r.left + r.width / 2 - s.left) / s.width * 100;
  const y = (r.top + r.height / 2 - s.top) / s.height * 100;
  iconOrigin = x + "% " + y + "%";
}

function showView(name) {
  const to = views[name], from = views[currentView], prev = currentView;
  if (cleanup) cleanup();
  $("#screen").dataset.view = name;
  if (from === to) return;
  currentView = name;

  let kind = "fade";
  if (prev === "home" && (name === "kakaoList" || name === "gallery")) kind = "open";
  else if (APPS.includes(prev) && name === "home") kind = "close";
  else if (prev === "lock" && name === "passcode") kind = "lockup";
  else if (prev === "passcode" && name === "home") kind = "unlock";
  else if ((prev === "kakaoList" && name === "kakaoChat") || (prev === "gallery" && name === "photo")) kind = "push";
  else if ((prev === "kakaoChat" && name === "kakaoList") || (prev === "photo" && name === "gallery")) kind = "pop";

  to.classList.add("active");
  const origin = (kind === "open" || kind === "close") ? iconOrigin : "50% 50%";
  const anims = [];
  const go = (v, frames, opts) => anims.push(v.animate(frames, { duration: 420, easing: EASE, fill: "both", ...opts }));
  let top = to;

  if (kind === "open") {
    go(to, [{ transform: "scale(.14)", opacity: 0, borderRadius: "220px" }, { opacity: 1, offset: .4 }, { transform: "scale(1)", opacity: 1, borderRadius: "0px" }], { duration: 460 });
    go(from, [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.1)", opacity: 0 }], { duration: 460 });
  } else if (kind === "close") {
    top = from;
    go(from, [{ transform: "scale(1)", opacity: 1, borderRadius: "0px" }, { opacity: 1, offset: .6 }, { transform: "scale(.14)", opacity: 0, borderRadius: "220px" }], { duration: 420 });
    go(to, [{ transform: "scale(1.1)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 420 });
  } else if (kind === "lockup") {
    top = from;
    go(from, [{ transform: "none", opacity: 1 }, { transform: "translateY(-5%) scale(.96)", opacity: 0 }], { duration: 380 });
    go(to, [{ transform: "scale(1.05)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 380 });
  } else if (kind === "unlock") {
    go(to, [{ transform: "scale(1.15)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 520 });
    go(from, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
  } else if (kind === "push") {
    go(to, [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }]);
    go(from, [{ transform: "translateX(0)" }, { transform: "translateX(-28%)" }]);
  } else if (kind === "pop") {
    top = from;
    go(from, [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }]);
    go(to, [{ transform: "translateX(-28%)" }, { transform: "translateX(0)" }]);
  } else {
    go(to, [{ opacity: 0 }, { opacity: 1 }], { duration: 280 });
    go(from, [{ opacity: 1 }, { opacity: 0 }], { duration: 280 });
  }

  [to, from].forEach(v => { v.style.transformOrigin = origin; v.style.overflow = "hidden"; v.style.zIndex = v === top ? 2 : 1; });
  cleanup = () => {
    anims.forEach(a => a.cancel());
    from.classList.remove("active");
    [to, from].forEach(v => { v.style.transformOrigin = v.style.overflow = v.style.zIndex = ""; });
    cleanup = null;
  };
  Promise.all(anims.map(a => a.finished)).then(() => { if (cleanup) cleanup(); }).catch(() => {});
  if (name === "lock") playNotification();
}

// Open apps from the Home Screen.
document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => {
    const app = button.dataset.app;
    setOrigin(button);

    if (app === "Kakao") {
      renderKakaoList();
      showView("kakaoList");
      return;
    }

    if (app === "Photos") {
      renderGallery();
      showView("gallery");
      return;
    }

    // every other app is switched off for now: nothing happens when you tap it
  });
});

// Go back to the previous screen.
document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => {
    showView(button.dataset.back);
  });
});

function updateTime() {
  const real = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });
  const t = STORY.time || real;
  $("#statusTime").textContent = t;
  $("#lockTime").textContent = t;
  $("#lockDate").textContent = STORY.date;
}

updateTime();

// ---------- LOCK SCREEN: swipe up (or tap) to open ----------
let startY = null;
views.lock.addEventListener("pointerdown", e => { startY = e.clientY; });
views.lock.addEventListener("pointerup", e => {
  if (startY === null) return;
  const moved = startY - e.clientY;
  startY = null;
  if (moved > 50 || Math.abs(moved) < 8) showView("passcode");
});

// ---------- PASSCODE ----------
const LETTERS = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ" };
let entered = "";
const dots = document.querySelectorAll(".dot");

"1234567890".split("").forEach(n => {
  const key = document.createElement("button");
  key.type = "button";
  key.className = "key" + (n === "0" ? " zero" : "");
  key.innerHTML = `<span>${n}</span><small>${LETTERS[n] || ""}</small>`;
  key.addEventListener("click", () => pressKey(n));
  $("#keypad").appendChild(key);
});

function drawDots() {
  dots.forEach((d, i) => d.classList.toggle("filled", i < entered.length));
  $("#cancelCode").textContent = entered.length ? "Delete" : "Cancel";
}

function clearCode() {
  entered = "";
  drawDots();
}

function pressKey(n) {
  if (entered.length >= 6) return;
  entered += n;
  drawDots();
  if (entered.length === 6) setTimeout(checkCode, 150);
}

function checkCode() {
  if (entered === STORY.passcode) {
    clearCode();
    showView("home");
    return;
  }
  $("#dots").classList.add("shake");           // wrong code: shake, then clear
  setTimeout(() => {
    $("#dots").classList.remove("shake");
    clearCode();
  }, 450);
}

$("#cancelCode").addEventListener("click", () => {
  if (entered.length) {
    entered = entered.slice(0, -1);
    drawDots();
  } else {
    showView("lock");
  }
});

document.addEventListener("keydown", e => {   // typing on a real keyboard works too
  if (!views.passcode.classList.contains("active")) return;
  if (/^\d$/.test(e.key)) pressKey(e.key);
  if (e.key === "Backspace") { entered = entered.slice(0, -1); drawDots(); }
});

// ---------- KAKAOTALK ----------

const wait = ms => new Promise(r => setTimeout(r, ms));
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
let kChat = null, kTyped = 0;

function kBadges() {
  const total = KAKAO.reduce((n, c) => n + c.unread, 0);
  const set = (sel, fn) => { const e = $(sel); if (e) fn(e); };
  set(".kakao-icon .badge", e => { e.textContent = total; e.style.display = total ? "" : "none"; });
  set("#kTabBadge", e => { e.textContent = total; e.style.display = total ? "" : "none"; });
  set("#kUnreadTotal", e => { e.textContent = total; });
  set("#kBackCount", e => { e.textContent = total; });
}

let kFilter = "all";

function renderKakaoList() {
  const box = $("#kRows");
  box.innerHTML = "";
  KAKAO.filter(c => kFilter === "all" || c.unread > 0).forEach(c => {
    const last = c.history[c.history.length - 1];
    const row = el("button", "k-chatrow");
    row.type = "button";
    const av = el("span", "k-av", c.initial);
    av.style.background = c.color;
    const mid = el("span", "k-mid");
    const top = el("span", "k-top");
    top.appendChild(el("span", "k-nm", c.name));
    if (c.members) top.appendChild(el("span", "k-mem", c.members));
    mid.append(top, el("span", "k-pv", last[1]));
    const side = el("span", "k-side");
    side.appendChild(el("span", "k-tm", last[2] || ""));
    if (c.unread) side.appendChild(el("span", "k-un", c.unread));
    row.append(av, mid, side);
    row.addEventListener("click", () => openKakao(c));
    box.appendChild(row);
  });
  if (!box.children.length) box.appendChild(el("div", "k-empty", "No unread chats"));
  kBadges();
}

function setKFilter(f) {
  kFilter = f;
  $("#kAll").classList.toggle("on", f === "all");
  $("#kUnread").classList.toggle("on", f === "unread");
  renderKakaoList();
}
$("#kAll").addEventListener("click", () => setKFilter("all"));
$("#kUnread").addEventListener("click", () => setKFilter("unread"));

$("#kakaoComposeButton").addEventListener("click", () => {
  const name = prompt("Enter your character's name:");
  if (!name || !name.trim()) return;

  const cleanName = name.trim();

  const chat = {
    name: cleanName,
    initial: cleanName.charAt(0).toUpperCase(),
    color: "#9a8fe0",
    unread: 0,
    history: [["in", "hey!", "now"]],
    script: []
  };

  KAKAO.unshift(chat);
  renderKakaoList();
  openKakao(chat);
});

function kRender(m, prev) {
  const out = m[0] === "out";
  const row = el("div", "k-row " + m[0]);
  const line = el("div", "k-line");
  const bubble = el("div", "k-b", m[1]);
  const time = el("span", "k-time", m[2] || "");
  if (out) {
    line.append(time, bubble);
    row.appendChild(line);
  } else {
    const first = !prev || prev[0] !== "in";
    const av = el("div", "k-av" + (first ? "" : " ghost"), kChat.initial);
    av.style.background = kChat.color;
    const col = el("div", "k-col");
    if (first) col.appendChild(el("span", "k-who", kChat.name));
    line.append(bubble, time);
    col.appendChild(line);
    row.append(av, col);
  }
  $("#kMsgs").appendChild(row);
  $("#kMsgs").scrollTop = $("#kMsgs").scrollHeight;
}

function openKakao(chat) {
  kChat = chat;
  kTyped = 0;
  chat.unread = 0;
  kBadges();
  $("#kName").textContent = chat.name;
  $("#kMsgs").innerHTML = "";
  $("#kMsgs").appendChild(el("div", "k-date", STORY.date));
  chat.history.forEach((m, i) => kRender(m, chat.history[i - 1]));
  views.kakaoChat.classList.remove("kb");
  drawKField();
  showView("kakaoChat");
  playKakao();
}

function kReply() {
  const next = kChat && kChat.script[0];
  return next && next[0] === "out" ? next : null;
}

function drawKField() {
  const r = kReply();
  const f = $("#kField");
  const typing = !!(r && kTyped);
  f.textContent = typing ? r[1].slice(0, kTyped) : "Enter message";
  f.classList.toggle("has", typing);
}

function kType() {                      // every key tap types 2 more letters of your scripted reply
  const r = kReply();
  if (!r) return;
  kTyped = Math.min(r[1].length, kTyped + 2);
  drawKField();
}

function kSend() {
  const r = kReply();
  if (!r || !kTyped) return;
  kChat.script.shift();
  kChat.history.push(r);
  kRender(r, kChat.history[kChat.history.length - 2]);
  kTyped = 0;
  drawKField();
  playKakao();
}

async function playKakao() {            // plays the next incoming messages, one by one
  const chat = kChat;
  while (chat.script[0] && chat.script[0][0] === "in") {
    await wait(1100);
    if (kChat !== chat || !views.kakaoChat.classList.contains("active")) return;
    const m = chat.script.shift();
    chat.history.push(m);
    kRender(m, chat.history[chat.history.length - 2]);
  }
}

["qwertyuiop", "asdfghjkl", "zxcvbnm"].forEach(letters => {
  const row = el("div", "k-krow");
  letters.split("").forEach(ch => {
    const k = el("button", "k-key", ch);
    k.type = "button";
    k.addEventListener("click", kType);
    row.appendChild(k);
  });
  $("#kKeys").appendChild(row);
});
const kBottom = el("div", "k-krow");
const kSpace = el("button", "k-key wide", "space");
const kReturn = el("button", "k-key wide", "return");
kReturn.style.flex = "2";
kSpace.addEventListener("click", kType);
kReturn.addEventListener("click", kSend);
kBottom.append(kSpace, kReturn);
$("#kKeys").appendChild(kBottom);

$("#kField").addEventListener("click", () => {
  views.kakaoChat.classList.add("kb");
  setTimeout(() => { $("#kMsgs").scrollTop = $("#kMsgs").scrollHeight; }, 320);
});
$("#kMsgs").addEventListener("click", () => views.kakaoChat.classList.remove("kb"));
$("#kSend").addEventListener("click", kSend);
$("#kBack").addEventListener("click", renderKakaoList);

renderKakaoList();

// ---------- PHOTOS (GALLERY) ----------

function dayLabel(iso) {                       // "2026-10-28" -> "Wednesday, 28 October"
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const wd = dt.toLocaleDateString("en-US", { weekday: "long" });
  const md = dt.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return wd + ", " + md + (y !== 2026 ? " " + y : "");
}

function renderGallery() {
  const grid = $("#gGrid");
  grid.innerHTML = "";
  [...new Set(GALLERY.map(p => p.date))].sort().reverse().forEach(date => {
    grid.appendChild(el("div", "g-day", dayLabel(date)));
    GALLERY.filter(p => p.date === date).forEach(p => {
      const cell = el("button", "g-cell");
      cell.type = "button";
      const img = el("img");
      img.src = p.src;
      img.alt = "";
      img.onerror = () => cell.classList.add("missing");   // wrong file name -> grey square
      cell.appendChild(img);
      cell.addEventListener("click", () => {
        if (cell.classList.contains("missing")) return;
        $("#gImg").src = p.src;
        $("#gDate").textContent = dayLabel(p.date);
        showView("photo");
      });
      grid.appendChild(cell);
    });
  });
  grid.appendChild(el("div", "g-count", GALLERY.length + " Photos"));
}

// Click the bar at the bottom of any app to go back to the home screen (like swiping up).
document.querySelectorAll(".dark-indicator").forEach(bar => {
  bar.addEventListener("click", () => showView("home"));
});

function playNotification() {                 // notifications slide in one after the other
  document.querySelectorAll(".notification").forEach((n, i) => {
    n.classList.remove("in");
    n.style.setProperty("--delay", (0.6 + i * 0.3) + "s");
    void n.offsetWidth;
    n.classList.add("in");
  });
}
playNotification();


const $ = (selector) => document.querySelector(selector);

const views = {
  gallery: $("#galleryView"),
  photo: $("#photoView"),
  kakaoList: $("#kakaoList"),
  kakaoChat: $("#kakaoChat"),
  lock: $("#lockView"),
  passcode: $("#passcodeView"),
  home: $("#homeView"),
  messages: $("#messagesView"),
  chat: $("#chatView"),
  other: $("#otherView")
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

const people = [
  {
    name: "Chan",
    initial: "C",
    color: "",
    time: "now",
    preview: "you: okay, see you later!",
    messages: [
      ["in", "are you home yet?"],
      ["out", "not yet, why?"],
      ["in", "nothing. just wanted to hear from you lol"],
      ["out", "you could've just said that 😭"],
      ["in", "okay, i wanted to hear from you. happy?"],
      ["out", "a little."]
    ]
  },
  {
    name: "Wonwoo",
    initial: "W",
    color: "pink",
    time: "9:18 AM",
    preview: "don't forget to eat, okay?",
    messages: [
      ["in", "good morning"],
      ["in", "don't forget to eat, okay?"],
      ["out", "you sound like my mom"],
      ["in", "your mom has good advice"]
    ]
  },
  {
    name: "The Problem Children",
    initial: "✦",
    color: "purple",
    time: "Yesterday",
    preview: "WHO SENT THAT SCREENSHOT",
    messages: [
      ["in", "guys"],
      ["in", "WHO SENT THAT SCREENSHOT"],
      ["out", "what screenshot"],
      ["in", "do not act innocent 😭"]
    ]
  },
  {
    name: "Mika",
    initial: "M",
    color: "orange",
    time: "Tuesday",
    preview: "send me the pictures pls!!",
    messages: [
      ["in", "send me the pictures pls!!"],
      ["out", "wait im choosing the least embarrassing ones"],
      ["in", "so none?"]
    ]
  }
];

let activePerson = people[0];

function showView(viewName) {
  Object.values(views).forEach(view => {
    view.classList.remove("active");
  });

  views[viewName].classList.add("active");
  $("#screen").dataset.view = viewName;
}

function renderConversations() {
  const list = $("#conversationList");
  list.innerHTML = "";

  people.forEach(person => {
    const row = document.createElement("button");
    row.className = "conversation";

    row.innerHTML = `
      <span class="avatar ${person.color}">
        ${person.initial}
      </span>

      <span class="conversation-copy">
        <span class="conversation-top">
          <span class="conversation-name"></span>
          <span class="conversation-time"></span>
        </span>
        <span class="conversation-preview"></span>
      </span>
    `;

    // Use textContent for contact information.
    row.querySelector(".conversation-name").textContent =
      person.name;

    row.querySelector(".conversation-time").textContent =
      person.time;

    row.querySelector(".conversation-preview").textContent =
      person.preview;

    row.addEventListener("click", () => openChat(person));

    list.appendChild(row);
  });
}

function openChat(person) {
  activePerson = person;

  $("#contactName").textContent = person.name;
  $("#contactAvatar").textContent = person.initial;
  $("#contactAvatar").className =
    "contact-avatar " + person.color;

  $("#chatMessages").innerHTML = "";

  person.messages.forEach(message => {
    addBubble(message[0], message[1], false);
  });

  showView("chat");
  scrollChat();
}

function addBubble(direction, message, shouldScroll = true) {
  const row = document.createElement("div");
  row.className =
    "bubble-row " +
    (direction === "out" ? "outgoing" : "incoming");

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = message;

  row.appendChild(bubble);
  $("#chatMessages").appendChild(row);

  if (shouldScroll) {
    scrollChat();
  }
}

function scrollChat() {
  const chat = $("#chatMessages");
  chat.scrollTop = chat.scrollHeight;
}

// Open apps from the Home Screen.
document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => {
    const app = button.dataset.app;

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

    if (app === "Messages") {
      renderConversations();
      showView("messages");
      return;
    }

    openOtherApp(app);
  });
});

// Go back to the previous screen.
document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => {
    showView(button.dataset.back);
  });
});

// Make the other app icons interactive too.
function openOtherApp(app) {
  $("#otherTitle").textContent = app;

  const content = $("#otherContent");
  content.innerHTML = "";

  const card = document.createElement("div");
  card.className = "demo-card";

  const title = document.createElement("h3");
  title.textContent = app;

  const description = document.createElement("p");

  const descriptions = {
    Instagram:
      "Your fictional feed. Add posts, captions, likes, and comments here.",
    Photos:
      "Your camera roll, screenshots, and character memories.",
    Notes:
      "Things to remember: reply to Chan, finish the chapter, buy iced coffee.",
    Calendar:
      "Wednesday, October 28. No events today. For once, breathe.",
    Clock:
      "World Clock · Manila",
    Weather:
      "Cloudy · 28°C",
    Settings:
      "Apple Account · Wi-Fi · Bluetooth · Wallpaper",
    Phone:
      "Favourites · Chan · Recent calls",
    Safari:
      "Your fictional browser start page."
  };

  description.textContent =
    descriptions[app] || "This app is a work in progress.";

  card.append(title, description);
  content.appendChild(card);

  showView("other");
}

// Show the send button only when text is entered.
$("#messageInput").addEventListener("input", () => {
  const hasText = $("#messageInput").value.trim().length > 0;

  $(".send-button").classList.toggle("visible", hasText);
});

// Send a message.
$("#messageForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = $("#messageInput");
  const message = input.value.trim();

  if (!message) return;

  addBubble("out", message);

  activePerson.messages.push(["out", message]);
  activePerson.preview = "you: " + message;
  activePerson.time = "now";

  input.value = "";
  $(".send-button").classList.remove("visible");

  renderConversations();

  // Demo reply, not a real AI or another person's phone.
  const currentPerson = activePerson;

  setTimeout(() => {
    if (activePerson !== currentPerson) return;

    let reply = "HAHAHA okay, noted.";

    if (/^(hi|hello|hey)\b/i.test(message)) {
      reply = "hi 😭 what's up?";
    } else if (/good night/i.test(message)) {
      reply = "good night. text me when you wake up :)";
    } else if (/\?$/.test(message)) {
      reply = "hmm, let me think about that.";
    }

    addBubble("in", reply);

    currentPerson.messages.push(["in", reply]);
    currentPerson.preview = reply;
    currentPerson.time = "now";

    renderConversations();
  }, 900);
});

// Create a new conversation.
$("#composeButton").addEventListener("click", () => {
  const name = prompt("Enter your character's name:");

  if (!name || !name.trim()) return;

  const cleanName = name.trim();

  const person = {
    name: cleanName,
    initial: cleanName.charAt(0).toUpperCase(),
    color: "purple",
    time: "now",
    preview: "iMessage",
    messages: [
      ["in", "hey!"]
    ]
  };

  people.unshift(person);

  renderConversations();
  openChat(person);
});

// Display the current time in the status bar.
// ---------- STORY SETTINGS (edit these!) ----------
const STORY = {
  time: "12:26",                  // fixed story time; use "" to show the real time
  date: "Wednesday, 28 October",
  passcode: "021199"
};

function updateTime() {
  const real = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });
  const t = STORY.time || real;
  $("#statusTime").textContent = t;
  $("#lockTime").textContent = t;
  $("#lockDate").textContent = STORY.date;
}

updateTime();
renderConversations();

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
// "history" = messages already in the chat. "script" = what happens next, in order:
// ["in", text, time] arrives by itself, ["out", text, time] is YOUR reply (typed on the fake keyboard).
const KAKAO = [
  { name: "Chan", initial: "C", color: "#8aa4d6", unread: 2,
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
  { name: "Wonwoo", initial: "W", color: "#e8a0b4", unread: 1,
    history: [["in", "don't forget to eat, okay?", "11:42 PM"]], script: [] },
  { name: "The Problem Children", initial: "✦", color: "#9a8fe0", unread: 36,
    history: [["in", "WHO SENT THAT SCREENSHOT", "9:36 PM"]], script: [] },
  { name: "Mika", initial: "M", color: "#f2b36d", unread: 3,
    history: [["in", "send me the pictures pls!!", "5:41 PM"]], script: [] }
];

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
  const badge = $(".kakao-icon .badge");
  badge.textContent = total;
  badge.style.display = total ? "" : "none";
  $("#kUnreadTotal").textContent = total;
  $("#kBackCount").textContent = total;
}

function renderKakaoList() {
  const box = $("#kRows");
  box.innerHTML = "";
  KAKAO.forEach(c => {
    const last = c.history[c.history.length - 1];
    const row = el("button", "k-chatrow");
    row.type = "button";
    const av = el("span", "k-av", c.initial);
    av.style.background = c.color;
    const mid = el("span", "k-mid");
    mid.append(el("span", "k-nm", c.name), el("span", "k-pv", last[1]));
    const side = el("span", "k-side", last[2]);
    if (c.unread) side.append(el("span", "k-un", c.unread));
    row.append(av, mid, side);
    row.addEventListener("click", () => openKakao(c));
    box.appendChild(row);
  });
  kBadges();
}

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
// Put your pictures in the images/ folder, then list them here (newest first).
const GALLERY = [
  { src: "images/wallpaper-1.jpg", date: "Wednesday, October 28" },
  { src: "images/wallpaper1.jpg", date: "Sunday, October 4" },
  // { src: "images/my-photo.jpg", date: "Friday, October 2" },
];

function renderGallery() {
  const grid = $("#gGrid");
  grid.innerHTML = "";
  GALLERY.forEach(p => {
    const cell = el("button", "g-cell");
    cell.type = "button";
    const img = el("img");
    img.src = p.src;
    img.alt = "";
    cell.appendChild(img);
    cell.addEventListener("click", () => {
      $("#gImg").src = p.src;
      $("#gDate").textContent = p.date;
      showView("photo");
    });
    grid.appendChild(cell);
  });
  grid.appendChild(el("div", "g-count", GALLERY.length + " Photos"));
}

// Click the bar at the bottom of any app to go back to the home screen (like swiping up).
document.querySelectorAll(".dark-indicator").forEach(bar => {
  bar.addEventListener("click", () => showView("home"));
});

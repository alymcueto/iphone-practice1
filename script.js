
const $ = (selector) => document.querySelector(selector);

const views = {
  home: $("#homeView"),
  messages: $("#messagesView"),
  chat: $("#chatView"),
  other: $("#otherView")
};

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
function updateTime() {
  $("#statusTime").textContent =
    new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: false
    });
}

updateTime();
renderConversations();

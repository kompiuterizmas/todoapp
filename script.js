let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
let storeId = 0;

const calendar = document.getElementById("calendar");
const newEvent = document.getElementById("newEvent");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventDateInput = document.getElementById("eventDateInput");
const eventStartInput = document.getElementById("eventStartInput");
const eventEndInput = document.getElementById("eventEndInput");
const eventTypeInput = document.getElementById("eventTypeInput");
const eventDescriptionInput = document.getElementById("eventDescriptionInput");
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getEvent(id){
  currentEvent = events.filter(e => {return e.id === id});
  storeId = currentEvent[0].id;
  // console.log('reikia sito '+storeId);
return currentEvent;
}

function initForm(date) {
  clicked = date;
    eventDateInput.value = clicked;
}

function editForm(id){
  currentEvent = getEvent(id);
  storeId = id;

  eventTitleInput.value = currentEvent[0].title;
  eventDateInput.value = currentEvent[0].date;
  eventStartInput.value = currentEvent[0].start;
  eventEndInput.value = currentEvent[0].end;
  eventTypeInput.value = currentEvent[0].type;
  eventDescriptionInput.value = currentEvent[0].description;
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      const eventsForDay = events.filter(e => {return e.date === dayString});

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventsForDay.length > 0){
      eventsForDay.forEach(e => {
        const eventDiv = document.createElement("div");
        eventDiv.addEventListener("click", () => editForm(e.id));
        if (e.type === 'meeting'){
          eventDiv.classList.add("event", "green");
        }else
        if (e.type === 'call'){
          eventDiv.classList.add("event", "yello");
        }else
        if (e.type === 'out of office'){
          eventDiv.classList.add("event", "red");
        }
        eventDiv.innerText = e.title;
        daySquare.appendChild(eventDiv);
      });
        
      }

      daySquare.addEventListener("click", () => initForm(dayString));
    } else {
      daySquare.classList.add("padding");
    }
    calendar.appendChild(daySquare);
  }
}

function validate(a, b, c, d, e) {
  if (a && a.length < 50) {
    eventTitleInput.classList.remove("error");
    return a;
  } else {
    eventTitleInput.classList.add("error");
    window.alert("Please enter task title! It must be shorter than 50 symbols");
  }
  if (b) {
    eventDateInput.classList.remove("error");
    return b;
  } else {
    eventDateInput.classList.add("error");
    window.alert("Please select day in calendar!");
  }
  if (c) {
    eventStartInput.classList.remove("error");
    return c;
  } else {
    eventStartInput.classList.add("error");
    window.alert("Please enter start time!");
  }
  if (d && d > c) {
    eventEndInput.classList.remove("error");
    return d;
  } else {
    eventEndInput.classList.add("error");
    window.alert(
      "Please enter end time! It can not be earlier then start time."
    );
  }
  if (e) {
    eventTypeInput.classList.remove("error");
  } else {
    eventTypeInput.classList.add("error");
    window.alert("Please select event type!");
  }
}

function clearForm() {
  eventTitleInput.classList.remove("error");
  eventDateInput.classList.remove("error");
  eventStartInput.classList.remove("error");
  eventEndInput.classList.remove("error");
  eventTypeInput.classList.remove("error");
  eventTitleInput.value = "";
  eventDateInput.value = "";
  eventStartInput.value = "";
  eventEndInput.value = "";
  eventTypeInput.value = "";
  eventDescriptionInput.value = "";
  clicked = null;
  load();
}

function createEvent() {
  if (
    validate(
      eventTitleInput.value,
      eventDateInput.value,
      eventStartInput.value,
      eventEndInput.value,
      eventTypeInput.value
    )
  ) {
    events.push({
      id: Date.now(),
      date: clicked,
      title: eventTitleInput.value,
      date: eventDateInput.value,
      start: eventStartInput.value,
      end: eventEndInput.value,
      type: eventTypeInput.value,
      description: eventDescriptionInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));

    clearForm();
  }
}

function updateEvent() {
  if (
    validate(
      eventTitleInput.value,
      eventDateInput.value,
      eventStartInput.value,
      eventEndInput.value,
      eventTypeInput.value
    )
  ) 
  currentEvent = getEvent(storeId);
      (currentEvent[0].date = clicked),
      (currentEvent[0].title = eventTitleInput.value),
      (currentEvent[0].start = eventStartInput.value),
      (currentEvent[0].end = eventEndInput.value),
      (currentEvent[0].type = eventTypeInput.value),
      (currentEvent[0].description = eventDescriptionInput.value),
      localStorage.setItem("events", JSON.stringify(events));

    clearForm();
}

function deleteEvent() {
  events = events.filter(e => e.id !== storeId)
  localStorage.setItem('events', JSON.stringify(events));
  clearForm();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("createButton").addEventListener("click", createEvent);

  document.getElementById("updateButton").addEventListener("click", updateEvent);

  document.getElementById("deleteButton").addEventListener("click", deleteEvent);

  document.getElementById("cancelButton").addEventListener("click", clearForm);
}

initButtons();
load();
document.addEventListener("DOMContentLoaded", function () {
  // Initial slot data
  const defaultSlots = [
    {
      time: "2:00 PM",
      available: 3,
      meetingLink: "https://meet.google.com/syj-gsmp-rco",
    },
    {
      time: "2:30 PM",
      available: 4,
      meetingLink: "https://meet.google.com/syj-gsmp-rco",
    },
    {
      time: "3:00 PM",
      available: 3,
      meetingLink: "https://meet.google.com/syj-gsmp-rco",
    },
    {
      time: "3:30 PM",
      available: 4,
      meetingLink: "https://meet.google.com/syj-gsmp-rco",
    },
  ];

  const slotsContainer = document.getElementById("slots");
  const bookingModal = new bootstrap.Modal(
    document.getElementById("bookingModal")
  );
  const scheduledMeetingsContainer =
    document.getElementById("scheduledMeetings");
  let scheduledMeetings = JSON.parse(
    localStorage.getItem("scheduledMeetings") || "[]"
  ); // Load from Local Storage
  let slots = JSON.parse(
    localStorage.getItem("slots") || JSON.stringify(defaultSlots)
  ); // Load from Local Storage
  let selectedSlotIndex = null;

  // Function to render the slots
  function renderSlots() {
    slotsContainer.innerHTML = "";
    slots.forEach((slot, index) => {
      const slotButton = document.createElement("button");
      slotButton.classList.add("btn", "btn-outline-primary", "slot-btn");
      slotButton.innerHTML = `${slot.time} <br><span class="availability-text">${slot.available} Available</span>`;
      slotButton.disabled = slot.available === 0;

      slotButton.addEventListener("click", () => {
        selectedSlotIndex = index;
        document.getElementById(
          "selectedSlot"
        ).innerHTML = `Selected Slot: ${slot.time}`;
        bookingModal.show();
      });

      slotsContainer.appendChild(slotButton);
    });
  }

  // Function to render the scheduled meetings
  function renderScheduledMeetings() {
    scheduledMeetingsContainer.innerHTML = "";

    scheduledMeetings.forEach((meeting, index) => {
      const meetingCard = document.createElement("div");
      meetingCard.classList.add("card", "p-3", "mb-3");
      meetingCard.innerHTML = `
                <h5>Hi ${meeting.name},</h5>
                <p>Please join the meeting via this link: <a href="${meeting.slot.meetingLink}" target="_blank">${meeting.slot.meetingLink}</a> at ${meeting.slot.time}.</p>
                <button class="btn btn-danger " data-index="${index}">Cancel</button>
            `;

      // Add cancel event listener to the cancel button
      meetingCard
        .querySelector("button")
        .addEventListener("click", function () {
          const meetingIndex = this.getAttribute("data-index");
          cancelMeeting(meetingIndex);
        });

      scheduledMeetingsContainer.appendChild(meetingCard);
    });
  }

  // cancel meeting handler
  function cancelMeeting(index) {
    const canceledMeeting = scheduledMeetings[index];
    slots[canceledMeeting.slotIndex].available++;
    scheduledMeetings.splice(index, 1);

    // Update Local Storage
    localStorage.setItem("slots", JSON.stringify(slots));
    localStorage.setItem(
      "scheduledMeetings",
      JSON.stringify(scheduledMeetings)
    );

    renderSlots();
    renderScheduledMeetings();
  }

  const bookingForm = document.getElementById("bookingForm");
  // event listener to the booking form
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;

    if (selectedSlotIndex !== null && slots[selectedSlotIndex].available > 0) {
      slots[selectedSlotIndex].available--;

      // Add the booked meeting to the scheduledMeetings array
      scheduledMeetings.push({
        name: name,
        slot: slots[selectedSlotIndex],
        slotIndex: selectedSlotIndex,
      });

      // Update Local Storage
      localStorage.setItem("slots", JSON.stringify(slots));
      localStorage.setItem(
        "scheduledMeetings",
        JSON.stringify(scheduledMeetings)
      );

      renderSlots();
      renderScheduledMeetings();

      bookingModal.hide();
    }
  });

  // Initial rendering of the slots and scheduled meetings
  renderSlots();
  renderScheduledMeetings();
});

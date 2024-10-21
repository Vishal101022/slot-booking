document.addEventListener("DOMContentLoaded", function () {
  const slotsContainer = document.getElementById("slots");
  const bookingModal = new bootstrap.Modal(
    document.getElementById("bookingModal")
  );
  const scheduledMeetingsContainer =
    document.getElementById("scheduledMeetings");
  let selectedSlotId = null;

  // get slots api
  async function fetchSlots() {
    console.log("inside fetchSlots");
    try {
      const response = await axios.get("http://localhost:3000/slots");
      return response.data;
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  }

  // Render available slots
  async function renderSlots() {
    const slots = await fetchSlots();
    slotsContainer.innerHTML = "";

    slots.forEach((slot) => {
      const slotButton = document.createElement("button");
      slotButton.classList.add("btn", "btn-outline-primary", "slot-btn");
      slotButton.innerHTML = `${slot.time} <br><span class="availability-text">${slot.available} Available</span>`;
      slotButton.disabled = slot.available === 0;

      slotButton.addEventListener("click", () => {
        // Store selected slot ID
        selectedSlotId = slot.id;
        document.getElementById(
          "selectedSlot"
        ).innerHTML = `Selected Slot: ${slot.time}`;
        bookingModal.show();
      });

      slotsContainer.appendChild(slotButton);
    });
  }

  // get meetings api
  async function fetchMeetings() {
    try {
      const response = await axios.get(
        "http://localhost:3000/scheduledMeetings"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  }

  // Render scheduled meetings
  async function renderScheduledMeetings() {
    const meetings = await fetchMeetings();
    scheduledMeetingsContainer.innerHTML = "";

    meetings.forEach((meeting) => {
      const meetingCard = document.createElement("div");
      meetingCard.classList.add("card", "p-3", "mb-3");
      meetingCard.innerHTML = `
        <h5>Hi ${meeting.name},</h5>
        <p>Please join the meeting via this link: <a href="${meeting.meetingLink}" target="_blank">${meeting.meetingLink}</a> at ${meeting.time}.</p>
        <button class="btn btn-danger" data-id="${meeting.id}" data-slot-id="${meeting.slot_id}">Cancel</button>
      `;

      // Add cancel event listener
      meetingCard
        .querySelector("button")
        .addEventListener("click", async function () {
          const meetingId = this.getAttribute("data-id");
          const slotId = this.getAttribute("data-slot-id");
          await cancelMeeting(meetingId, slotId);
        });

      scheduledMeetingsContainer.appendChild(meetingCard);
    });
  }

  // Handle booking form submission
  const bookingForm = document.getElementById("bookingForm");
  bookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;

    if (selectedSlotId !== null) {
      await bookSlot(name, selectedSlotId);
    }
  });

  // post slot api
  async function bookSlot(name, slotId) {
    console.log("inside bookSlot");
    try {
      const response = await axios.post("http://localhost:3000/slots", {
        name,
        slotId,
      });

      renderSlots();
      renderScheduledMeetings();
      bookingModal.hide();
      console.log(response.data);
    } catch (error) {
      console.error("Error booking slot:", error);
    }
  }

  // Cancel  meeting api
  async function cancelMeeting(meetingId, slotId) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/scheduledMeetings/${meetingId}/${slotId}`
      );
        renderSlots();
        renderScheduledMeetings();
        console.log(response.data);
    } catch (error) {
      console.error("Error canceling meeting:", error);
    }
  }
  // Initial rendering
  renderSlots();
  renderScheduledMeetings();
});

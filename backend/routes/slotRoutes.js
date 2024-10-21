const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slotController");

router.get("/slots", slotController.getSlots);
router.post("/slots", slotController.postSlot);
router.get("/scheduledMeetings", slotController.getScheduledMeetings);
router.delete("/scheduledMeetings/:meetingId/:slotId", slotController.deleteMeeting);

module.exports = router;
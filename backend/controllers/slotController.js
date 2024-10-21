const slotModel = require("../models/slotModel");

exports.getSlots = async (req, res) => {
  try {
    const result = await slotModel.getSlots();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.postSlot = async (req, res) => {
  try {
    const result = await slotModel.postSlot(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getScheduledMeetings = async (req, res) => {
  try {
    const result = await slotModel.getScheduledMeetings();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    await slotModel.deleteMeeting(
      req.params.meetingId,
      req.params.slotId
    );
    return res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

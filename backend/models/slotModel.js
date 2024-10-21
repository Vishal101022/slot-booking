const db = require("../util/db");

// get all slots
exports.getSlots = async () => {
  try {
    const [result] = await db.query(
      "select id, time, available, meetingLink from slots"
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// update slot and schedule meeting
exports.postSlot = async (data) => {
  const { name, slotId } = data;

  try {
    const [result] = await db.query(
      "update slots set available = available - 1 where id = ? and available >= 0",
      [slotId]
    );
    if (result.affectedRows > 0) {
      await db.query("insert into meetings (name, slot_id) values (?, ?)", [
        name,
        slotId,
      ]);
    }
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// get all scheduled meetings
exports.getScheduledMeetings = async () => {
  try {
    const [result] = await db.query(
      "SELECT meetings.id, meetings.name, slots.time, slots.id as slot_id ,slots.meetingLink FROM meetings JOIN slots ON meetings.slot_id = slots.id"
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// cancel scheduled meeting
exports.deleteMeeting = async (meetingId, slotId) => {
  try {
    const response = await db.query("DELETE FROM meetings WHERE id = ?", [
      meetingId,
    ]);
    await db.query("update slots set available = available + 1 where id = ?", [
      slotId,
    ]);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

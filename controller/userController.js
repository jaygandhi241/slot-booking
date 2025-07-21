const Availability = require('../models/Availability');

const addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const today = new Date();
    today.setHours(0,0,0,0);
    const inputDate = new Date(date);
    inputDate.setHours(0,0,0,0);
    const diffDays = (inputDate - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0 || diffDays > 7) {
      return res.status(400).json({ message: 'Date must be today or within 7 days ahead.' });
    }

    const timeRegex = /^([0-1]?\d|2[0-3]):[0-5]\d$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: 'Time must be in HH:mm format.' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ message: 'Start time must be before end time.' });
    }

    const availability = new Availability({
      userId: req.user._id,
      date: inputDate,
      startTime,
      endTime
    });

    await availability.save();
    res.status(201).json({ message: 'Availability added', availability });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addAvailability }; 
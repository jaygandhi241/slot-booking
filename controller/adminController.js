const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { getSlots } = require('../utils/slots');

const getSlotsForUser = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    const inputDate = new Date(date);
    inputDate.setHours(0,0,0,0);
    const availabilities = await Availability.find({ date: inputDate }).populate('userId', 'name email');
    const bookings = await Booking.find({ date: inputDate });
    const bookedMap = {};
    bookings.forEach(b => {
      if (!bookedMap[b.userId]) bookedMap[b.userId] = [];
      const [bh, bm] = b.startTime.split(':').map(Number);
      const bookedStart = bh * 60 + bm;
      [-30, 0, 30].forEach(offset => {
        const slotStart = bookedStart + offset;
        if (slotStart >= 0 && slotStart + 30 <= 24*60) {
          bookedMap[b.userId].push({
            start: `${String(Math.floor(slotStart/60)).padStart(2,'0')}:${String(slotStart%60).padStart(2,'0')}`
          });
        }
      });
    });
    const result = availabilities.map(av => {
      let slots = getSlots(av.startTime, av.endTime);
      if (bookedMap[av.userId._id]) {
        slots = slots.filter(slot =>
          !bookedMap[av.userId._id].some(b => b.start === slot.start)
        );
      }
      return {
        user: { id: av.userId._id, name: av.userId.name, email: av.userId.email },
        date: av.date,
        slots
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const bookSlotForUser = async (req, res) => {
  try {
    const { userId, date, startTime } = req.body;
    if (!userId || !date || !startTime) {
      return res.status(400).json({ message: 'userId, date, and startTime are required' });
    }
    const inputDate = new Date(date);
    inputDate.setHours(0,0,0,0);
    const availability = await Availability.findOne({ userId, date: inputDate });
    if (!availability) {
      return res.status(404).json({ message: 'No availability found for this user on this date' });
    }
    const getMinutes = t => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const slotStart = getMinutes(startTime);
    const slotEnd = slotStart + 30;
    const availStart = getMinutes(availability.startTime);
    const availEnd = getMinutes(availability.endTime);
    if (slotStart < availStart || slotEnd > availEnd) {
      return res.status(400).json({ message: 'Requested slot is outside user availability' });
    }
    const bookings = await Booking.find({ userId, date: inputDate });
    for (let b of bookings) {
      const bookedStart = getMinutes(b.startTime);
      if ([slotStart-30, slotStart, slotStart+30].includes(bookedStart)) {
        return res.status(400).json({ message: 'Slot or adjacent slot already booked' });
      }
    }
    const slotEndTime = `${String(Math.floor(slotEnd/60)).padStart(2,'0')}:${String(slotEnd%60).padStart(2,'0')}`;
    const booking = new Booking({
      userId,
      adminId: req.user._id,
      date: inputDate,
      startTime,
      endTime: slotEndTime,
      status: 'Booked'
    });
    await booking.save();
    res.status(201).json({ message: 'Slot booked', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getSlotsForUser,
  bookSlotForUser
}; 
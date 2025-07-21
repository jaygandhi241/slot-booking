function getSlots(start, end) {
  const slots = [];
  let [sh, sm] = start.split(':').map(Number);
  let [eh, em] = end.split(':').map(Number);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  while (startMins + 30 <= endMins) {
    let slotStart = startMins;
    let slotEnd = startMins + 30;
    slots.push({
      start: `${String(Math.floor(slotStart/60)).padStart(2,'0')}:${String(slotStart%60).padStart(2,'0')}`,
      end: `${String(Math.floor(slotEnd/60)).padStart(2,'0')}:${String(slotEnd%60).padStart(2,'0')}`
    });
    startMins += 30;
  }
  return slots;
}

module.exports = { getSlots }; 
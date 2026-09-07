interface ScheduleSlot {
  time: string;
  service: string;
}

const scheduleData: ScheduleSlot[] = [
  { time: "09:00", service: "Classic Full Set" },
  { time: "10:30", service: "Gel Nails" },
  { time: "12:00", service: "Brow Lamination" },
  { time: "13:30", service: "Mega Volume + Wispy Set" },
  { time: "15:00", service: "Half-Leg Wax" },
  { time: "16:30", service: "Anime Lash Set" },
];

const DaySchedule = () => {
  return (
    <div className="rounded-2xl bg-lume-chocolate p-6 shadow-lume">
      <h3 className="mb-5 font-display text-xl text-lume-cream">
        Day Schedule
      </h3>

      <div className="flex flex-col divide-y divide-lume-cream/10">
        {scheduleData.map((slot) => (
          <div
            key={slot.time}
            className="flex items-center gap-4 py-3 text-sm"
          >
            <span className="w-14 shrink-0 text-lume-cream/50">
              {slot.time}
            </span>
            <span className="rounded-lg bg-lume-espresso px-4 py-2 text-lume-cream">
              {slot.service}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaySchedule;
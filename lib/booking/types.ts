export type Slot = { startsAt: string; endsAt: string };

export type OpeningHoursRow = {
  /** 0 = lunes … 6 = domingo */
  weekday: number;
  opensAt: string; // "HH:MM"
  closesAt: string; // "HH:MM"
  slotMinutes: number;
};

export type TimeRange = { startsAt: string; endsAt: string };

export type AppointmentInput = {
  reason: string;
  startsAt: string;
  endsAt: string;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  consentAt: string;
};

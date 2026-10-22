import "server-only";
import { BookingNotConfiguredError, type BookingProvider } from "./provider";

/**
 * Adaptador para Cal.com (API v2), preparado para el futuro.
 * Para activarlo: BOOKING_PROVIDER=calcom, CALCOM_API_KEY y CALCOM_EVENT_TYPE_ID,
 * e implementar las dos llamadas:
 *  - getAvailableSlots → GET  https://api.cal.com/v2/slots?eventTypeId=…&start=…&end=…&timeZone=Atlantic/Canary
 *  - createAppointment → POST https://api.cal.com/v2/bookings
 */
export const calcomProvider: BookingProvider = {
  async getAvailableSlots() {
    throw new BookingNotConfiguredError("El adaptador de Cal.com aún no está implementado");
  },
  async createAppointment() {
    throw new BookingNotConfiguredError("El adaptador de Cal.com aún no está implementado");
  },
};

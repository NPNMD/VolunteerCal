/**
 * googleCal.ts (compatibility re-export)
 * ----------------------------------------
 * All Google Calendar logic now lives in services/calendar.service.ts.
 * This file re-exports for backward compatibility.
 */
export {
  generateGoogleCalUrl,
  generateICSContent,
  downloadICS,
} from '@/services/calendar.service';

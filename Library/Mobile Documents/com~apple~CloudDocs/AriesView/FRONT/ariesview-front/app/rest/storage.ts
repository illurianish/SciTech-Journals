import { UnitLevelFormData } from "./types";

const KEY_V2_PREFIX = "av_legal_unit_v2_"; // current (user::property)
const KEY_V1_PREFIX = "av_legal_unit_"; // old (property only) – for migration

/** Get a stable user id on the client (no backend). */
function getUserKey(): string {
  try {
    if (typeof window === "undefined") return "guest";
    const win = window as any;
    // Prefer one of these (set it once at login or in layout):
    //  1) (window as any).__AV_USER_ID = user.email
    //  2) <body data-userid="user@email.com">
    //  3) localStorage.setItem('av_current_user','user@email.com')
    return (
      win.__AV_USER_ID ||
      document.body.getAttribute("data-userid") ||
      localStorage.getItem("av_current_user") ||
      "guest"
    );
  } catch {
    return "guest";
  }
}

function v2Key(propertyId: string) {
  return `${KEY_V2_PREFIX}${getUserKey()}::${propertyId}`;
}
function v1Key(propertyId: string) {
  return `${KEY_V1_PREFIX}${propertyId}`;
}

export function loadUnitData(propertyId: string): UnitLevelFormData | null {
  try {
    // Try v2 (user::property)
    const rawV2 = localStorage.getItem(v2Key(propertyId));
    if (rawV2) return JSON.parse(rawV2) as UnitLevelFormData;

    // Migrate from v1 (property only) → v2
    const rawV1 = localStorage.getItem(v1Key(propertyId));
    if (rawV1) {
      const parsed = JSON.parse(rawV1) as UnitLevelFormData;
      // write it into v2 under this user so it shows up from now on
      saveUnitData(propertyId, parsed);
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveUnitData(propertyId: string, data: UnitLevelFormData) {
  try {
    const payload = { ...data, lastEditedISO: new Date().toISOString() };
    localStorage.setItem(v2Key(propertyId), JSON.stringify(payload));
  } catch {}
}

export function clearUnitData(propertyId: string) {
  try {
    localStorage.removeItem(v2Key(propertyId));
  } catch {}
}

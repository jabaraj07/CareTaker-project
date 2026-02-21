import {Profile, SafeProfile} from "./index"

export function toSafeProfile(profile: Profile): SafeProfile {
  return {
    id: profile.id,
    full_name: profile.full_name ?? "",
    role: profile.role,
    caretaker_email: profile.caretaker_email,
    notification_time: profile.notification_time ?? "",
  };
}
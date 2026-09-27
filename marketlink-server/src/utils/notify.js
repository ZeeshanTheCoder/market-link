import Notification from "../models/Notification.js";

export async function notify(userId, title, message, type = "info", link = "") {
  if (!userId) return null;
  return Notification.create({ userId, title, message, type, link });
}

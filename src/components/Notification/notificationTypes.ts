import { toast } from "react-toastify";

const notifications = {
  notificationSuccess: (text: string) => toast.success(text),
  notificationError: (text: string) => toast.error(text),
  notificationInfo: (text: string) => toast.info(text),
  notificationWarn: (text: string) => toast.warn(text),
};

export default notifications;
import toast from "react-hot-toast";
import PremiumToast from "./PremiumToast";

export const showToast = {
  error: (msg) =>
    toast.custom((t) => <PremiumToast t={t} message={msg} type="error" />),
  success: (msg, icon) =>
    toast.custom((t) => (
      <PremiumToast t={t} message={msg} type="success" icon={icon} />
    )),
};

import { writeToSocket } from "./socket";

/**
 * Issues a reload to force reload the config
 */
export function reload() {
  return writeToSocket("/reload");
}

/**
 * Issues a kill to get into a kill mode, where you can kill an app by clicking on it.
 */
export function kill() {
  return writeToSocket("/kill");
}

/**
 * Sets the cursor theme and reloads the cursor manager. Will set the theme for everything except GTK
 */
export function setCursor(theme: string, size: number) {
  return writeToSocket(`/setcursor ${theme} ${size}`);
}

/**
 * Allows you to add and remove fake outputs to your preferred backend
 */
export function output(action: "create" | "remove", backend: string) {
  return writeToSocket(`/output ${action} ${backend}`);
}

/**
 * Sets the xkb layout index for a keyboard
 */
export function switchXkbLayout(device: string, direction: "next" | "prev") {
  return writeToSocket(`/switchxkblayout ${device} ${direction}`);
}

/**
 * Sets the hyprctl error string. Will reset when Hyprland’s config is reloaded
 */
export function setError(color: string, message: string) {
  return writeToSocket(`/seterror ${color} ${message}`);
}

/**
 * Disables the hyprctl error string. Will reset when Hyprland’s config is reloaded
 */
export function disableError(message: string) {
  return writeToSocket(`/seterror disable ${message}`);
}

export enum Icon {
  NoIcon = -1,
  Warning,
  Info,
  Hint,
  Error,
  Confused,
  Ok,
}

/**
 * Sends a notification using the built-in Hyprland notification system
 */
export function notify(
  icon: Icon,
  timeout: number,
  color: string,
  message: string
) {
  return writeToSocket(`/notify ${icon} ${timeout} ${color} ${message}`);
}

type PropValue = {
  animationstyle: string;
  rounding: number;
  bordersize: number;
  forcenoblur: boolean;
  forceopaque: boolean;
  forceopaqueoverriden: boolean;
  forceallowsinput: boolean;
  forcenoanims: boolean;
  forcenoborder: boolean;
  forcenodim: boolean;
  forcenoshadow: boolean;
  windowdancecompat: boolean;
  nomaxsize: boolean;
  dimaround: boolean;
  keepaspectratio: boolean;
  alphaoverride: boolean;
  alpha: number;
  alphainnactiveoverride: boolean;
  alphainnactive: number;
  activebordercolor: string;
  innactivebordercolor: string;
};

export function setProp<T extends keyof PropValue>(
  address: string,
  name: T,
  value: PropValue[T],
  lock?: boolean
) {
  const str =
    typeof value === "boolean" ? (value ? "1" : "0") : value.toString();
  return writeToSocket(
    `/setprop address:${address} ${name} ${str} ${lock && "lock"}`
  );
}

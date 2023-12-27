import { sendCommand } from "./socket";

export type Workspace = "string" | number;

export type Direction = "left" | "right" | "up" | "down"; // only the first letter is taken

export type Status = "on" | "off" | "toggle";

export type ResizeParams = {
  x: number | string;
  y: number | string;
  exact?: boolean;
};

async function dispatch(dispatcher: string, parameter: string = "") {
  return sendCommand(`dispatch ${dispatcher} ${parameter}`);
}

function isDirection(s: string) {
  const directions = ["left", "right", "up", "down"];
  return directions.includes(s);
}

function formatResizeParams(params: ResizeParams) {
  return `${params.exact ? "exact " : ""}${params.x} ${params.y}`;
}

/**
 * Executes a shell command
 */
export function exec(command: string, rules?: string[]) {
  return dispatch("exec", rules ? `[${rules.join(";")}] ${command}` : command);
}

/**
 * Executes a raw shell command (does not support rules)
 */
export function execr(command: string) {
  return dispatch("execr", command);
}

/**
 * Closes (not kills) the active window
 */
export function killactive() {
  return dispatch("killactive");
}

/**
 * Closes a specified window
 */
export function closeWindow(window: string) {
  return dispatch("closeWindow", window);
}

/**
 * Changes the workspace
 */
export function workspace(workspace: Workspace) {
  return dispatch("workspace", workspace.toString());
}

/**
 * Moves window to a workspace
 */
export function moveToWorkspace(workspace: Workspace, window?: string) {
  return dispatch(
    "movetoworkspace",
    window ? `${workspace},${window}` : workspace.toString()
  );
}

/**
 * Moves window to a workspace without switching workspace
 */
export function moveToWorkspaceSilent(workspace: Workspace, window?: string) {
  return dispatch(
    "movetoworkspacesilent",
    window ? `${workspace},${window}` : workspace.toString()
  );
}

/**
 * Toggles window's floating state
 */
export function toggleFloating(window?: string) {
  return dispatch("togglefloating", window);
}

/**
 * Toggles window's floating state
 * @param mode fullscreen (takes your entire screen), maximize (keeps gaps and bar(s))
 */
export function fullscreen(mode?: "fullscreen" | "maximize") {
  return dispatch("fullscreen", mode == "maximize" ? "1" : "0");
}

/**
 * Toggles the focused window’s internal fullscreen state without altering the geometry
 */
export function fakeFullscreen() {
  return dispatch("fakefullscreen");
}

/**
 * Sets all monitors’ DPMS status. Do not use with a keybind directly
 */
export function dpms(status: Status, monitor?: string) {
  return dispatch("dpms", monitor ? `${status} ${monitor}` : status);
}

/**
 * Pins a window (i.e. show it on all workspaces) note: floating only
 */
export function pin(window?: string) {
  return dispatch("pin", window);
}

/**
 * Moves the focus in a direction
 */
export function moveFocus(direction: Direction) {
  return dispatch("movefocus", direction.charAt(0));
}

/**
 * Moves the focus in a direction
 */
export function moveWindow(direction: Direction): void;
export function moveWindow(monitor: string): void;
export function moveWindow(target: string) {
  return dispatch(
    "movewindow",
    isDirection(target) ? target.charAt(0) : `mon:${target}`
  );
}

/**
 * Swaps the active window with another window in the given direction
 */
export function swapWindow(direction: Direction) {
  return dispatch("swapwindow", direction.charAt(0));
}

/**
 * Center the active window note: floating only
 */
export function centerWindow(reservedArea?: boolean) {
  return dispatch("centerwindow", reservedArea ? "1" : "0");
}

/**
 * Resizes the active window
 */
export function resizeActive(params: ResizeParams) {
  return dispatch("resizeactive", formatResizeParams(params));
}

/**
 * Moves the active window
 */
export function moveActive(params: ResizeParams) {
  return dispatch("moveactive", formatResizeParams(params));
}

/**
 * Resizes a selected window
 */
export function resizeWindowPixel(params: ResizeParams, window: string) {
  return dispatch(
    "resizewindowpixel",
    formatResizeParams(params) + "," + window
  );
}

/**
 * Moves a selected window
 */
export function moveWindowPixel(params: ResizeParams, window: string) {
  return dispatch("movewindowpixel", formatResizeParams(params) + "," + window);
}

/**
 * Focuses the next window on a workspace
 */
export function cycleNext(
  target?: "prev" | "tiled" | "floating" | "prev tiled"
) {
  return dispatch("cyclenext", target);
}

/**
 * Swaps the focused window with the next window on a workspace
 */
export function swapNext(target?: "prev") {
  return dispatch("swapnext", target);
}

/**
 * Focuses the first window matching
 */
export function focusWindow(window: string) {
  return dispatch("focuswindow", window);
}

/**
 * Focuses a monitor
 */
export function focusMonitor(monitor: string) {
  return dispatch("focusmonitor", monitor);
}

/**
 * Changes the split ratio
 */
export function splitRatio(ratio: number) {
  return dispatch("splitratio", ratio.toString());
}

/**
 * Toggles the current window to always be opaque. Will override the opaque window rules
 */
export function toggleOpaque() {
  return dispatch("toggleopaque");
}

export enum Corner {
  BottomLeft,
  BottomRight,
  TopRight,
  TopLeft,
}

/**
 * Moves the cursor to the corner of the active window
 * @param position bottom left - 0, bottom right - 1, top right - 2, top left - 3
 */
export function moveCursorToCorner(position: Corner) {
  return dispatch("movecursortocorner", position.toString());
}

/**
 * Moves the cursor to a specified position
 */
export function moveCursor(x: number, y: number) {
  return dispatch("movecursor", `${x} ${y}`);
}

/**
 * Moves the cursor to a specified position
 */
export function renameWorkspace(id: number, name: string) {
  return dispatch("renameworkspace", `${id} ${name}`);
}

/**
 * Exits the compositor with no questions asked
 */
export function exit() {
  return dispatch("exit");
}

/**
 * Forces the renderer to reload all resources and outputs
 */
export function forceRenderReload() {
  return dispatch("forcerenderreload");
}

/**
 * Moves the active workspace to a monitor
 */
export function moveCurrentWorkspaceToMonitor(monitor: string) {
  return dispatch("movecurrentworkspacetomonitor", monitor);
}

/**
 * Moves the specified workspace to a monitor
 */
export function moveWorkspaceToMonitor(workspace: Workspace, monitor: string) {
  return dispatch("movecurrentworkspacetomonitor", `${workspace} ${monitor}`);
}

/**
 * Swaps the active workspaces between two monitors
 */
export function swapActiveWorkspace(a: string, b: string) {
  return dispatch("swapactiveworkspace", `${a} ${b}`);
}

/**
 * @deprecated
 * Deprecated in favor of alterzorder. Brings the current window to the top of the stack
 */
export function bringActiveTop() {
  return dispatch("bringactivetop");
}

/**
 * Modifies the window stack order of the active or specified window
 * Note: this cannot be used to move a floating window behind a tiled one
 */
export function alterZOrder(z: number, window?: string) {
  return dispatch("alterzorder", window ? `${z},${window}` : z.toString());
}

/**
 * Toggles a special workspace on/off
 */
export function toggleSpecialWorkspace(workspace?: string) {
  return dispatch("togglespecialworkspace", workspace);
}

/**
 * Focuses the urgent window or the last window
 */
export function focusUrgentOrLast() {
  return dispatch("focusurgentorlast");
}

/**
 * Toggles the current active window into a group
 */
export function toggleGroup() {
  return dispatch("togglegroup");
}

/**
 * Switches to the next window in a group
 */
export function changeGroupActive(target: "backward" | "forward" | number) {
  return dispatch(
    "changegroupactive",
    typeof target === "string" ? target.charAt(0) : target.toString()
  );
}

/**
 * Switches focus from current to previously focused window
 */
export function focusCurrentOrLast() {
  return dispatch("focuscurrentorlast");
}

/**
 * Locks the groups (all groups will not accept new windows)
 */
export function lockGroups(mode: "lock" | "unlock" | "toggle") {
  return dispatch("lockgroups", mode);
}

/**
 * Lock the focused group (the current group will not accept new windows or be moved to other groups)
 */
export function lockActiveGroup(mode: "lock" | "unlock" | "toggle") {
  return dispatch("lockactivegroup", mode);
}

/**
 * Moves the active window into a group in a specified direction.
 * No-op if there is no group in the specified direction
 */
export function moveIntoGroup(direction: Direction) {
  return dispatch("moveintogroup", direction.charAt(0));
}

/**
 * Moves the active window out of a group.
 * No-op if not in a group
 */
export function moveOutOfGroup() {
  return dispatch("moveoutofgroup");
}

/**
 * Swaps the active window with the next or previous in a group
 */
export function moveWindowOrGroup(direction: "backward" | "forward") {
  return dispatch("movewindoworgroup", direction.charAt(0));
}

/**
 * Prohibits the active window from becoming or being inserted into group
 */
export function denyWindowFromGroup(status: Status) {
  return dispatch("denywindowfromgroup", status);
}

/**
 * Temporarily enable or disable binds:ignore_group_lock
 */
export function setIgnoreGroupLock(status: Status) {
  return dispatch("setignoregrouplock", status);
}

/**
 * Executes a Global Shortcut using the GlobalShortcuts portal
 * @see https://wiki.hyprland.org/Configuring/Binds/#global-keybinds
 */
export function global(name: string) {
  return dispatch("global", name);
}

/**
 * Changes the current mapping group
 * @see https://wiki.hyprland.org/Configuring/Binds/#submaps
 */
export function submap(name: "reset" | string) {
  return dispatch("submap", name);
}

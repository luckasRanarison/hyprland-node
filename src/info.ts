import { sendCommand } from "./socket";
import { renameProps } from "./utils";

async function parseCommand(command: string) {
  const text = await sendCommand(command, { flag: "j", skipOk: true });
  return JSON.parse(text);
}

export type Version = {
  branch: string;
  commit: string;
  dirty: boolean;
  commitMessage: string;
  tag: string;
  flags: string[];
};

/**
 * Lists hyprland version, meaning flags, commit and branch of build
 */
export async function version(): Promise<Version> {
  const version = await parseCommand("version");
  renameProps(version, [["commit_message", "commitMessage"]]);
  return version;
}

export type Monitor = {
  id: number;
  name: string;
  description: string;
  make: string;
  model: string;
  serial: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  activeWorkspace: {
    id: number;
    name: string;
  };
  specialWorkspace: {
    id: number;
    name: string;
  };
  reserved: [number, number, number, number];
  scale: number;
  transform: number;
  focused: boolean;
  dpmsStatus: boolean;
  vrr: boolean;
};

/**
 * Lists active outputs with their properties
 */
export function monitors(): Promise<Monitor[]> {
  return parseCommand("monitors");
}

export type Workspace = {
  id: number;
  name: string;
  monitor: string;
  windows: number;
  hasFullscreen: boolean;
  lastWindow: string;
  lastWindowTitle: string;
};

/**
 * Lists all workspaces with their properties
 */
export async function workspaces(): Promise<Workspace[]> {
  const workspaces = await parseCommand("workspaces");

  for (const workspace of workspaces) {
    renameProps(workspace, [
      ["hasfullscreen", "hasFullscreen"],
      ["lastwindow", "lastWindow"],
      ["lastwindowtitle", "lastWindowTitle"],
    ]);
  }

  return workspaces;
}

/**
 * Gets the active workspace and its properties
 */
export async function activeWorkspace(): Promise<Workspace> {
  const workspace = await parseCommand("activeworkspace");

  renameProps(workspace, [
    ["hasfullscreen", "hasFullscreen"],
    ["lastwindow", "lastWindow"],
    ["lastwindowtitle", "lastWindowTitle"],
  ]);

  return workspace;
}

export type Window = {
  address: string;
  mapped: boolean;
  hidden: boolean;
  at: [number, number];
  size: [number, number];
  workspace: {
    id: number;
    name: string;
  };
  floating: boolean;
  monitor: number;
  class: string;
  title: string;
  initialClass: string;
  initialTitle: string;
  pid: number;
  xwayland: boolean;
  pinned: boolean;
  fullscreen: boolean;
  fullscreenMode: number;
  fakeFullscreen: boolean;
  grouped: string[];
  swallowing?: string;
};

/**
 * Lists all windows with their properties
 */
export function clients(): Promise<Window[]> {
  return parseCommand("clients");
}

/**
 * Gets the active window name and its properties
 */
export function activeWindow(): Promise<Window> {
  return parseCommand("activewindow");
}

export type Bind = {
  locked: boolean;
  mouse: boolean;
  release: boolean;
  repeat: boolean;
  nonConsuming: boolean;
  modmask: number;
  submap: string;
  key: string;
  keycode: number;
  dispatcher: string;
  arg: string;
};

/**
 * Lists all registered binds
 */
export async function binds(): Promise<Bind[]> {
  const binds = await parseCommand("binds");

  for (const bind of binds) {
    renameProps(bind, [["non_consuming", "nonConsuming"]]);
  }

  return binds;
}

export type Level = {
  address: string;
  x: number;
  y: number;
  w: number;
  h: number;
  namespace: string;
};

export type Layer = {
  [key: string]: {
    levels: {
      [key: string]: Level[];
    };
  };
};

/**
 * Lists all the layers
 */
export function layers(): Promise<Layer> {
  return parseCommand("layers");
}

/**
 * Gets the current random splash
 */
export function splash(): Promise<string> {
  return sendCommand("splash", { skipOk: true });
}

export type Option = {
  option: string;
  int: number;
  float: number;
  str: string;
  data: string;
};

/**
 * Gets the config option status (values)
 */
export function getOption(option: string): Promise<Option> {
  return parseCommand(`getoption ${option}`);
}

/**
 * Gets the current cursor pos in global layout coordinates
 */
export function cursorPos(): Promise<{ x: number; y: number }> {
  return parseCommand("cursorpos");
}

export type Animation = {
  name: string;
  overridden: boolean;
  bezier: string;
  enabled: boolean;
  speed: number;
  style: string;
};

export type AnimationConfig = {
  animations: Animation[];
  beziers: { name: string };
};

/**
 * Gets the current config'd info about animations and beziers
 */
export async function animations(): Promise<AnimationConfig> {
  const [animations, beziers] = await parseCommand("animations");
  return { animations, beziers };
}

type Instance = {
  instance: string;
  time: number;
  pid: number;
  wl_socket: string;
};

/**
 * Lists all running instances of hyprland with their info
 */
export async function instances(): Promise<Instance[]> {
  const instances = await parseCommand("instances");

  for (const instance of instances) {
    renameProps(instance, [["wl_socket", "wlScoket"]]);
  }

  return instances;
}

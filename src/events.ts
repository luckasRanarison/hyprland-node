import { env } from "process";
import { Socket, createConnection } from "net";

type EventData = {
  workspace: { workspaceName: string };
  createworkspace: { workspaceName: string };
  destroyworkspace: { workspaceName: string };
  focusedmon: { monitorName: string; workspaceName: string };
  activewindow: { windowClass: string; windowTitle: string };
  activewindowv2: { windowAddress: string };
  fullscreen: { fullscreen: boolean };
  monitorremoved: { monitorName: string };
  monitoradded: { monitorName: string };
  moveworkspace: { workspaceName: string; monitorName: string };
  activespecial: { workspaceName: string; monitorName: string };
  renameworkspace: { workspaceId: string; newName: string };
  activelayout: { keyboardName: string; layoutName: string };
  openwindow: {
    windowAddress: string;
    workspaceName: string;
    windowClass: string;
    windowTitle: string;
  };
  closewindow: { windowAddress: string };
  movewindow: { windowAddress: string; workspaceName: string };
  openlayer: { namespace: string };
  closelayer: { namespace: string };
  submap: { submap: string };
  changefloatingmode: { windowAddress: string; floating: boolean };
  urgent: { windowAddress: string };
  minimize: { windowAddress: string; minimized: boolean };
  screencast: { state: boolean; owner: "monitor" | "window" };
  windowtitle: { windowAddress: string };
  ignoregrouplock: { state: boolean };
  lockgroups: { state: boolean };
};

type EventType = keyof EventData;

class EventListener {
  private connection: Socket | null;
  private queue: Partial<Record<EventType, Function[]>>;

  constructor() {
    this.connection = null;
    this.queue = {};
  }

  /**
   * Adds an event listener to the specified event
   */
  on<T extends EventType>(event: T, callback: (data: EventData[T]) => void) {
    if (!this.queue[event]) {
      this.queue[event] = [];
    }

    const queue = this.queue[event] as Function[];
    const id = queue.length;

    queue.push(callback);

    return id;
  }

  /**
   * Connects to the socket and listen to incomming events
   */
  listen(callback?: () => void) {
    const { HYPRLAND_INSTANCE_SIGNATURE } = env;

    this.connection = createConnection(
      {
        path: `/tmp/hypr/${HYPRLAND_INSTANCE_SIGNATURE}/.socket2.sock`,
      },
      callback
    );

    this.connection.on("data", (buffer) => {
      const [event, data] = buffer.toString().split(">>") as [
        EventType,
        string
      ];
      const params = this.paramsFromData(event, data);

      this.queue[event]?.forEach((handler) => handler(params));
    });
  }

  /**
   * Removes an event listener
   */
  remove(event: EventType, id: number) {
    this.queue[event]?.splice(id, 1);
  }

  /**
   * Closes the communication to the socket and removes all event listeners
   */
  close() {
    this.connection?.removeAllListeners("data");
    this.connection?.end();
    this.connection = null;
  }

  private paramsFromData(event: string, data: string) {
    const args = data.trim().split(",");

    switch (event) {
      case "workspace":
      case "createworkspace":
      case "destroyworkspace":
        return { workspaceName: args[0] };

      case "focusedmon":
        return { monitorName: args[0], workspaceName: args[1] };

      case "activewindow":
        return { windowClass: args[0], windowTitle: args[1] };

      case "fullscreen":
        return { fullscreen: args[0] === "1" };

      case "monitorremoved":
      case "monitoradded":
        return { monitorName: args[0] };

      case "moveworkspace":
      case "activespecial":
        return { workspaceName: args[0], monitorName: args[1] };

      case "renameworkspace":
        return { workspaceId: args[0], newName: args[1] };

      case "activelayout":
        return { keyboardName: args[0], layoutName: args[2] };

      case "activewindowv2":
      case "openwindow":
      case "closewindow":
      case "movewindow":
      case "urgent":
      case "windowtitle":
        return {
          windowAddress: args[0],
          workspaceName: args[1],
          windowClass: args[2],
          windowTitle: args[3],
        };

      case "openlayer":
      case "closelayer":
        return { namespace: args[0] };

      case "submap":
        return { submap: args[0] };

      case "changefloatingmode":
        return { windowAddress: args[0], floating: args[1] === "1" };

      case "minimize":
        return { windowAddress: args[0], minimized: args[1] === "1" };

      case "screencast":
        return {
          state: args[0] === "1",
          owner: args[1] === "0" ? "monitor" : "window",
        };

      case "ignoregrouplock":
        return { state: args[0] === "1" };

      case "lockgroups":
        return { state: args[0] === "1" };
    }
  }
}

export { EventListener };

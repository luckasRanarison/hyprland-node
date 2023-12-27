import { env } from "process";
import { createConnection } from "net";

function writeToSocket(message: string): Promise<string> {
  const { HYPRLAND_INSTANCE_SIGNATURE } = env;
  const connection = createConnection({
    path: `/tmp/hypr/${HYPRLAND_INSTANCE_SIGNATURE}/.socket.sock`,
  });

  return new Promise((resolve, reject) => {
    connection.write(message, (error) => {
      if (error) {
        reject(error);
      }
    });

    connection.on("data", (data) => {
      connection.end();
      resolve(data.toString());
    });
  });
}

/**
 * Sends hyprctl-like requests through UNIX socket
 */
async function sendCommand(
  command: string,
  options: { flag?: string; skipOk?: boolean } = {}
): Promise<string> {
  const { flag, skipOk } = options;
  const response = await writeToSocket(
    flag ? `${flag}/${command}` : `/${command}`
  );

  if (!skipOk && response !== "ok") {
    throw new Error(response);
  }

  return response;
}

export { sendCommand };

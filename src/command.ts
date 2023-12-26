import { env } from "process";
import { createConnection } from "net";

/**
 * Writes to the hyprland's socket to send command
 */
function send(command: string): Promise<string> {
  const { HYPRLAND_INSTANCE_SIGNATURE } = env;
  const connection = createConnection({
    path: `/tmp/hypr/${HYPRLAND_INSTANCE_SIGNATURE}/.socket.sock`,
  });

  return new Promise((resolve, reject) =>
    connection.write(command, (error) => {
      if (error) {
        reject(error);
      }

      connection.on("data", (data) => {
        connection.end();
        resolve(data.toString());
      });
    })
  );
}

export { send };

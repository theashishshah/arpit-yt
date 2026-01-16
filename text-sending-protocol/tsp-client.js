
import net from "net";

const client = net.createConnection({ port: 3000 }, (message) => {
    const msg = "hello from TSP";
    const tsp = `TSP/1.0\nLEN:${msg.length}\n\n${msg}`;
    client.write(tsp);
});

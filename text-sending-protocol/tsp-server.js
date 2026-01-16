import net from "net";

const server = net.createServer((socket) => {
    console.log("Client connected");

    let buffer = "";

    socket.on("data", (chunk) => {
        buffer += chunk.toString();

        while (true) {
            const headerEnd = buffer.indexOf("\n\n");
            if (headerEnd === -1) return;

            const header = buffer.slice(0, headerEnd);
            const lines = header.split("\n");

            if (lines[0] !== "TSP/1.0") {
                socket.end("Invalid protocol");
                return;
            }

            const lenLine = lines.find((l) => l.startsWith("LEN:"));
            const len = parseInt(lenLine.split(":")[1]);

            const totalLength = headerEnd + 2 + len;
            if (buffer.length < totalLength) return;

            const message = buffer.slice(headerEnd + 2, totalLength);
            buffer = buffer.slice(totalLength);

            console.log("TSP message:", message);
        }
    });
});

server.listen(3000, () => {
    console.log("TSP server listening on port 3000");
});

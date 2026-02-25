import net from "net" // net is an object of js and it has several methods

const server = net.createServer((socket) => {
    console.log("Client is connected")

    console.log("Socket data", socket)
    socket.on("data", (data) => {
        console.log("raw bytes: ", data) // hey, how are you? =><Buffer 68 65 79 2c 20 68 6f 77 20 61 72 65 20 79 6f 75 3f 0a>
        console.log("actual data: ", data.toString())
        socket.write("Data received succesfuly\n")
    })



    socket.on("end", () => {
        console.log("Connection is terminated successfuly")
        socket.write("Thank you for chatting.")
    })
})

server.listen(8888, "127.0.0.1", () => console.log("Server is listening on PORT 8888"))
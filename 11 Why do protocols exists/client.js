import net from "net"

const client = new net.Socket()
console.log("client", client)


client.connect(8888, "127.0.0.1", () => {
    console.log("connected to server on port 8888")

    client.write("i'm client")
    client.write("Hey, how are you server?")
})

client.on("data", (data) => {
    console.log("server is saying something in bytes", data)
    console.log("server sends data: ", data.toString())

    client.write("Thank you server!")
})

client.on("close", () => {
    console.log("server is terminating the connection....")
    console.log("Server is terminated.")
})

client.on("error", (err) => {
    console.log("Error from server", err)
})
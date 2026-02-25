nc -l 9999 # netcat listen port 
# now server listens on this port 
nc localhost 8888 # acts as a client

# now tcp connection is established and both parties can send the data
# now I'm able to send data from both client and server side. So that means I can send the data from both the ends
# TCP expect steam of byts that's it
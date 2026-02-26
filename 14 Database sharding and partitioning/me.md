what happens when I run a mysql process on my machine internally? 
- mysql is just a process like other process on my machine but it is designed to use my disk space in a such a way that i can easily perform CRUD operation rather that using finder/file manager to do, so. 
- lets say I made an express application that takes user's profile data and i want to store it on my local machine using mysql process. 
- how the flow will work in this case?
- in my express application, somehow I'll connect to mysql process and when my express server get data from user, using the socket it will create a TCP connection to mysql process and it would write the data into mysql (internally mysql is handling disk space) i could do the same using "fs" module but this is not efficient as sql query
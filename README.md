[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iiM72xrO)
# NodeJS - WebSockets + MongoDB Lab Day

**Goal:** Create a chat application using Node, Express, Socket.io and MongoDB. The database will be used to store the messages.

## 📖 Instructions

Review the instructions below and also review some of the backend code that is already provided.

### Part I (No rooms)

1. Go to the backend directory and run `npm install` to install all the necessary packages.
2. Create a database in MongoDB called `chatroom` and a collection called `chats`.
3. Copy and paste the connection string of your cluster to your `.env` file. Name the environment variable as `DATABASE_URL`. Make sure to update the database password.
4. Create a frontend of your choice and update the `cors` url in `sockets/chat.socket.ts` to your frontend URL. Set up Socket.io on the frontend.
5. The page should have two input fields and a button, one input field for the username and one for the chat message. Clicking submit will emit a message to the backend.
6. The page should also have an area to display all messages. You can use a `<ul>` element if you like.
7. When a new user is connected to the chat, fetch all the messages from the database so that they can see all previous conversations.
8. Open multiple tabs to simulate multiple users and test.

### Part II (With rooms)

9. Continuing on the same set-up from **Part I**, create 3 rooms which the user can choose from on the frontend. You can use buttons or a dropdown select.
10. Create events for `join room` and `leave room` in your backend.
11. Update your `chat.socket.ts` so that your backend only emits the data object to clients of rooms.
12. Update the rest of your backend to support rooms. Such as adding a new function in your controller called `getMessagesByRoom` and the corresponding route.
13. Joining a room will show you all the previous messages of that specific room. Users in the room will also see a message that you joined the room.
14. Leaving a room will clear the messages element. Also, users who are still on the room will see a message that you left.

Good luck! 🙌

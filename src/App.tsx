import React from "react";
import "./App.css";
import Notification from "./components/Notification";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <Notification />
      <Chat />
    </div>
  );
}

export default App;

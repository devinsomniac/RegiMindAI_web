import Image from "next/image";
import Header from "./components/Header";
import ChatPage from "./components/Chatpage";

export default function Home() {
  return (
    <div>
      <Header/>
      <ChatPage/>
    </div>
  );
}

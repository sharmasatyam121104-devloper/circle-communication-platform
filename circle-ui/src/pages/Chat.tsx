import useAuthStore from "../store/useAuthStore";

const Chat = () => {
const user = useAuthStore(
    (state) => state.user
  );

  console.log(user);

  return (
    <div>Chat</div>
  )
}

export default Chat
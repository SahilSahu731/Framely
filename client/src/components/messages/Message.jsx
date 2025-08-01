import { useSelector } from 'react-redux';

const Message = ({ message }) => {
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedConversation } = useSelector((state) => state.chat);

  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const bubbleBgColor = fromMe ? 'bg-sky-500' : 'bg-gray-600';
  const profilePic = fromMe ? authUser.profilePicture : selectedConversation.profilePicture;

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User avatar" src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor}`}>{message.message}</div>
    </div>
  );
};

export default Message;
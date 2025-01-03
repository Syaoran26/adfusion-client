'use client';

import Tooltip from '@/components/custom/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formats } from '@/lib/utils';
import IMessage from '@/types/message';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useRef } from 'react';
import ChatForm from './chat-form';
import { useChat } from '@/hooks';
import IChat from '@/types/chat';

interface ChatContainerProps {
  chat: IChat;
}

const ChatContainer: FC<ChatContainerProps> = ({ chat }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage } = useChat(chat.chatId, chat.isCampaign);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className="flex flex-col gap-4 h-full pt-16 -mr-4">
      <div className="flex-1 flex items-end overflow-auto pt-4 pr-4">
        <div className="flex flex-col gap-4 max-h-full w-full">
          {groupConsecutiveMessagesBySender(messages).map((messageItems) => (
            <Message key={messageItems[0].id} messages={messageItems} />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="shrink-0 pr-4">
        <ChatForm onSend={sendMessage} />
      </div>
    </div>
  );
};

interface MessageProps {
  messages: IMessage[];
}

const Message = ({ messages }: MessageProps) => {
  const { data: session } = useSession();
  const sender = messages[0].sender;
  const sent = session?.user.id === sender.id;

  return (
    <div className={cn('flex items-end gap-2', { 'justify-end': sent })}>
      {!sent && (
        <Tooltip label={sender.name}>
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={sender.image} alt={sender.name} />
            <AvatarFallback>{sender.name[0]}</AvatarFallback>
          </Avatar>
        </Tooltip>
      )}
      <div className={cn('flex flex-col gap-0.5 max-w-[70%]', { 'items-end': sent })}>
        {messages.map((message, index) => (
          <Tooltip key={message.id} label={formats.date(message.sentAt, true, { second: undefined })}>
            <div
              className={cn(' w-fit px-3 py-2 bg-secondary shadow-md', {
                'bg-primary': sent,
                'rounded-r-lg': !sent,
                'rounded-ss-lg': !sent && index === 0,
                'rounded-es-lg': !sent && index === messages.length - 1,
                'rounded-l-lg': sent,
                'rounded-se-lg': sent && index === 0,
                'rounded-ee-lg': sent && index === messages.length - 1,
              })}
            >
              {message.content}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;

function groupConsecutiveMessagesBySender(messages: IMessage[]) {
  const groupedMessages: IMessage[][] = [];

  let currentGroup: IMessage[] = [];
  let currentSenderId = messages[0]?.sender.id;

  messages.forEach((message) => {
    if (message.sender.id === currentSenderId) {
      // Nếu sender.id giống nhau, thêm message vào nhóm hiện tại
      currentGroup.push(message);
    } else {
      // Nếu sender.id khác nhau, lưu nhóm hiện tại vào groupedMessages
      groupedMessages.push(currentGroup);

      // Tạo nhóm mới cho sender tiếp theo
      currentSenderId = message.sender.id;
      currentGroup = [message];
    }
  });

  // Thêm nhóm cuối cùng sau khi duyệt xong
  if (currentGroup.length > 0) {
    groupedMessages.push(currentGroup);
  }

  return groupedMessages;
}

'use client';

import Paper from '@/components/custom/paper';
import Tooltip from '@/components/custom/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LuMoreHorizontal, LuUserPlus2, LuVideo } from 'react-icons/lu';
import ChatContainer from './chat-container';
import { fetchRequest } from '@/request';
import { FC } from 'react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import PeoplePickerPopup from '@/components/people-picker-popup';
import { useAuthBrand } from '@/hooks';

interface BoxChatProps {
  id: string;
  open: boolean;
  toggle: () => void;
}

const BoxChat: FC<BoxChatProps> = ({ id, open, toggle }) => {
  const { profile } = useAuthBrand();
  const { data } = fetchRequest.chat.details(id);

  return (
    <div
      className={cn('flex-1 h-full max-md:absolute z-50 inset-y-0 right-0 max-md:w-0 transition-all', {
        'max-md:w-full': open,
      })}
    >
      <Paper className="relative h-full p-4 max-md:rounded-none">
        <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 bg-background shadow-lg z-1">
          <span className="flex items-center gap-2">
            <Tooltip label="Trở lại">
              <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={toggle}>
                <ArrowLeftIcon className="size-5" />
              </Button>
            </Tooltip>
            <Avatar className="size-11 shrink-0">
              <AvatarImage src={data?.chatImage} alt={data?.chatName} />
              <AvatarFallback>{data?.chatName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden truncate text-nowrap font-medium">{data?.chatName}</div>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {data?.isCampaign && profile && (
              <Tooltip label="Thêm thành viên">
                <PeoplePickerPopup>
                  <Button variant="ghost" size="icon-sm">
                    <LuUserPlus2 className="text-xl" />
                  </Button>
                </PeoplePickerPopup>
              </Tooltip>
            )}
            <Tooltip label="Bắt đầu gọi video">
              <Button variant="ghost" size="icon-sm">
                <LuVideo className="text-xl" />
              </Button>
            </Tooltip>
            <Tooltip label="Thông tin về cuộc trò chuyện">
              <Button variant="ghost" size="icon-sm">
                <LuMoreHorizontal className="text-xl" />
              </Button>
            </Tooltip>
          </div>
        </div>
        {data && <ChatContainer chat={data} />}
      </Paper>
    </div>
  );
};

export default BoxChat;
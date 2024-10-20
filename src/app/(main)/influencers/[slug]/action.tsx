'use client';

import { Button } from '@/components/ui/button';
import { useAuthBrand, useThrottle } from '@/hooks';
import { cn, constants } from '@/lib/utils';
import { brandRequest, fetchRequest } from '@/request';
import IInfluencer from '@/types/influencer';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { signIn } from 'next-auth/react';
import { FC } from 'react';
import { LuShare } from 'react-icons/lu';
import { toast } from 'sonner';

interface ActionProps {
  influencer: IInfluencer;
}

const Action: FC<ActionProps> = ({ influencer }) => {
  const { session, profile } = useAuthBrand();
  const { data, mutate } = fetchRequest.favorites(!!profile);
  const isFavorite = Boolean(data && data.some((f) => f.id === influencer.id));

  const handleFavorite = useThrottle(() => {
    if (!session) {
      signIn();
      return;
    }
    const caller = isFavorite ? brandRequest.unfavorite(influencer.id) : brandRequest.favorite(influencer.id);
    toast.promise(caller, {
      loading: 'Đang tải',
      success: () => {
        mutate();
        return (isFavorite ? 'Đã xóa khỏi' : 'Đã thêm vào') + ' danh sách yêu thích';
      },
      error: (err) => err?.message || constants.sthWentWrong,
    });
  }, 750);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" startIcon={<LuShare />}>
        Chia Sẻ
      </Button>
      <Button
        variant="ghost"
        startIcon={
          isFavorite ? <HeartFilledIcon className="size-5 text-destructive" /> : <HeartIcon className="size-5" />
        }
        onClick={handleFavorite}
      >
        <span className={cn({ 'text-destructive': isFavorite })}>{isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
      </Button>
    </div>
  );
};
export default Action;

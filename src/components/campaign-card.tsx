'use client';

import { FC } from 'react';
import ICampaign from '@/types/campaign';
import Image from 'next/image';
import { cn, constants, emitter, formats } from '@/lib/utils';
import config from '@/config';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ClockIcon, DotsVerticalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { campaignsRequest } from '@/request';
import { toast } from 'sonner';
import Chip from '@/components/custom/chip';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { ECampaignStatus } from '@/types/enum';

interface CampaignCardProps {
  data: ICampaign;
  canEdit?: boolean;
  reload?: () => Promise<void>;
}

const CampaignCard: FC<CampaignCardProps> = ({ data, canEdit, reload }) => {
  const firstImage = data.images[0]?.url;
  const link = canEdit
    ? data.status === ECampaignStatus.Draft
      ? config.routes.brand.campaigns.edit(data.id, 4)
      : config.routes.brand.campaigns.tracking(data.id)
    : config.routes.campaigns.details(data.id);

  const handleDelete = (campaign: ICampaign) => () => {
    emitter.confirm({
      content: `Bạn có chắc muốn xóa chiến dịch ${campaign.name}? Bạn không thể hoàn tác sau khi thực hiện tác vụ này.`,
      callback: () =>
        campaignsRequest
          .delete(campaign.id)
          .then(() => reload?.().then(() => toast.success(`Xóa chiến dịch ${campaign.name} thành công`)))
          .catch((err) => toast.error(err?.message || constants.sthWentWrong)),
    });
  };

  return (
    <div className="relative ">
      <Link href={link} className="flex flex-col bg-background border rounded-lg shadow-md overflow-hidden">
        <div
          key={data.id}
          className={cn('relative bg-foreground overflow-hidden select-none', { 'pb-[56.25%]': !firstImage })}
        >
          {firstImage && (
            <Image
              src={firstImage}
              alt={`Ảnh về chiến dịch ${data.title}`}
              width={500}
              height={500}
              className="object-cover w-full aspect-video transition-transform hover:scale-110"
            />
          )}
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4 text-base">
            <h6 className="font-semibold truncate">{canEdit ? data.name : data.title}</h6>
            <Chip
              label={constants.campaignStatus[data.status].label}
              variant={constants.campaignStatus[data.status].color}
              size="small"
              className={cn({ 'absolute top-3 right-3': !canEdit })}
            />
          </div>
          {canEdit && <h6 className="text-sm">{data.title}</h6>}
          <div className="flex items-center gap-2">
            <ClockIcon />
            {formats.date(data.startDate)} - {formats.date(data.endDate)}
          </div>
          <div className="flex items-center gap-2">
            <FaRegMoneyBillAlt />
            {formats.price(data.budget)}
          </div>
        </div>
      </Link>
      {canEdit && [ECampaignStatus.Draft, ECampaignStatus.Published].includes(data.status) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="absolute top-4 right-4">
              <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={config.routes.brand.campaigns.edit(data.id, 1)} className="flex items-center gap-2">
                <Pencil2Icon />
                Chỉnh sửa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete(data)}>
              <span className="flex items-center gap-2">
                <TrashIcon />
                Xóa
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default CampaignCard;

import { IconType } from 'react-icons/lib';
import { RiInstagramFill, RiTiktokFill, RiYoutubeFill } from 'react-icons/ri';

export enum EPlatform {
  TitTok = 1,
  Instagram,
  YouTube,
}

export enum EContentType {
  TikTokPost = EPlatform.TitTok * 10,
  TikTokStory,
  TikTokLive,
  InstagramFeedPost = EPlatform.Instagram * 10,
  InstagramReel,
  InstagramStory,
  InstagramLive,
  YouTubeVideo = EPlatform.YouTube * 10,
  YouTubeShort,
  YouTubeLive,
}

interface IPlatformDetail {
  name: string;
  Icon: IconType;
  logo: string;
  url: string;
  followerText: string;
  contentTypes: Record<number, string>;
}

type IPlatformData = Record<EPlatform, IPlatformDetail>;

export const PlatformData: IPlatformData = {
  [EPlatform.TitTok]: {
    name: 'TikTok',
    Icon: RiTiktokFill,
    logo: '/assets/img/tiktok.png',
    url: 'https://www.tiktok.com/@',
    followerText: 'người theo dõi',
    contentTypes: {
      [EContentType.TikTokPost]: 'bài đăng TikTok',
      [EContentType.TikTokStory]: 'tin TikTok',
      [EContentType.TikTokLive]: 'livestream TikTok',
    },
  },
  [EPlatform.Instagram]: {
    name: 'Instagram',
    Icon: RiInstagramFill,
    logo: '/assets/img/instagram.png',
    url: 'https://www.instagram.com/',
    followerText: 'người theo dõi',
    contentTypes: {
      [EContentType.InstagramFeedPost]: 'bài đăng ảnh Instagram',
      [EContentType.InstagramReel]: 'thước phim Instagram',
      [EContentType.InstagramStory]: 'tin Instagram',
      [EContentType.InstagramLive]: 'livestream Instagram',
    },
  },
  [EPlatform.YouTube]: {
    name: 'YouTube',
    Icon: RiYoutubeFill,
    logo: '/assets/img/youtube.png',
    url: 'https://www.youtube.com/',
    followerText: 'người đăng ký',
    contentTypes: {
      [EContentType.YouTubeVideo]: 'video YouTube',
      [EContentType.YouTubeShort]: 'video short YouTube',
      [EContentType.YouTubeLive]: 'livestream YouTube',
    },
  },
};

export enum ERole {
  Admin = 1,
  Influencer,
  Brand,
}

export enum EGender {
  Male = 1,
  Female,
  Others,
}

export enum EVerifyAction {
  Register = 1,
  ChangePass,
  ForgotPassword,
}

export enum ECampaignStatus {
  Draft,
  Published,
  Active,
  Completed,
  Expired,
}

export enum EJobStatus {
  Pending, // Offer đang được xem xét
  InProgress, // Job đang được thực hiện
  Completed, // Job đã hoàn thành
  Failed, // Job thất bại
  NotCreated, // Job không thành công do không có offer nào được đồng ý
}

export enum EOfferStatus {
  //[Description("Đang chờ xử lý")] // Offering
  Offering, // Offer đã được gửi và đang chờ xử lý
  //[Description("Từ chối")] // Rejected
  Rejected, // Offer đã bị từ chối và không có re-offer
  //[Description("Chấp thuận")] // WaitingPayment
  WaitingPayment, // Offer đã được chấp nhận và đang đợi Brand thanh toán
  //[Description("Đã hủy")] // Cancelled
  Cancelled, // Offer đã được chấp nhận nhưng Brand từ chối thanh toán
  //[Description("Đã hết hạn")] // Expired
  Expired, // Offer đã hết hạn khi không có sự thỏa thuận giữa hai bên (> 10 ngày)
  //[Description("Đã thanh toán")] // Done
  Done, // Offer đã được Brand thanh toán thành công
}

export enum FluctuationType {
  ASC = 1,
  DESC,
}

export enum NumberType {
  Currency = 1,
  Quantity,
}

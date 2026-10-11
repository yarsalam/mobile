export interface GroupedMessageDto {
  userId: number;
  name: string;
  avatar?: string;
  lastMessageSnippet: string;
  lastMessageDate: string;
  lastMessageTime: string;
  isFree: boolean;
  unread: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
  adminBlocked: boolean;
  resigned: boolean;
  isBlocked:boolean;
  isSuspended:boolean;
  isResigned:boolean;
  isAdminBlocked:boolean;
  lastFreeMessageDate:string;
  lastFreeMessageTime:string;
  lastPaidMessageDate:string;
  lastPaidMessageTime:string;
  unreadFreeMessagesCount:number;
  unreadPaidMessagesCount:number;
}

export type AlertType = {
  alertId: string;
  content: string;
  mentionNickname: string;
  type: string;
  urlPath: string;
  createdAt: string;
};

export type AlertDataType = {
  nickname: string;
  alertId?: string;
  page?: number;
  size?: number;
  selectedAlertList?: Array<string>;
};

export type AlertCreateType = {
  mentionNickname: string;
  content?: string;
  urlPath: string;
  type: string;
  createdAt: string;
  isRead: boolean;
};

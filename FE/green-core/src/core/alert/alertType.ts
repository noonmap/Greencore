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
	nickname: string;
	mentionNickname: string;
	content?: string;
	urlPath: string;
	type: string;
	createdAt: string;
	isRead: boolean;
};

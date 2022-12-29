export type User = {
	id: string
	name: string
	revenue_goal: number
	sla_goal: number
	studies_goal: number
	subspecialty_body_part: BODY_PART
	subspecialty_modality: MODALITY
}

export enum BODY_PART {
	ABDOMEN = 'ABDOMEN',
	ANKLE = 'ANKLE',
	ARM = 'ARM',
	BACK = 'BACK',
	BREAST = 'BREAST',
	CHEST = 'CHEST',
	FOOT = 'FOOT',
	HAND = 'HAND',
	HEAD = 'HEAD',
	HIP = 'HIP',
	KNEE = 'KNEE',
	LEG = 'LEG',
	NECK = 'NECK',
	SHOULDER = 'SHOULDER',
	SPINE = 'SPINE',
	UTERUS = 'UTERUS',
	WHOLEBODY = 'WHOLEBODY',
	WRIST = 'WRIST',
}


export enum MODALITY {
	CR = 'CR',
	CT = 'CT',
	DX = 'DX',
	ECG = 'ECG',
	MG = 'MG',
	MR = 'MR',
	NM = 'NM',
	PET = 'PET',
	RF = 'RF',
	SC = 'SC',
	US = 'US',
	XA = 'XA',
}

export type Study = {
	id: string
	assigned_to: string[]
	date: string
	revenue?: number
	modality: MODALITY
	body_part: BODY_PART
	sla?: number
}
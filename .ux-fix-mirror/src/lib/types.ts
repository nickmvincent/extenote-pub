export interface MarkdownEntry<T extends Record<string, unknown> = Record<string, unknown>> {
	slug: string;
	collection: string;
	metadata: T & Record<string, unknown>;
	body: string;
}

export interface PersonalInfo extends Record<string, unknown> {
	title?: string;
	position?: string;
	department?: string;
	university?: string;
	email?: string;
	quick_bio?: string;
	highlights?: string[];
	date_updated?: string;
	profile_pic?: string;
	cv_link?: string;
	cv_html_link?: string;
}

export interface CvData {
	appointments: MarkdownEntry[];
	education: MarkdownEntry[];
	peerReviewedPubs: MarkdownEntry[];
	workshopPubs: MarkdownEntry[];
	otherPubs: MarkdownEntry[];
	grants: MarkdownEntry[];
	awards: MarkdownEntry[];
	teaching: MarkdownEntry[];
	industryExperience: MarkdownEntry[];
	mentees: MarkdownEntry[];
	reviewingSummary: Record<string, unknown> | null;
	serviceItems: MarkdownEntry[];
	talks: MarkdownEntry[];
	newsCoverage: MarkdownEntry[];
	editorial: MarkdownEntry[];
}

export interface SiteData {
	personalInfo: PersonalInfo;
	scholarly: MarkdownEntry[];
	editorial: MarkdownEntry[];
	blogs: MarkdownEntry[];
	talks: MarkdownEntry[];
	newsCoverage: MarkdownEntry[];
	cv: CvData;
}

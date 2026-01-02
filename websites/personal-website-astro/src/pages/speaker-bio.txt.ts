import type { APIRoute } from 'astro';
import { getSiteData } from '../lib/contentLoader';

export const prerender = true;

export const GET: APIRoute = async () => {
	const { personalInfo } = await getSiteData();
	const lines: string[] = [];

	if (personalInfo.title) {
		lines.push(String(personalInfo.title));
	}

	const roleParts = [
		personalInfo.position,
		personalInfo.department,
		personalInfo.university
	]
		.filter(Boolean)
		.map((part) => String(part));

	if (roleParts.length) {
		lines.push(roleParts.join(', '));
	}

	lines.push('');

	const extendedBio =
		typeof personalInfo.additional_background === 'string' && personalInfo.additional_background.length
			? personalInfo.additional_background
			: typeof personalInfo.quick_bio === 'string'
				? personalInfo.quick_bio
				: '';

	if (extendedBio) {
		lines.push(extendedBio);
	}

	if (personalInfo.email) {
		lines.push('', `Contact: ${personalInfo.email}`);
	}

	const body = lines.join('\n').trim();

	return new Response(body || 'Speaker bio unavailable.', {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

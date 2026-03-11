const defaultMonthYear = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short' });
const defaultYear = new Intl.DateTimeFormat('en', { year: 'numeric' });

function toDate(value?: unknown): Date | null {
	if (!value) return null;
	if (value instanceof Date) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) {
			return parsed;
		}
	}
	return null;
}

export function formatMonthYear(value?: unknown): string {
	const date = toDate(value);
	return date ? defaultMonthYear.format(date) : '';
}

export function formatYear(value?: unknown): string {
	const date = toDate(value);
	return date ? defaultYear.format(date) : '';
}

export function formatYearRange(start?: unknown, end?: unknown): string {
	const startYear = formatYear(start);
	const endYear = formatYear(end);

	if (startYear && endYear && startYear !== endYear) {
		return `${startYear}–${endYear}`;
	}

	return startYear || endYear || '';
}

export function truncateText(text: string, length: number): string {
	if (!text) return '';
	if (text.length <= length) return text;
	return `${text.slice(0, length - 1)}…`;
}

export function sortByDateDescending<T extends Record<string, any>>(items: T[], fields: string | string[]): T[] {
	const fieldList = Array.isArray(fields) ? fields : [fields];
	return [...items].sort((a, b) => {
		const dateA = fieldList.map((field) => toDate(a?.metadata?.[field])).find(Boolean);
		const dateB = fieldList.map((field) => toDate(b?.metadata?.[field])).find(Boolean);
		const valueA = dateA ? dateA.getTime() : -Infinity;
		const valueB = dateB ? dateB.getTime() : -Infinity;
		return valueB - valueA;
	});
}

import { PRIVATE_API_KEY } from '$env/static/private';
import { PUBLIC_API } from '$env/static/public';
import type { Stats } from '$lib/types/stats';

export const load = async ({}) => {
	const stats: Stats = await fetch(PUBLIC_API, {
		headers: {
			Authorization: PRIVATE_API_KEY,
			'Content-Type': 'application/json'
		}
	}).then((_) => _.json());
	return { stats };
};

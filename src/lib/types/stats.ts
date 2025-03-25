type Overview = {
	totalSavings: number;
	currentMonthSavings: number;
	percentageChange: number;
};

type SavingsTrend = {
	month: string;
	savings: number;
};

type SavingsByCategory = {
	service: string;
	savings: number;
};

type DetailedSaving = {
	date: string;
	service: string;
	amount: number;
};

export type Stats = {
	overview: Overview;
	savingsTrends: SavingsTrend[];
	savingsByCategory: SavingsByCategory[];
	detailedSavings: DetailedSaving[];
};

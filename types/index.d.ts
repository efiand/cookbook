import { PrismaClient } from '@prisma/client/edge';

declare module globalThis {
	let prisma: PrismaClient | null;
}
declare module 'bcrypt-ts';

declare global {
	type navType = 'breadcrumbs' | 'categories';
	type pageName = 'categories' | 'index' | 'structures';
	type flaggedMethod = (load: boolean) => void;
	type StatusCode = typeof StatusCodes[keyof typeof StatusCodes];

	interface Entity {
		id: number;
		title: string;
	}

	interface RecipeContent {
		ingredients?: string;
		method?: string;
		url?: null | string;
	}

	interface Recipe extends Entity, RecipeContent {
		images: Image[];
		structureId: null | number;
	}

	interface Image {
		filename: string;
		sortOrder: null | number;
	}

	interface RecipeCategory {
		categoryId: number;
		recipeId: number;
	}

	interface Structure extends Entity {
		parentId: null | number;
	}

	interface AppData {
		authorized: boolean;
		categories: Entity[];
		recipes: Recipe[];
		recipesCategories: RecipeCategory[];
		structures: Structure[];
	}

	interface PageData {
		description?: string;
		heading?: string;
		image?: string;
		title?: string;
	}

	interface Link {
		href: string;
		title: string;
	}

	interface ExtendedLink extends Link {
		additionals?: ExtendedLink[];
		children?: ExtendedLink[];
	}

	interface AppError {
		message?: string;
		statusCode?: number;
	}

	interface FieldBindingObject<TValue = any> {
		checked?: boolean;
		value?: TValue;
	}

	interface AuthData {
		login: string;
		password: string;
	}
}

export {};

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: number;
			ENV: "development" | "production";
			MONGO_USERNAME: string;
			MONGO_PASSWORD: string;
			MONGO_REMOTE_URL: string;
		}
	}
}

export function getDate() {
	return new Date().toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

export function getDay() {
	return new Date().toLocaleDateString("en-IN", { weekday: "long" });
}

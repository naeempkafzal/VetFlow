CREATE TABLE `animals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`ownerName` text NOT NULL,
	`species` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`animalId` integer NOT NULL,
	`ownerName` text NOT NULL,
	`dateTime` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'Scheduled' NOT NULL
);

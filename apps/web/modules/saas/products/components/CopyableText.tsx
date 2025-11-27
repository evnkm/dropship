"use client";

import { cn } from "@ui/lib";
import { Button } from "@ui/components/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export interface CopyableTextProps {
	text: string;
	label?: string;
	className?: string;
	variant?: "default" | "compact";
}

export function CopyableText({
	text,
	label,
	className,
	variant = "default",
}: CopyableTextProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text:", err);
		}
	};

	if (variant === "compact") {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<span className="flex-1 truncate text-sm">{text}</span>
				<Button
					variant="ghost"
					size="icon"
					className="size-8 shrink-0"
					onClick={handleCopy}
				>
					{copied ? (
						<CheckIcon className="size-4 text-emerald-500" />
					) : (
						<CopyIcon className="size-4" />
					)}
				</Button>
			</div>
		);
	}

	return (
		<div className={cn("rounded-lg border bg-muted/50 p-4", className)}>
			{label && (
				<div className="mb-2 flex items-center justify-between">
					<span className="font-medium text-muted-foreground text-sm">
						{label}
					</span>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 gap-2"
						onClick={handleCopy}
					>
						{copied ? (
							<>
								<CheckIcon className="size-4 text-emerald-500" />
								<span className="text-emerald-500">Copied!</span>
							</>
						) : (
							<>
								<CopyIcon className="size-4" />
								<span>Copy</span>
							</>
						)}
					</Button>
				</div>
			)}
			<p className="whitespace-pre-wrap text-sm">{text}</p>
			{!label && (
				<div className="mt-3 flex justify-end">
					<Button
						variant="outline"
						size="sm"
						className="h-8 gap-2"
						onClick={handleCopy}
					>
						{copied ? (
							<>
								<CheckIcon className="size-4 text-emerald-500" />
								<span className="text-emerald-500">Copied!</span>
							</>
						) : (
							<>
								<CopyIcon className="size-4" />
								<span>Copy</span>
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}

export function CopyableAdCopy({
	headline,
	primaryText,
	description,
	callToAction,
	className,
}: {
	headline: string;
	primaryText: string;
	description: string;
	callToAction: string;
	className?: string;
}) {
	const fullText = `Headline: ${headline}\n\nPrimary Text: ${primaryText}\n\nDescription: ${description}\n\nCTA: ${callToAction}`;

	return (
		<div className={cn("space-y-3", className)}>
			<CopyableText text={headline} label="Headline" />
			<CopyableText text={primaryText} label="Primary Text" />
			<CopyableText text={description} label="Description" />
			<CopyableText text={callToAction} label="Call to Action" />
			<div className="pt-2">
				<CopyableText text={fullText} label="Copy All" />
			</div>
		</div>
	);
}

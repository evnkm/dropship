"use client";

import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { CheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

export interface UpgradeModalProps {
	isOpen: boolean;
	onClose: () => void;
	feature: string;
	requiredTier: "STARTER" | "PRO" | "AGENCY";
	currentTier?: "FREE" | "STARTER" | "PRO" | "AGENCY";
}

const TIER_FEATURES = {
	STARTER: [
		"Access to top 50 products per day",
		"View all product scores",
		"Image ad creatives",
		"Basic analytics",
	],
	PRO: [
		"Unlimited product access",
		"All ad creatives including video scripts",
		"Advanced trend analytics",
		"Score history tracking",
		"Email alerts for hot products",
	],
	AGENCY: [
		"Everything in PRO",
		"Multi-user access",
		"API access",
		"Priority support",
		"Custom integrations",
	],
};

const TIER_PRICES = {
	STARTER: 49,
	PRO: 99,
	AGENCY: 249,
};

export function UpgradeModal({
	isOpen,
	onClose,
	feature,
	requiredTier,
	currentTier: _currentTier = "FREE",
}: UpgradeModalProps) {
	void _currentTier;
	const features = TIER_FEATURES[requiredTier];
	const price = TIER_PRICES[requiredTier];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
						<SparklesIcon className="size-6 text-primary" />
					</div>
					<DialogTitle className="text-center">
						Upgrade to {requiredTier}
					</DialogTitle>
					<DialogDescription className="text-center">
						{feature} requires a {requiredTier} subscription or higher.
					</DialogDescription>
				</DialogHeader>

				<div className="my-4 rounded-lg border bg-muted/50 p-4">
					<div className="mb-4 text-center">
						<span className="font-bold text-3xl">${price}</span>
						<span className="text-muted-foreground">/month</span>
					</div>
					<ul className="space-y-2">
						{features.map((feature, index) => (
							<li key={index} className="flex items-start gap-2">
								<CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
								<span className="text-sm">{feature}</span>
							</li>
						))}
					</ul>
				</div>

				<DialogFooter className="flex-col gap-2 sm:flex-col">
					<Button asChild className="w-full">
						<Link href="/choose-plan">Upgrade Now</Link>
					</Button>
					<Button variant="ghost" className="w-full" onClick={onClose}>
						Maybe Later
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function useUpgradeModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [modalProps, setModalProps] = useState<{
		feature: string;
		requiredTier: "STARTER" | "PRO" | "AGENCY";
	}>({
		feature: "",
		requiredTier: "STARTER",
	});

	const showUpgradeModal = (
		feature: string,
		requiredTier: "STARTER" | "PRO" | "AGENCY",
	) => {
		setModalProps({ feature, requiredTier });
		setIsOpen(true);
	};

	const closeUpgradeModal = () => {
		setIsOpen(false);
	};

	return {
		isOpen,
		modalProps,
		showUpgradeModal,
		closeUpgradeModal,
	};
}

import { useState } from "react";

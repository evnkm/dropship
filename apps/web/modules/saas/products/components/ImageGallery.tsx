"use client";

import { cn } from "@ui/lib";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@ui/components/dialog";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ImageGalleryProps {
	images: string[];
	alt?: string;
	className?: string;
}

export function ImageGallery({ images, alt = "Product image", className }: ImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	if (images.length === 0) {
		return (
			<div className={cn("aspect-square rounded-lg bg-muted flex items-center justify-center", className)}>
				<span className="text-muted-foreground">No images available</span>
			</div>
		);
	}

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleDownload = async (url: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = `product-image-${selectedIndex + 1}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (err) {
			console.error("Failed to download image:", err);
		}
	};

	return (
		<div className={cn("space-y-3", className)}>
			<button
				type="button"
				className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted"
				onClick={() => setIsLightboxOpen(true)}
			>
				<Image
					src={images[selectedIndex]}
					alt={`${alt} ${selectedIndex + 1}`}
					fill
					className="object-cover transition-transform hover:scale-105"
				/>
				{images.length > 1 && (
					<>
						<Button
							variant="secondary"
							size="icon"
							className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 backdrop-blur-sm"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 backdrop-blur-sm"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</>
				)}
				<div className="absolute bottom-2 right-2">
					<Button
						variant="secondary"
						size="icon"
						className="size-8 rounded-full bg-background/80 backdrop-blur-sm"
						onClick={(e) => {
							e.stopPropagation();
							handleDownload(images[selectedIndex]);
						}}
					>
						<DownloadIcon className="size-4" />
					</Button>
				</div>
			</button>

			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{images.map((image, index) => (
						<button
							key={index}
							type="button"
							className={cn(
								"relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
								index === selectedIndex
									? "border-primary"
									: "border-transparent opacity-60 hover:opacity-100",
							)}
							onClick={() => setSelectedIndex(index)}
						>
							<Image
								src={image}
								alt={`${alt} thumbnail ${index + 1}`}
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			)}

			<Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
				<DialogContent className="max-w-4xl p-0 bg-black/95">
					<DialogTitle className="sr-only">Image Gallery</DialogTitle>
					<div className="relative aspect-square">
						<Image
							src={images[selectedIndex]}
							alt={`${alt} ${selectedIndex + 1}`}
							fill
							className="object-contain"
						/>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 text-white hover:bg-white/20"
							onClick={() => setIsLightboxOpen(false)}
						>
							<XIcon className="size-6" />
						</Button>
						{images.length > 1 && (
							<>
								<Button
									variant="ghost"
									size="icon"
									className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
									onClick={handlePrevious}
								>
									<ChevronLeftIcon className="size-8" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
									onClick={handleNext}
								>
									<ChevronRightIcon className="size-8" />
								</Button>
							</>
						)}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
							<span className="text-white text-sm">
								{selectedIndex + 1} / {images.length}
							</span>
							<Button
								variant="secondary"
								size="sm"
								className="gap-2"
								onClick={() => handleDownload(images[selectedIndex])}
							>
								<DownloadIcon className="size-4" />
								Download
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

"use client";

import { useState } from "react";
import { Plus, Megaphone, Calendar, Target, Percent } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

export default function AnnouncementsPage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	// Fetch announcements data (admin only)
	const {
		data: announcements = [],
		isLoading,
		refetch,
	} = api.announcement.getAll.useQuery();
	const { data: activeAnnouncement } = api.announcement.getActive.useQuery();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-muted-foreground">
					Loading announcements...
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
					<p className="text-muted-foreground">
						Manage promotional campaigns and discount announcements.
					</p>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create Announcement
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Create New Announcement</DialogTitle>
						</DialogHeader>
						<AnnouncementForm
							onSuccess={() => {
								setIsCreateDialogOpen(false);
								refetch();
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Active Announcement Alert */}
			{activeAnnouncement && (
				<Card className="border-green-200 bg-green-50">
					<CardHeader>
						<CardTitle className="flex items-center text-green-800">
							<Megaphone className="mr-2 h-5 w-5" />
							Currently Active Announcement
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<h3 className="font-semibold text-green-900">
								{activeAnnouncement.title}
							</h3>
							<p className="text-green-700">{activeAnnouncement.message}</p>
							<div className="flex items-center space-x-4 text-sm text-green-600">
								<div className="flex items-center">
									<Percent className="mr-1 h-4 w-4" />
									{activeAnnouncement.discountValue}
									{activeAnnouncement.discountType === "percentage"
										? "%"
										: " CFA"}{" "}
									off
								</div>
								<div className="flex items-center">
									<Target className="mr-1 h-4 w-4" />
									{activeAnnouncement.scope} scope
								</div>
								<div className="flex items-center">
									<Calendar className="mr-1 h-4 w-4" />
									Until{" "}
									{new Date(activeAnnouncement.endDate).toLocaleDateString()}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Announcements List */}
			<div className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>All Announcements ({announcements.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{announcements.length === 0 ? (
							<div className="text-center py-8">
								<Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-medium">
									No announcements created
								</h3>
								<p className="text-muted-foreground">
									Create your first announcement to start promoting sales and
									discounts.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{announcements.map((announcement) => {
									const isActive = announcement.id === activeAnnouncement?.id;
									const isExpired = new Date(announcement.endDate) < new Date();
									const isScheduled =
										new Date(announcement.startDate) > new Date();

									return (
										<div
											key={announcement.id}
											className={`p-4 border rounded-lg ${
												isActive ? "border-green-200 bg-green-50" : ""
											}`}
										>
											<div className="flex items-start justify-between">
												<div className="space-y-2 flex-1">
													<div className="flex items-center space-x-2">
														<h3 className="font-semibold">
															{announcement.title}
														</h3>
														{isActive && (
															<Badge variant="default" className="bg-green-600">
																Active
															</Badge>
														)}
														{isExpired && (
															<Badge variant="secondary">Expired</Badge>
														)}
														{isScheduled && (
															<Badge variant="outline">Scheduled</Badge>
														)}
														<Badge
															variant={
																announcement.type === "sale"
																	? "destructive"
																	: "secondary"
															}
														>
															{announcement.type}
														</Badge>
													</div>

													<p className="text-muted-foreground">
														{announcement.message}
													</p>

													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<div className="flex items-center">
															<Percent className="mr-1 h-4 w-4" />
															{announcement.discountValue}
															{announcement.discountType === "percentage"
																? "%"
																: " CFA"}{" "}
															discount
														</div>
														<div className="flex items-center">
															<Target className="mr-1 h-4 w-4" />
															{announcement.scope} scope
														</div>
														<div className="flex items-center">
															<Calendar className="mr-1 h-4 w-4" />
															{new Date(
																announcement.startDate,
															).toLocaleDateString()}{" "}
															-{" "}
															{new Date(
																announcement.endDate,
															).toLocaleDateString()}
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-2 ml-4">
													<div className="text-sm font-medium text-muted-foreground">
														Priority: {announcement.priority}
													</div>
													<Button variant="ghost" size="sm">
														Edit
													</Button>
													<Button variant="ghost" size="sm">
														Delete
													</Button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function AnnouncementForm({ onSuccess }: { onSuccess: () => void }) {
	const [formData, setFormData] = useState({
		title: "",
		message: "",
		type: "sale" as "sale" | "promotion" | "info" | "warning",
		discountType: "percentage" as "percentage" | "fixed",
		discountValue: "",
		scope: "global" as "global" | "category" | "product",
		startDate: "",
		endDate: "",
		priority: "10",
	});

	const createMutation = api.announcement.create.useMutation({
		onSuccess: () => {
			onSuccess();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		createMutation.mutate({
			title: formData.title,
			message: formData.message,
			type: formData.type,
			discountType: formData.discountType,
			discountValue: Number(formData.discountValue),
			scope: formData.scope,
			startDate: new Date(formData.startDate),
			endDate: new Date(formData.endDate),
			priority: Number(formData.priority),
			isActive: true,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="Black Friday Sale"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="type">Type</Label>
					<Select
						value={formData.type}
						onValueChange={(value: any) =>
							setFormData({ ...formData, type: value })
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="sale">Sale</SelectItem>
							<SelectItem value="promotion">Promotion</SelectItem>
							<SelectItem value="info">Info</SelectItem>
							<SelectItem value="warning">Warning</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="message">Message</Label>
				<Textarea
					id="message"
					value={formData.message}
					onChange={(e) =>
						setFormData({ ...formData, message: e.target.value })
					}
					placeholder="Special discount for our customers!"
					rows={3}
					required
				/>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="discountType">Discount Type</Label>
					<Select
						value={formData.discountType}
						onValueChange={(value: any) =>
							setFormData({ ...formData, discountType: value })
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="percentage">Percentage (%)</SelectItem>
							<SelectItem value="fixed">Fixed Amount (CFA)</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="discountValue">
						Discount Value{" "}
						{formData.discountType === "percentage" ? "(%)" : "(CFA)"}
					</Label>
					<Input
						id="discountValue"
						type="number"
						value={formData.discountValue}
						onChange={(e) =>
							setFormData({ ...formData, discountValue: e.target.value })
						}
						placeholder="20"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="scope">Scope</Label>
					<Select
						value={formData.scope}
						onValueChange={(value: any) =>
							setFormData({ ...formData, scope: value })
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select scope" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="global">Global (All Products)</SelectItem>
							<SelectItem value="category">Category Specific</SelectItem>
							<SelectItem value="product">Product Specific</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="startDate">Start Date</Label>
					<Input
						id="startDate"
						type="datetime-local"
						value={formData.startDate}
						onChange={(e) =>
							setFormData({ ...formData, startDate: e.target.value })
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="endDate">End Date</Label>
					<Input
						id="endDate"
						type="datetime-local"
						value={formData.endDate}
						onChange={(e) =>
							setFormData({ ...formData, endDate: e.target.value })
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="priority">Priority</Label>
					<Input
						id="priority"
						type="number"
						value={formData.priority}
						onChange={(e) =>
							setFormData({ ...formData, priority: e.target.value })
						}
						placeholder="10"
						min="0"
						max="100"
						required
					/>
				</div>
			</div>

			<div className="flex justify-end space-x-2 pt-4">
				<Button type="button" variant="outline" onClick={onSuccess}>
					Cancel
				</Button>
				<Button type="submit" disabled={createMutation.isPending}>
					{createMutation.isPending ? "Creating..." : "Create Announcement"}
				</Button>
			</div>
		</form>
	);
}

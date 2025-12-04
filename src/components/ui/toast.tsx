import * as React from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

export interface ToastProps {
	title?: string;
	description?: string;
	variant?: "default" | "destructive";
	onClose?: () => void;
}

export function Toast({
	title,
	description,
	variant = "default",
	onClose,
}: ToastProps) {
	return (
		<div
			className={cn(
				"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
				variant === "destructive"
					? "border-destructive bg-destructive text-destructive-foreground"
					: "border bg-background text-foreground",
			)}
		>
			<div className="grid gap-1">
				{title && <div className="text-sm font-semibold">{title}</div>}
				{description && <div className="text-sm opacity-90">{description}</div>}
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>
			)}
		</div>
	);
}

export function useToast() {
	const [toasts, setToasts] = React.useState<
		Array<ToastProps & { id: string }>
	>([]);

	const toast = React.useCallback((props: ToastProps) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((toasts) => [...toasts, { ...props, id }]);

		// Auto remove after 5 seconds
		setTimeout(() => {
			setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
		}, 5000);
	}, []);

	const removeToast = React.useCallback((id: string) => {
		setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
	}, []);

	return {
		toast,
		toasts,
		removeToast,
	};
}

export function ToastContainer() {
	const { toasts, removeToast } = useToast();

	return (
		<div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					{...toast}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</div>
	);
}

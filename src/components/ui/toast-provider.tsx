"use client";

import * as React from "react";
import { Toast, type ToastProps } from "./toast";

interface ToastContextType {
	toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
	undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
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

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						{...toast}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = React.useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={clsx(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                {
                    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
                    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
                    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
                    'bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-500': variant === 'warning',
                    'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500': variant === 'info',
                    'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500': variant === 'success',
                    'px-2.5 py-1.5 text-sm': size === 'sm',
                    'px-4 py-2 text-base': size === 'md',
                    'px-6 py-3 text-lg': size === 'lg',
                    'opacity-50 cursor-not-allowed': disabled || isLoading,
                },
                className,
            )}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;

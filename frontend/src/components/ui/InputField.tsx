import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    placeholder?: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select';
    options?: { label: string; value: string }[];
    rows?: number;
}

const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputFieldProps>(
    ({ className, label, placeholder, error, type = 'text', options, rows = 4, ...props }, ref) => {
        const inputClasses = clsx(
            'mt-1 py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400 ',
            error && 'border-red-500',
            className,
        );

        const renderInput = () => {
            switch (type) {
                case 'textarea':
                    return <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} className={inputClasses} placeholder={placeholder} rows={rows} {...props} />;
                case 'select':
                    return (
                        <select ref={ref as React.RefObject<HTMLSelectElement>} className={inputClasses} {...props}>
                            {options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    );
                default:
                    return <input ref={ref as React.RefObject<HTMLInputElement>} type={type} placeholder={placeholder} className={inputClasses} {...props} />;
            }
        };

        return (
            <div>
                {label && <label className="block text-sm font-medium text-gray-800">{label}</label>}
                {renderInput()}
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    },
);

InputField.displayName = 'InputField';

export default InputField;

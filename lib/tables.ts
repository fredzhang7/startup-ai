
// Usage example in ../NavBar/NavBar.tsx
const buttonClasses: { [key: string]: string } = {
    primary: 'text-white bg-blue-500',
    secondary: 'text-blue-500 bg-white',
    ghost: 'text-blue-500 bg-transparent',
    danger: 'text-white bg-red-500',
    warning: 'text-white bg-yellow-500',
    success: 'text-white bg-green-500',
    info: 'text-white bg-indigo-500',
    light: 'text-gray-700 bg-gray-100',
    dark: 'text-white bg-gray-800'
};

const sizeClasses: { [key: string]: string } = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
};

export { buttonClasses, sizeClasses }
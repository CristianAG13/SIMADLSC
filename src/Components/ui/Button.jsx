// src/components/ui/button.jsx
export const Button = ({ children, className = '', ...props }) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
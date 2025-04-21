export const Preloader = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center 
    bg-lapis_lazuli-900/80 dark:bg-gray-900/80 backdrop-blur-sm
    transition-opacity duration-500">
        <div className="animate-spin-fast">
            <svg className="w-16 h-16" viewBox="0 0 50 50">
                <circle
                    className="stroke-verdigris-400"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="1, 200"
                />
            </svg>
        </div>
    </div>
)
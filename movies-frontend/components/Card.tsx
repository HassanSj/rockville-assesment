export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
}

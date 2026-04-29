const QuickAction = ({ title, icon }) => {
  return (
    <button className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:shadow-md hover:border-blue-400">
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-gray-700">{title}</span>
    </button>
  )
}

export default QuickAction;
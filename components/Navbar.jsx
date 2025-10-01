import { FileKey2 } from "lucide-react"
const Navbar = () => {
  return (
    <div className="pt-4 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold flex flex-col">
          I-Todos
          <span className="text-sm sm:text-lg font-normal text-gray-600">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </h1>
        <FileKey2 size={28} className="sm:w-9 sm:h-9" />
      </div>
    </div>
  )
}

export default Navbar



const Navbar = () => {
    
    return (
        <div className="bg-gray-900 text-white py-6 flex justify-between items-center ">
            <h1 className="text-xl font-bold">AI Event Planner</h1>

            <button className="bg-green-500 px-4 py-2 cursor-pointer rounded hover:bg-green-600">
                Create Event 
            </button>
        </div> 
    )
}

export default Navbar; 
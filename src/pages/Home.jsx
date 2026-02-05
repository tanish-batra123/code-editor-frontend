import { useState } from "react";
import {v4 as v4uuid } from "uuid"
import toast from "react-hot-toast"
import { useNavigate } from "react-router";
export const Home = () => {
  const [input, setInput] = useState({
    roomId: "",
    userName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createnewRoom=()=>{
    const id=v4uuid();
    console.log(id)
    setInput((prev)=>({
      ...prev,
      roomId:id
    }))
    toast.success("created a new room")

  }
  const navigate=useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!input.roomId || !input.userName){
      toast.error("room id and username required")
    }else{
    console.log(input);
    navigate(`/editor/${input.roomId}`,{
     state:{
      userName:input.userName
     }
    });
     
    setInput({ roomId: "", userName: "" });
    }
  };

  const handleInputEnter=(e)=>{
    if(e.code==='Enter'){
      handleSubmit();
    }

  }

  

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      
      
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-slate-700 p-6 rounded-2xl w-[350px] bg-slate-800 shadow-lg">
          <div className="flex justify-center mb-4">
            <img
              src="/code-sync.png"
              alt="Code Sync Logo"
              className="h-30 w-50 object-contain"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white text-lg font-semibold text-center">
              Paste Invitation ROOM ID
            </h4>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="ROOM ID"
                className="bg-slate-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={input.roomId}
                name="roomId"
                onChange={handleChange}
                onKeyUp={handleInputEnter}
               
              />

              <input
                type="text"
                placeholder="USERNAME"
                className="bg-slate-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                value={input.userName}
                name="userName"
                onChange={handleChange}
                onKeyUp={handleInputEnter}
                
              />

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
              >
                Join Room
              </button>
            </form>

            <p className="text-slate-400 text-sm text-center">
              Don’t have an invite?{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline" onClick={createnewRoom}>
                Create new room
              </span>
            </p>
          </div>
        </div>
      </div>

    
      <footer className="text-center text-slate-400 text-sm py-3">
        created with ❤️ by <span className="text-white">Tanish Batra</span>
      </footer>
    </div>
  );
};

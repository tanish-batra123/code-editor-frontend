import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { Editor } from "../components/Editor";
import { initSocket } from "../socket.js";
import { Actions } from "../../action";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

export const EditorPage = () => {
  const codeRef = useRef("");

  const socketref = useRef(null);
  const location = useLocation();
  const Reactnavigate = useNavigate();
  const { roomId } = useParams();

  const [client, setClient] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketref.current = await initSocket();
      socketref.current.on("connect_error", (err) => {
        handleErrors(err);
      });
      socketref.current.on("connect_failed", (err) => {
        handleErrors(err);
      });

      function handleErrors(e) {
        console.log("socket_error", e);
        toast.error("socket connection failed try again later");
        Reactnavigate("/");
      }

      socketref.current.emit(Actions.JOIN, {
        roomId,
        userName: location.state?.userName,
      });

      //listening for joined event
      socketref.current.on(
        Actions.JOINED,
        ({ clients, userName, socketId }) => {
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room`);
            console.log(`${userName} joined`);
          }
          setClient(clients);

          if (socketId !== socketref.current.id) {
            socketref.current.emit(Actions.SYNC_CODE, {
              socketId,
              code: codeRef.current,
            });
          }
        },
      );

      // listening for disconnected
      socketref.current.on(Actions.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId != socketId);
        });
      });
    };
    init();
    return () => {
      socketref.current.off(Actions.JOINED);
      socketref.current.off(Actions.DISCONNECTED);
      socketref.current.disconnect();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyIdClick = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy Room ID!");
      console.error(err);
    }
  };

  const leaveBtn = () => {
    if (socketref.current) {
      socketref.current.disconnect();
    }

    Reactnavigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <aside className="flex flex-col w-64 bg-slate-800 p-4">
        <div>
          <div className="flex justify-center mb-4">
            <img
              src="/code-sync.png"
              alt="Code Sync Logo"
              className="h-20 object-contain"
            />
          </div>

          <h3 className="text-slate-300 text-sm mb-3">Connected</h3>

          <div className="space-y-2">
            {client.map((item) => (
              <div
                key={item.socketId}
                className="flex items-center gap-2 text-white"
              >
                <div>
                  <Avatar
                    name={item.userName.toUpperCase()}
                    size={45}
                    round="20px"
                  />
                </div>

                <span className="text-sm">{item.userName}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 items-center">
          <button
            className="w-36 bg-white text-black py-1 rounded-xl cursor-pointer"
            onClick={copyIdClick}
          >
            Copy Room ID
          </button>
          <button
            className="w-36 bg-green-700 hover:bg-green-800 text-white py-1 rounded-xl cursor-pointer"
            onClick={leaveBtn}
          >
            Leave
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-slate-900">
        {
          <Editor
            socketref={socketref}
            roomId={roomId}
            onCodeChange={(code) => (codeRef.current = code)}
          />
        }
      </main>
    </div>
  );
};

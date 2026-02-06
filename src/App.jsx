import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { EditorPage } from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <>
    <div>
      <Toaster  position="top-right" toastOptions={
        {
          success:{
            iconTheme:{
              primary:"#4aed88"
            }
          }
        }
      }></Toaster>
    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

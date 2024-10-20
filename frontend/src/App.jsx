import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/client/Nav";
import {
  Footer,
  Hero,
  PopularProducts,
  Services,
  SuperQuality,
} from "./sections/client";
import Login from "./components/client/Login";
import Signup from "./components/client/Signup";
import Products from "./components/client/Products";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import VerifyEmail from './components/client/VerifyEmail';
import Dashboard from "./components/server/Dashboard"; 
import Shop from './components/client/Shop';

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer /> {/* Add ToastContainer */}
        <Routes>
          <Route path="/admin/*" element={<Dashboard />} /> {/* Admin routes */}
          <Route path="*" element={
            <>
              <Nav /> {/* Customer shop navbar */}
              <main className="relative">
                <Routes>
                  <Route path="/" element={
                    <>
                      <section className="xl:padding-l wide:padding-r padding-b">
                        <Hero />
                      </section>
                      <section className="padding mb-10"> 
                        <PopularProducts />
                      </section>
                      <section className="padding mb-10"> 
                        <SuperQuality />
                      </section>
                      <section className="padding mb-10">
                        <Services />
                      </section>
                      <Footer /> {/* Ensure footer is included */}
                    </>
                  } />
                  <Route path="/products" element={<Products />} />
                  <Route path="/login" element={<Login />}/>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<VerifyEmail />} /> 
                  <Route path="/shop" element={<Shop />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
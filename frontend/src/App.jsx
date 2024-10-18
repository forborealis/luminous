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
import Dashboard from "./components/server/Dashboard"; // Import the admin dashboard

const App = () => {
  return (
    <Router>
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
              </Routes>
            </main>
          </>
        } />
      </Routes>
    </Router>
  );
};

export default App;
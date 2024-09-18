import { Outlet } from "react-router-dom";
// import MainNav from "./MainNav";
import InnerHeading from "./InnerHeading";

function AppLayout() {
  return (
    <div>
      {/* I removed the MainNav component from here becasue I think it shouldn't be here. I will delete this later */}
      {/* <header>
        <MainNav />
      </header> */}
      <header>
        <InnerHeading />
      </header>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;

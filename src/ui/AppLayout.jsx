import { Outlet } from "react-router-dom";

import InnerHeading from "./InnerHeading";

function AppLayout() {
  return (
    <div>
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

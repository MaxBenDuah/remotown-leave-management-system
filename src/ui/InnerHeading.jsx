import { useRef, useState } from "react";
import { useUser } from "../features/users/useUser";
import { CaretDown, Notification } from "@phosphor-icons/react";
import { Tooltip } from "primereact/tooltip";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { useLogout } from "../features/users/useLogout";
import { useNavigate } from "react-router-dom";

import Notifications from "../features/employees/Notifications";

function InnerHeading() {
  const { user } = useUser();
  const { avatar, name } = user.user_metadata;
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("center");
  const menuRight = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const { mutate: logout, isError: isError2, error: error2 } = useLogout();

  const items = [
    {
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          command: () => {
            navigate("/account");
          },
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            if (isError2) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Logout failed. Please try again. - ${error2.message}`,
                life: 5000,
              });
            }
            logout();
          },
        },
      ],
    },
  ];

  function show(position) {
    setPosition(position);
    setVisible(true);
  }

  return (
    <div className="flex justify-content-between align-items-center border-bottom-1 border-300">
      <h2 className="font-medium">Dashboard</h2>
      <div>
        <div className="flex align-items-center">
          <div className="h-3rem w-3rem hover:surface-200 flex align-items-center justify-content-center border-circle transition-all transition-duration-300 transition-ease-out cursor-pointer">
            <Notification
              size={28}
              weight="light"
              onClick={() => show("top-right")}
              className="notifications"
              data-pr-tooltip="Notifications"
              data-pr-position="bottom"
            />
            <Tooltip target=".notifications" style={{ fontSize: "0.8rem" }} />
          </div>
          {visible && (
            <Notifications
              visible={visible}
              position={position}
              setVisible={setVisible}
            />
          )}

          {/* Profile picture, Name, and Caretdown */}
          <div
            className="flex align-items-center gap-2 px-4 py-2 hover:surface-200 border-round-lg transition-all transition-duration-300 transition-ease-out cursor-pointer"
            onClick={(event) => menuRight.current.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          >
            <img
              src={
                avatar
                  ? avatar
                  : "https://blocks.primereact.org/demo/images/blocks/avatars/circle-big/avatar-f-2.png"
              }
              alt=""
              className="w-3rem h-3rem border-circle"
              style={{ objectFit: "cover" }}
            />

            <div className="flex align-items-center gap-2">
              <p className="text-lg">{name}</p>
              <CaretDown size={24} weight="light" />
            </div>
          </div>
          <Menu
            model={items}
            popup
            ref={menuRight}
            id="popup_menu_right"
            popupAlignment="right"
          />
          <Toast ref={toast} />
        </div>
      </div>
    </div>
  );
}

export default InnerHeading;

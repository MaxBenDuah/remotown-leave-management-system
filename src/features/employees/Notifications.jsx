// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import NotificationItem from "./NotificationItem";
import { useGetNotifications } from "./useGetNotifications";
// import { useState } from "react";

function Notifications({ visible, setVisible }) {
  // const [visible, setVisible] = useState(false);
  // const [position, setPosition] = useState("center");
  const {
    data: notifications,
    // isLoading,
    isError,
    error,
  } = useGetNotifications();

  // const footerContent = (
  //   <div>
  //     <Button
  //       label="Cancel"
  //       icon="pi pi-times"
  //       onClick={() => setVisible(false)}
  //       className="p-button-text"
  //     />
  //     <Button
  //       label="OK"
  //       icon="pi pi-check"
  //       onClick={() => setVisible(false)}
  //       autoFocus
  //     />
  //   </div>
  // );

  // function show(position) {
  //   setPosition(position);
  //   setVisible(true);
  // }

  // if (isLoading) return <p>Loading notifications...</p>;

  if (isError) return <p>{error.message}</p>;

  // console.log(notifications);

  return (
    <div>
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-full md:w-9 lg:w-6"
        position="right"
      >
        <h2 className="mb-0 mb-2">Notifications</h2>
        <Divider type="solid" />
        {/* <div className="border-300 border-bottom-1"></div> */}
        {/* <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p> */}
        <ul className="list-none p-0">
          {notifications?.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </ul>
      </Sidebar>
      {/* <h2>Notifications</h2> */}
      {/* <Dialog
        header="Notifications"
        visible={visible}
        position={position}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
        draggable={true}
        resizable={true}
      >
      // This is not part. This is from PrimeReact
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <ul className="list-none">
          {notifications?.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </ul>
      </Dialog> */}
    </div>
  );
}

export default Notifications;

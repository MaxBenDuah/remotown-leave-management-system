import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { useGetNotifications } from "./useGetNotifications";

import NotificationItem from "./NotificationItem";

function Notifications({ visible, setVisible }) {
  const { data: notifications, isError, error } = useGetNotifications();

  if (isError) return <p>{error.message}</p>;

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
        <ul className="list-none p-0">
          {notifications?.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </ul>
      </Sidebar>
    </div>
  );
}

export default Notifications;

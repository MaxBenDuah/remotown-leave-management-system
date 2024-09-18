// import { useDeleteNotification } from "./useDeleteNotification";
import { EnvelopeOpen } from "@phosphor-icons/react";
import { useMarkNotificationAsRead } from "./useMarkNotificationAsRead";
import { Tooltip } from "primereact/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
// import { Badge } from "primereact/badge";

function NotificationItem({ notification }) {
  const {
    mutate: markNotificationAsRead,
    isPending: isUpdating,
    isError: isError2,
    error: error2,
  } = useMarkNotificationAsRead();

  const notificationDate = new Date(notification.created_at);

  // Display relative time for recent dates, e.g., "5 minutes ago"
  const timeAgo = formatDistanceToNow(notificationDate, {
    addSuffix: true,
    locale: de,
    includeSeconds: true,
  });

  // Format the date to German format if older than a day
  const germanFormattedDate = format(notificationDate, "dd/MM/yyyy", {
    locale: de,
  });

  // Logic to display "time ago" for recent notifications, otherwise the formatted date
  const displayTime =
    notificationDate > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ? timeAgo
      : germanFormattedDate;

  // const {
  //   mutate: deleteNotification,
  //   isPending: isDeleting,
  //   isError: isError3,
  //   error: error3,
  // } = useDeleteNotification();

  if (isError2) return <p>{error2.message}</p>;

  // if (isError3) return <p>{error3.message}</p>;

  return (
    <li
      className={`flex align-items-center justify-content-between border-bottom-1 border-300 `}
    >
      <div className="flex align-items-center gap-3">
        <p className={`${notification.is_read ? "font-normal" : "font-bold"}`}>
          {notification.message}
        </p>
        {!notification.is_read && (
          <button
            onClick={() => markNotificationAsRead(notification.id)}
            disabled={isUpdating}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            {/* Mark as read */}
            <EnvelopeOpen
              size={24}
              weight="light"
              target=".custom-target-icon"
              data-pr-tooltip="Mark as read"
              data-pr-position="bottom"
              className="mark-as-read"

              // tooltip="Mark as read"
              // tooltipOptions={{ position: "bottom" }}
            />
            <Tooltip target=".mark-as-read" style={{ fontSize: "0.8rem" }} />
            {/* <Tooltip target=".custom-target-icon" />
          <i
            className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge"
            data-pr-tooltip="No notifications"
            data-pr-position="right"
            data-pr-at="right+5 top"
            data-pr-my="left center-2"
            style={{ fontSize: "2rem", cursor: "pointer" }}
          >
            <Badge severity="danger"></Badge>
          </i> */}
          </button>
        )}
      </div>
      <p className="text-sm">{displayTime}</p>
      {/* I wouldn't need this because now when i delete the leave request, it simultaneously deletes the notificatons */}
      {/* <button
        onClick={() => deleteNotification(notification.id)}
        disabled={isDeleting}
      >
        Delete
      </button> */}
    </li>
  );
}

export default NotificationItem;

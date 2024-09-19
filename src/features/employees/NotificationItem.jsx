import { EnvelopeOpen } from "@phosphor-icons/react";
import { useMarkNotificationAsRead } from "./useMarkNotificationAsRead";
import { Tooltip } from "primereact/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

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

  if (isError2) return <p>{error2.message}</p>;

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
            />
            <Tooltip target=".mark-as-read" style={{ fontSize: "0.8rem" }} />
          </button>
        )}
      </div>
      <p className="text-sm">{displayTime}</p>
    </li>
  );
}

export default NotificationItem;

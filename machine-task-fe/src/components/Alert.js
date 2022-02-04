import React from "react";
import { store as notification } from "react-notifications-component";
const Alert = ({ trigger, title, type, message }) => {
  return (
    <div>
      {trigger
        ? notification.addNotification({
            title: title === undefined ? "Error !" : title,
            message: message === undefined ? "Some Thing Went Wrong" : message,
            type: type === undefined ? "danger" : type,
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          })
        : null}
    </div>
  );
};
export { Alert };

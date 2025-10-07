import toast from "react-hot-toast";

export const handleSuccess = (message) => {
  toast.success(message || "Operation successful!", {
    duration: 3000,
    position: "top-right",
    style: { fontWeight: "bold" },
  });
};

export const handleError = (message) => {
  toast.error(message || "Operation failed!", {
    duration: 3000,
    position: "top-right",
    style: { fontWeight: "bold"},
  });
};

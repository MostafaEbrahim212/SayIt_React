import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

const typeStyles = {
  success: {
    bg: "bg-green-500",
    icon: <FaCheckCircle className="text-2xl" />,
    border: "border-green-600",
  },
  error: {
    bg: "bg-red-500",
    icon: <FaTimesCircle className="text-2xl" />,
    border: "border-red-600",
  },
  warning: {
    bg: "bg-yellow-500",
    icon: <FaExclamationCircle className="text-2xl" />,
    border: "border-yellow-600",
  },
  info: {
    bg: "bg-blue-500",
    icon: <FaInfoCircle className="text-2xl" />,
    border: "border-blue-600",
  },
};

export default function Notification({
  id,
  type = "info",
  title,
  message,
  onClick,
  onClose,
  actions = [],
}) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = typeStyles[type] || typeStyles.info;

  console.log("Notification component rendered:", { id, type, title, message });

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
      handleClose();
    }
  };

  return (
    <div
      style={{
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        opacity: isExiting ? 0 : 1,
        transition: 'all 300ms ease',
        cursor: 'pointer',
        marginBottom: '10px'
      }}
      onClick={handleClick}
    >
      <div
        style={{
          backgroundColor: 
            type === 'success' ? '#10b981' :
            type === 'error' ? '#ef4444' :
            type === 'warning' ? '#eab308' :
            '#3b82f6',
          color: 'white',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid rgba(255,255,255,0.3)',
          position: 'relative',
          paddingRight: '40px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flexShrink: 0, paddingTop: '2px', fontSize: '20px' }}>
            {styles.icon}
          </div>

          <div style={{ flex: 1 }}>
            {title && <h3 style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{title}</h3>}
            {message && (
              <p style={{ fontSize: '14px', margin: title ? '4px 0 0 0' : 0 }}>{message}</p>
            )}

            {actions.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick?.();
                      handleClose();
                    }}
                    style={{
                      fontSize: '12px',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 200ms'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px'
          }}
          onMouseOver={(e) => e.target.style.color = '#ccc'}
          onMouseOut={(e) => e.target.style.color = 'white'}
          aria-label="Close notification"
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
}

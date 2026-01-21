import { useNotification } from '../hooks/useNotification';

export default function NotificationTest() {
  const notifSystem = useNotification();
  const { success, error, warning, info } = notifSystem;

  console.log("NotificationTest loaded, notifSystem:", notifSystem);

  const handleSuccess = () => {
    console.log("Success button clicked!");
    success('تم!', 'تم الحفظ بنجاح');
  };

  const handleError = () => {
    console.log("Error button clicked!");
    error('خطأ!', 'حدث خطأ ما');
  };

  const handleWarning = () => {
    console.log("Warning button clicked!");
    warning('تحذير!', 'تأكد من البيانات');
  };

  const handleInfo = () => {
    console.log("Info button clicked!");
    info('معلومة', 'هذه معلومة مهمة');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>🔔 Notification Test</h2>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleSuccess}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#10b981', 
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ✓ Success
        </button>
        
        <button 
          onClick={handleError}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#ef4444', 
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ✕ Error
        </button>
        
        <button 
          onClick={handleWarning}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#eab308', 
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ⚠ Warning
        </button>
        
        <button 
          onClick={handleInfo}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#3b82f6', 
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ⓘ Info
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          👇 الإشعارات ستظهر في الأسفل الأيسر من الشاشة
        </p>
        <p style={{ color: '#999', fontSize: '12px' }}>
          افتح Console (F12) لترى رسائل التشخيص
        </p>
      </div>
    </div>
  );
}

import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const alertStyles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: CheckCircleIcon,
      iconColor: 'text-green-400',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      closeColor: 'text-green-500 hover:text-green-600'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: XCircleIcon,
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      closeColor: 'text-red-500 hover:text-red-600'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      closeColor: 'text-yellow-500 hover:text-yellow-600'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      closeColor: 'text-blue-500 hover:text-blue-600'
    }
  };

  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div className={`rounded-md border p-4 ${style.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${style.titleColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`${title ? 'mt-2' : ''} text-sm ${style.messageColor}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.closeColor}`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
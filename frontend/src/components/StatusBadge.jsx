import { getStatusColor, getStatusText } from '../utils/helpers';
import { DELIVERY_STATUSES } from '../utils/constants';

const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  const statusInfo = DELIVERY_STATUSES.find(s => s.value === status);
  
  return (
    <span className={`status-badge border ${getStatusColor(status)} ${className}`}>
      {showIcon && statusInfo && <span className="mr-1">{statusInfo.icon}</span>}
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
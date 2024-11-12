import React from 'react';
import Chip from '@mui/material/Chip';

export type StatusType = 'paid' | 'pending' | 'cancelled' | 'credit' | 'retour' | 'default';

interface StatusChipProps {
    status: StatusType;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
    let chipColor: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' = 'default';
    let chipBackground = '';

    switch (status) {
        case 'paid':
            chipColor = 'success';
            chipBackground = '#4caf50ad'; // Green
            break;
        case 'pending':
            chipColor = 'warning';
            chipBackground = '#ffc107ad'; // Amber
            break;
        case 'cancelled':
            chipColor = 'error';
            chipBackground = '#f44336ad'; // Red
            break;
        case 'credit':
            chipColor = 'info';
            chipBackground = '#2196f3ad'; // Blue
            break;
        case 'retour':
            chipColor = 'success';
            chipBackground = '#8bc34a21'; // Light Green
            break;
        default:
            chipColor = 'default';
            chipBackground = '';
    }

    return (
        <Chip
            label={status}
            size="small"
            color={chipColor}
            style={{
                backgroundColor: chipBackground,
                padding: '0 8px',
                fontWeight: 600,
                textTransform: 'lowercase',
            }}
        />
    );
};

export default StatusChip;

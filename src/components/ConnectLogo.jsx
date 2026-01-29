import React from 'react';
import PropTypes from 'prop-types';

// Asset paths
const LOGO_ASSETS = {
    normal: '/src/assets/connect/Connect_logo_nomal.png',
    small: '/src/assets/connect/CNM.png',
    admin: '/src/assets/connect/5CNM.png',
};

const ConnectLogo = ({ variant = 'normal', className = '', style = {}, ...props }) => {
    // Determine size based on variant (can be overridden by class/style)
    const defaultStyles = {
        height: variant === 'small' ? '32px' : 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        ...style,
    };

    return (
        <img
            src={LOGO_ASSETS[variant]}
            alt={`Connect Logo ${variant}`}
            className={`connect-logo ${variant} ${className}`}
            style={defaultStyles}
            {...props}
        />
    );
};

ConnectLogo.propTypes = {
    variant: PropTypes.oneOf(['normal', 'small', 'admin']),
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ConnectLogo;

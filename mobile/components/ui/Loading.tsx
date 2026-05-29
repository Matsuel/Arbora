import React from 'react';
import { RefreshControl } from 'react-native';

const Loading = () => {
    return (
        <RefreshControl refreshing={true} />
    );
}

export default Loading
import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Home = () => {
    return (
        <div style={{ padding: 20 }}>
            <Title level={2}>¡Bienvenido al sistema Reservations Py!</Title>
            <p>Utiliza el menú de navegación para acceder a las funcionalidades del sistema.</p>
        </div>
    );
};

export default Home;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Home from './pages/Home';
import Personas from './pages/Personas';
import Habitaciones from './pages/Habitaciones';
import Reservas from './pages/Reservas';

const { Header, Content, Footer } = Layout;

const App = () => {
    return (
        <Router>
            <Layout>
                <Header>
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/personas">Personas</Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/habitaciones">Habitaciones</Link></Menu.Item>
                        <Menu.Item key="4"><Link to="/reservas">Reservas</Link></Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/personas" element={<Personas />} />
                        <Route path="/habitaciones" element={<Habitaciones />} />
                        <Route path="/reservas" element={<Reservas />} />
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Reservations Py ©2025 Created by Gus Lublin
                </Footer>
            </Layout>
        </Router>
    );
};

export default App;

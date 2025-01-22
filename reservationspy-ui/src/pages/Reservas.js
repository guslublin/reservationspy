import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button, Card, Table, message, Select, Modal, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from 'axios';

const Reservas = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchReservas();
    fetchHabitaciones();
    fetchPersonas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservas`);
      setReservas(response.data);
    } catch (error) {
      message.error('Error al obtener reservas');
    }
  };

  const fetchHabitaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/habitaciones`);
      setHabitaciones(response.data);
    } catch (error) {
      message.error('Error al obtener habitaciones');
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await axios.get(`${API_URL}/personas`);
      setPersonas(response.data);
    } catch (error) {
      message.error('Error al obtener personas');
    }
  };

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        fechaentrada: values.fechaentrada.format('YYYY-MM-DD'),
        fechasalida: values.fechasalida.format('YYYY-MM-DD'),
        habitacionid: values.habitacionid,
        personaid: values.personaid,
      };

      await axios.post(`${API_URL}/reservas`, formattedValues);
      message.success('Reserva registrada correctamente');
      form.resetFields();
      fetchReservas();
    } catch (error) {
      message.error(error.response?.data?.error || 'Error al registrar la reserva');
    }
  };

  const handleEdit = (record) => {
    setEditingReserva(record);
    editForm.setFieldsValue({
      fechaentrada: dayjs(record.fechaentrada),
      fechasalida: dayjs(record.fechasalida),
      habitacionid: record.habitacionid,
      personaid: record.personaid,
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Estás seguro de que deseas eliminar esta reserva?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}/reservas/${id}`);
          message.success('Reserva eliminada correctamente');
          fetchReservas();
        } catch (error) {
          message.error('Error al eliminar la reserva');
        }
      },
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const formattedValues = {
        fechaentrada: values.fechaentrada.format('YYYY-MM-DD'),
        fechasalida: values.fechasalida.format('YYYY-MM-DD'),
      };
      await axios.put(`${API_URL}/reservas/${editingReserva.id}`, formattedValues);
      message.success('Reserva actualizada correctamente');
      setModalVisible(false);
      fetchReservas();
    } catch (error) {
      message.error('Error al actualizar la reserva');
    }
  };

  const columns = [
    { title: 'Fecha Reserva', dataIndex: 'fechareserva', key: 'fechareserva', render: (text) => dayjs(text).format('DD-MM-YYYY') },
    { title: 'Fecha Entrada', dataIndex: 'fechaentrada', key: 'fechaentrada', render: (text) => dayjs(text).format('DD-MM-YYYY') },
    { title: 'Fecha Salida', dataIndex: 'fechasalida', key: 'fechasalida', render: (text) => dayjs(text).format('DD-MM-YYYY') },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { title: 'Monto', dataIndex: 'montoreserva', key: 'montoreserva', align: 'right', render: (text) => `Gs. ${Number(text).toLocaleString()}` },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ backgroundColor: 'green', borderColor: 'green' }} />
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Card title="Registrar Reserva">
        <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
            label="Fecha Entrada" 
            name="fechaentrada" 
            rules={[
                { 
                required: true, 
                message: 'Seleccione una fecha',
                validator: (_, value) => {
                    if (!value) {
                    return Promise.reject('Seleccione una fecha');
                    }
                    if (value.isAfter(dayjs(), 'day') || value.isSame(dayjs(), 'day')) {
                    return Promise.resolve();
                    }
                    return Promise.reject('La fecha debe ser mayor o igual a hoy');
                }
                }
            ]}
            >
            <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          <Form.Item 
            label="Fecha Salida" 
            name="fechasalida" 
            dependencies={['fechaentrada']} 
            rules={[
              { required: true, message: 'Seleccione una fecha' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.isAfter(getFieldValue('fechaentrada'), 'day')) {
                    return Promise.resolve();
                  }
                  return Promise.reject('La fecha de salida debe ser mayor a la de entrada');
                },
              }),
            ]}
          >
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item label="Persona" name="personaid" rules={[{ required: true, message: 'Seleccione una persona' }]}>
            <Select options={personas.map(p => ({ value: p.id, label: p.nombrecompleto }))} placeholder="Seleccione una persona" />
          </Form.Item>
          <Form.Item label="Habitación" name="habitacionid" rules={[{ required: true, message: 'Seleccione una habitación' }]}>
            <Select options={habitaciones.map(h => ({ value: h.id, label: `Piso ${h.habitacionpiso}, Nro ${h.habitacionnro}` }))} placeholder="Seleccione una habitación" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Guardar Reserva</Button>
        </Form>
      </Card>
      <Table dataSource={reservas} columns={columns} rowKey="id" />
      <Modal title="Editar Reserva" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleUpdate}>
        <Form form={editForm} layout="vertical">
          <Form.Item label="Fecha Entrada" name="fechaentrada" rules={[{ required: true }]}>
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item label="Fecha Salida" name="fechasalida" rules={[{ required: true }]}>
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reservas;

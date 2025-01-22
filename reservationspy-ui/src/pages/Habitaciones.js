import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Table, message, Modal, Space, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Habitaciones = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [habitaciones, setHabitaciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabitacion, setEditingHabitacion] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const fetchHabitaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/habitaciones`);
      setHabitaciones(response.data);
    } catch (error) {
      message.error('Error al obtener la lista de habitaciones');
    }
  };

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        tienetelevision: values.tienetelevision || false,
        tienefrigobar: values.tienefrigobar || false, 
      };
  
      console.log("Enviando datos:", formattedValues);
      await axios.post(`${API_URL}/habitaciones`, formattedValues);
      message.success('Habitación registrada correctamente');
      form.resetFields();
      fetchHabitaciones();
    } catch (error) {
      message.error(error.response?.data?.error || 'Error al registrar la habitación');
    }
  };
  

  const handleEdit = (record) => {
    setEditingHabitacion(record);
    editForm.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Estás seguro de que deseas eliminar esta habitación?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}/habitaciones/${id}`);
          message.success('Habitación eliminada correctamente');
          fetchHabitaciones();
        } catch (error) {
          message.error('Error al eliminar la habitación');
        }
      },
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await axios.put(`${API_URL}/habitaciones/${editingHabitacion.id}`, values);
      message.success('Habitación actualizada correctamente');
      setModalVisible(false);
      fetchHabitaciones();
    } catch (error) {
      message.error('Error al actualizar la habitación');
    }
  };

  const columns = [
    { title: 'Piso', dataIndex: 'habitacionpiso', key: 'habitacionpiso' },
    { title: 'Número', dataIndex: 'habitacionnro', key: 'habitacionnro' },
    { title: 'Camas', dataIndex: 'cantcamas', key: 'cantcamas' },
    { title: 'TV', dataIndex: 'tienetelevision', key: 'tienetelevision', render: (text) => (text ? 'Sí' : 'No') },
    { title: 'Frigobar', dataIndex: 'tienefrigobar', key: 'tienefrigobar', render: (text) => (text ? 'Sí' : 'No') },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ backgroundColor: 'green', borderColor: 'green' }}>
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Card title="Registrar Habitación">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
            label="Piso" 
            name="habitacionpiso" 
            rules={[{ required: true, type: 'number', min: 1, max: 10 }]}
        >
            <InputNumber placeholder="Ingrese el piso (1-10)" />
        </Form.Item>

        <Form.Item 
            label="Número" 
            name="habitacionnro" 
            rules={[
            { required: true, type: 'number', min: 1, max: 20 },
            ({ getFieldValue }) => ({
                validator(_, value) {
                const piso = getFieldValue('habitacionpiso');
                const existe = habitaciones.some(
                    (hab) => hab.habitacionpiso === piso && hab.habitacionnro === value
                );
                if (existe) {
                    return Promise.reject(new Error('Ya existe una habitación con este número en el mismo piso'));
                }
                return Promise.resolve();
                },
            }),
            ]}
        >
            <InputNumber placeholder="Ingrese el número (1-20)" />
        </Form.Item>

        <Form.Item 
            label="Cantidad de Camas" 
            name="cantcamas" 
            rules={[{ required: true, type: 'number', min: 1, max: 4 }]}
        >
            <InputNumber placeholder="Ingrese la cantidad de camas (1-4)" />
        </Form.Item>

        <Form.Item name="tienetelevision" valuePropName="checked">
            <Checkbox>¿Tiene televisión?</Checkbox>
        </Form.Item>

        <Form.Item name="tienefrigobar" valuePropName="checked">
            <Checkbox>¿Tiene frigobar?</Checkbox>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit">
            Guardar Habitación
            </Button>
        </Form.Item>
        </Form>

      </Card>

      <Card title="Listado de Habitaciones" style={{ marginTop: '20px' }}>
        <Table dataSource={habitaciones} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="Editar Habitación"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Volver
          </Button>,
          <Button key="save" type="primary" onClick={handleUpdate}>
            Grabar
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Piso" name="habitacionpiso">
            <InputNumber />
          </Form.Item>

          <Form.Item label="Número" name="habitacionnro">
            <InputNumber />
          </Form.Item>

          <Form.Item label="Cantidad de Camas" name="cantcamas">
            <InputNumber />
          </Form.Item>

          <Form.Item name="tienetelevision" valuePropName="checked">
            <Checkbox>¿Tiene televisión?</Checkbox>
          </Form.Item>

          <Form.Item name="tienefrigobar" valuePropName="checked">
            <Checkbox>¿Tiene frigobar?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Habitaciones;

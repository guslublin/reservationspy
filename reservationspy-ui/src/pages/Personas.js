import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Table, message, Modal, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Personas = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [personas, setPersonas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get(`${API_URL}/personas`);
      setPersonas(response.data);
    } catch (error) {
      message.error('Error al obtener la lista de personas');
    }
  };

  const onFinish = async (values) => {
    try {
      await axios.post(`${API_URL}/personas`, values);
      message.success('Persona registrada correctamente');
      form.resetFields();
      fetchPersonas();
    } catch (error) {
      message.error('Error al registrar la persona');
    }
  };

  const handleEdit = (record) => {
    setEditingPersona(record);
    editForm.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Estás seguro de que deseas eliminar esta persona?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}/personas/${id}`);
          message.success('Persona eliminada correctamente');
          fetchPersonas();
        } catch (error) {
          message.error('Error al eliminar la persona');
        }
      },
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await axios.put(`${API_URL}/personas/${editingPersona.id}`, values);
      message.success('Persona actualizada correctamente');
      setModalVisible(false);
      fetchPersonas();
    } catch (error) {
      message.error('Error al actualizar la persona');
    }
  };

  const columns = [
    { title: 'Nombre Completo', dataIndex: 'nombrecompleto', key: 'nombrecompleto' },
    { title: 'Documento', dataIndex: 'nrodocumento', key: 'nrodocumento' },
    { title: 'Correo', dataIndex: 'correo', key: 'correo' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
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
      <Card title="Registrar Persona">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Nombre Completo" name="nombrecompleto" rules={[{ required: true, message: 'Ingrese el nombre completo' }]}>
            <Input placeholder="Ingrese nombre completo" />
          </Form.Item>

          <Form.Item label="Número de Documento" name="nrodocumento" rules={[{ required: true, message: 'Ingrese el número de documento' }]}>
            <Input placeholder="Ingrese número de documento" />
          </Form.Item>

          <Form.Item label="Correo Electrónico" name="correo" rules={[{ required: true, message: 'Ingrese el correo' }, { type: 'email', message: 'Correo no válido' }]}>
            <Input placeholder="Ingrese correo electrónico" />
          </Form.Item>

          <Form.Item label="Teléfono" name="telefono" rules={[{ required: true, message: 'Ingrese el teléfono' }]}>
            <Input placeholder="Ingrese teléfono" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar Persona
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Listado de Personas" style={{ marginTop: '20px' }}>
        <Table dataSource={personas} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="Editar Persona"
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
          <Form.Item label="Nombre Completo" name="nombrecompleto" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Número de Documento" name="nrodocumento" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Correo Electrónico" name="correo" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Teléfono" name="telefono" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Personas;

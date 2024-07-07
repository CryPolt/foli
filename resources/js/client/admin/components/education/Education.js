import React, { useEffect, useState } from 'react';
import { Drawer, Button, Spin, Input, Form } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import HTTP from '../../../common/helpers/HTTP';
import Utils from '../../../common/helpers/Utils';
import Routes from '../../../common/helpers/Routes';

const StyledDrawer = styled(Drawer)`
    .ant-drawer-content-wrapper {
        width: 520px !important;
        @media (max-width: 768px) {
            max-width: calc(100vw - 16px) !important;
        }
    }
`;

const Education = (props) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState((typeof props.loading !== 'undefined') ? props.loading : false);
    const [componentLoading, setComponentLoading] = useState((typeof props.componentLoading !== 'undefined') ? props.componentLoading : false);

    useEffect(() => {
        form.setFieldsValue({
            id: props.itemToEdit ? props.itemToEdit.id : '',
            institution: props.itemToEdit ? props.itemToEdit.institution : '',
            period: props.itemToEdit ? props.itemToEdit.period : '',
            degree: props.itemToEdit ? props.itemToEdit.degree : '',
            cgpa: props.itemToEdit ? props.itemToEdit.cgpa : '',
            department: props.itemToEdit ? props.itemToEdit.department : '',
            thesis: props.itemToEdit ? props.itemToEdit.thesis : '',
        });
    }, [props.itemToEdit])

    useEffect(() => {
        setTimeout(() => {
            setVisible(props.visible);
        }, 100);
    }, [props.visible])

    useEffect(() => {
        if (typeof props.loading !== 'undefined') {
            setLoading(props.loading)
        }
    }, [props.loading])

    useEffect(() => {
        if (typeof props.componentLoading !== 'undefined') {
            setComponentLoading(props.componentLoading)
        }
    }, [props.componentLoading])

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            props.handleCancel();
        }, 400);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {

                // Сохранение формы
                setLoading(true);

                HTTP[values.id ? 'put' : 'post'](Routes.api.admin.education+(values.id ? `/${values.id}` : '' ), {
                    id: values.id,
                    institution: values.institution,
                    cgpa: values.cgpa,
                    degree: values.degree,
                    department: values.department,
                    period: values.period,
                    thesis: values.thesis,
                })
                    .then(response => {
                        Utils.handleSuccessResponse(response, () => {
                            form.resetFields();
                            Utils.showNotification(response.data.message, 'success');
                            props.submitCallback();
                        })
                    })
                    .catch((error) => {
                        Utils.handleException(error);
                    }).finally(() => {
                    setLoading(false);
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    return (
        <StyledDrawer
            title={props.title}
            onClose={handleClose}
            visible={visible}
            destroyOnClose={true}
            maskClosable={false}
            forceRender={true}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button disabled={componentLoading} onClick={handleClose} style={{ marginRight: 8 }}>
                        Отмена
                    </Button>
                    <Button disabled={componentLoading} onClick={handleOk} type="primary" loading={loading}>
                        Сохранить
                    </Button>
                </div>
            }
        >
            <Spin spinning={componentLoading} size="large" delay={500}>
                <Form
                    preserve={false}
                    form={form}
                    layout="vertical"
                    name="education"
                >
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="institution"
                        label="Учебное заведение"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, введите название учебного заведения',
                            },
                        ]}
                    >
                        <Input placeholder="Введите название учебного заведения"/>
                    </Form.Item>
                    <Form.Item name="period" label="Период обучения">
                        <Input placeholder="Введите период обучения"/>
                    </Form.Item>
                    <Form.Item name="degree" label="Степень">
                        <Input placeholder="Введите степень"/>
                    </Form.Item>
                    <Form.Item name="cgpa" label="Средний балл">
                        <Input placeholder="Введите средний балл"/>
                    </Form.Item>
                    <Form.Item name="department" label="Факультет">
                        <Input placeholder="Введите факультет"/>
                    </Form.Item>
                    <Form.Item name="thesis" label="Дипломная работа">
                        <Input placeholder="Введите название дипломной работы"/>
                    </Form.Item>
                </Form>
            </Spin>
        </StyledDrawer>
    )
}

Education.propTypes = {
    handleCancel: PropTypes.func.isRequired,
    submitCallback: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    itemToEdit: PropTypes.object,
    loading: PropTypes.bool,
    componentLoading: PropTypes.bool,
    title: PropTypes.node,
}

export default Education;

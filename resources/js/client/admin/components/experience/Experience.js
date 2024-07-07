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

const Experience = (props) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState((typeof props.loading !== 'undefined') ? props.loading : false);
    const [componentLoading, setComponentLoading] = useState((typeof props.componentLoading !== 'undefined') ? props.componentLoading : false);

    useEffect(() => {
        form.setFieldsValue({
            id: props.itemToEdit ? props.itemToEdit.id : '',
            company: props.itemToEdit ? props.itemToEdit.company : '',
            period: props.itemToEdit ? props.itemToEdit.period : '',
            position: props.itemToEdit ? props.itemToEdit.position : '',
            details: props.itemToEdit ? props.itemToEdit.details : ''
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

                // Сохранить форму
                setLoading(true);

                HTTP[values.id ? 'put' : 'post'](Routes.api.admin.experiences+(values.id ? `/${values.id}` : '' ), {
                    id: values.id,
                    company: values.company,
                    position: values.position,
                    details: values.details,
                    period: values.period,
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
                console.log('Ошибка валидации:', info);
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
                    name="experience"
                >
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="company"
                        label="Компания"
                        rules={[
                            {
                                required: true,
                                message: 'Введите название компании',
                            },
                        ]}
                    >
                        <Input placeholder="Введите название компании"/>
                    </Form.Item>
                    <Form.Item name="period" label="Период">
                        <Input placeholder="Введите период"/>
                    </Form.Item>
                    <Form.Item
                        name="position"
                        label="Должность"
                        rules={[
                            {
                                required: true,
                                message: 'Введите должность',
                            },
                        ]}
                    >
                        <Input placeholder="Введите должность"/>
                    </Form.Item>
                    <Form.Item name="details" label="Детали">
                        <Input.TextArea rows={4} placeholder="Введите детали"/>
                    </Form.Item>
                </Form>
            </Spin>
        </StyledDrawer>
    )
}

Experience.propTypes = {
    handleCancel: PropTypes.func.isRequired,
    submitCallback: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    itemToEdit: PropTypes.object,
    loading: PropTypes.bool,
    componentLoading: PropTypes.bool,
    title: PropTypes.node,
}

export default Experience;
